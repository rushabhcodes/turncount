"""Inspect exported Gerber geometry, without changing manufacturing files.

Requires: python -m pip install gerbonara shapely
Usage: python scripts/check-gerbers.py dist/fab-audit dist/index/circuit.json
"""
import json
import sys
from pathlib import Path

from gerbonara import GerberFile
from gerbonara.utils import MM
from shapely.geometry import GeometryCollection, Point, Polygon, box
from shapely.ops import unary_union

directory = Path(sys.argv[1])
circuit = json.loads(Path(sys.argv[2]).read_text())
board = next(entry for entry in circuit if entry["type"] == "pcb_board")
outline = Polygon([(point["x"], point["y"]) for point in board["outline"]])


def geometry(filename):
    result = GeometryCollection()
    pending = []
    polarity = None

    def flush():
        nonlocal result, pending
        if pending:
            shape = unary_union(pending)
            result = result.union(shape) if polarity else result.difference(shape)
            pending = []

    for obj in GerberFile.open(directory / filename).objects:
        for primitive in obj.to_primitives(unit=MM):
            if polarity is not None and polarity != primitive.polarity_dark:
                flush()
            polarity = primitive.polarity_dark
            points = primitive.to_arc_poly().approximate_arcs(max_error=0.0005).outline
            polygon = Polygon(points)
            # A full-radius rounded rectangle contains zero-width/height macro
            # rectangles as well as its nonzero circle/rectangle primitives.
            if polygon.area < 1e-12:
                continue
            assert polygon.is_valid, f"Invalid polygon in {filename}"
            pending.append(polygon)
    flush()
    return result


radio_source = next(e for e in circuit if e["type"] == "source_component" and e["name"] == "U1")
radio_pcb = next(e for e in circuit if e["type"] == "pcb_component" and e["source_component_id"] == radio_source["source_component_id"])
radio_lands = unary_union([
    box(e["x"] - e["width"] / 2, e["y"] - e["height"] / 2,
        e["x"] + e["width"] / 2, e["y"] + e["height"] / 2)
    for e in circuit if e["type"] == "pcb_smtpad" and e["pcb_component_id"] == radio_pcb["pcb_component_id"]
])
rf_voids = {
    "top": [box(18.165, 0.15, 22.535, 3.95), box(17.412, -3.25, 17.815, 3.95)],
    "bottom": [box(17.551, 0.15, 22.535, 4.8)],
}
outboard_void = box(12.55, 4.3, 24.5, 24.5)

metrics = {}
conductors = {}
for prefix, layer in [("F", "top"), ("B", "bottom")]:
    copper = geometry(f"{prefix}_Cu.gbr")
    mask = geometry(f"{prefix}_Mask.gbr")
    assert copper.is_valid
    conductors[layer] = list(copper.geoms) if copper.geom_type == "MultiPolygon" else [copper]
    assert outline.covers(copper), f"{layer}: copper outside board"
    edge_gap = copper.distance(outline.boundary)
    assert edge_gap >= 0.199, f"{layer}: copper edge gap {edge_gap:.4f} mm"
    drill_gaps = []
    for hole in (entry for entry in circuit if entry["type"] == "pcb_hole"):
        assert hole["hole_shape"] == "circle", "Extend checker for non-circular NPTH"
        gap = copper.distance(Point(hole["x"], hole["y"])) - hole["hole_diameter"] / 2
        drill_gaps.append(gap)
        assert gap >= 0.199, f"{layer}: NPTH copper clearance {gap:.4f} mm"
    for via in (entry for entry in circuit if entry["type"] == "pcb_via"):
        assert not mask.covers(Point(via["x"], via["y"])), f"{layer}: via is not tented"
    # Imported module lands are allowed; no other copper may enter RF voids.
    foreign_copper = copper.difference(radio_lands.buffer(1e-5)) if layer == "top" else copper
    intrusion = foreign_copper.intersection(unary_union(rf_voids[layer] + [outboard_void])).area
    assert intrusion < 1e-7, f"{layer}: foreign copper intrudes into ANNA antenna region"
    metrics[layer] = {
        "copper_edge_gap_mm": round(edge_gap, 4),
        "minimum_NPTH_copper_gap_mm": round(min(drill_gaps), 4),
        "antenna_copper_intrusion_mm2": intrusion,
        "via_tenting": "pass",
    }

# Verify opens as well as shorts: join actual copper regions across drilled
# vias, then require every PCB port on each intended net to share a region.
regions = [(layer, index) for layer, shapes in conductors.items() for index in range(len(shapes))]
parents = {region: region for region in regions}


def root(region):
    while parents[region] != region:
        parents[region] = parents[parents[region]]
        region = parents[region]
    return region


def contacts(x, y, layers):
    point = Point(x, y)
    return [(layer, index) for layer in layers for index, shape in enumerate(conductors[layer])
            if shape.covers(point) or shape.distance(point) < 1e-5]


for via in (entry for entry in circuit if entry["type"] == "pcb_via"):
    touched = contacts(via["x"], via["y"], via["layers"])
    assert len(touched) >= 2, f"{via['pcb_via_id']}: missing copper contact on a layer"
    for region in touched[1:]:
        parents[root(region)] = root(touched[0])

source_ports = {entry["source_port_id"]: entry for entry in circuit if entry["type"] == "source_port"}
nets = {}
for port in (entry for entry in circuit if entry["type"] == "pcb_port"):
    source = source_ports.get(port["source_port_id"], {})
    key = source.get("subcircuit_connectivity_map_key")
    if key is None:
        continue
    touched = contacts(port["x"], port["y"], port["layers"])
    assert touched, f"{port['pcb_port_id']}: no exported copper at port"
    nets.setdefault(key, set()).update(root(region) for region in touched)
for key, connected in nets.items():
    assert len(connected) == 1, f"Open connection in {key}: {len(connected)} copper regions"
net_by_region = {}
for key, connected in nets.items():
    for region in connected:
        assert region not in net_by_region or net_by_region[region] == key, "Short between intended nets"
        net_by_region[region] = key
minimum_copper_gap = float("inf")
for layer, shapes in conductors.items():
    for index, shape in enumerate(shapes):
        for other_index in range(index + 1, len(shapes)):
            if root((layer, index)) == root((layer, other_index)):
                continue
            gap = shape.distance(shapes[other_index])
            minimum_copper_gap = min(minimum_copper_gap, gap)
            assert gap >= 0.099, f"{layer}: separate conductor clearance {gap:.4f} mm"
metrics["physical_connectivity"] = {
    "nets_checked": len(nets), "opens": 0, "shorts": 0,
    "minimum_separate_conductor_gap_mm": round(minimum_copper_gap, 4),
}

paste = geometry("F_Paste.gbr")
pads = [entry for entry in circuit if entry["type"] == "pcb_smtpad"]
for port in (entry for entry in circuit if entry["type"] == "source_port"):
    source = next((entry for entry in circuit if entry["type"] == "source_component" and
                   entry["source_component_id"] == port.get("source_component_id")), None)
    if source is None or source["ftype"] != "simple_test_point":
        continue
    pcb = next(entry for entry in circuit if entry["type"] == "pcb_port" and
               entry["source_port_id"] == port["source_port_id"])
    assert not paste.covers(Point(pcb["x"], pcb["y"])), f"{source['name']}: paste on probe pad"

print(json.dumps(metrics, indent=2))
print("Exported copper connectivity, outline, NPTH clearance, antenna exclusion, via tenting and probe stencil checks passed.")
