"""Generate the simplified TurnCount tray and cover using Blender booleans.

Run: blender -b --python mechanical/generate_enclosure.py
All dimensions are millimetres. The OBJ files are used by the circuit 3D view;
the 3MF files are the print-ready versions of the enclosure parts.
"""

import math
import os
import zipfile
from xml.etree.ElementTree import Element, SubElement, tostring

import bpy


OUT = os.path.join(os.path.dirname(__file__), "output")
os.makedirs(OUT, exist_ok=True)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)


def cylinder(name, radius, z0, z1, x=0, y=0, vertices=128):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices, radius=radius, depth=z1 - z0,
        location=(x, y, (z0 + z1) / 2),
    )
    obj = bpy.context.object
    obj.name = name
    return obj


def boolean(target, tool, operation):
    bpy.context.view_layer.objects.active = target
    mod = target.modifiers.new(f"{operation}_{tool.name}", "BOOLEAN")
    mod.operation = operation
    mod.solver = "EXACT"
    mod.object = tool
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(tool, do_unlink=True)


def ring(name, outer_radius, inner_radius, z0, z1):
    obj = cylinder(name, outer_radius, z0, z1)
    boolean(obj, cylinder(f"{name}_bore", inner_radius, z0 - 0.1, z1 + 0.1), "DIFFERENCE")
    return obj


def fuse(target, other):
    boolean(target, other, "UNION")


def cut_at(target, radius, z0, z1, x, y, name):
    boolean(target, cylinder(name, radius, z0, z1, x, y), "DIFFERENCE")


def export_obj(obj, path):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.wm.obj_export(filepath=path, export_selected_objects=True,
                          export_materials=False, forward_axis="Y", up_axis="Z")


def export_3mf(obj, path, part_name, flip_z=False):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    evaluated = obj.evaluated_get(depsgraph)
    mesh = evaluated.to_mesh()
    mesh.calc_loop_triangles()
    model = Element("model", {"unit": "millimeter", "xml:lang": "en-US",
                               "xmlns": "http://schemas.microsoft.com/3dmanufacturing/core/2015/02"})
    resources = SubElement(model, "resources")
    item = SubElement(resources, "object", {"id": "1", "name": part_name, "type": "model"})
    m = SubElement(item, "mesh")
    vertices = SubElement(m, "vertices")
    for v in mesh.vertices:
        x, y, z = evaluated.matrix_world @ v.co
        if flip_z:
            z = 18.8 - z
        SubElement(vertices, "vertex", {"x": f"{x:.5f}", "y": f"{y:.5f}", "z": f"{z:.5f}"})
    triangles = SubElement(m, "triangles")
    for tri in mesh.loop_triangles:
        a, b, c = tri.vertices
        if flip_z:
            b, c = c, b
        SubElement(triangles, "triangle", {"v1": str(a), "v2": str(b), "v3": str(c)})
    SubElement(SubElement(model, "build"), "item", {"objectid": "1"})
    evaluated.to_mesh_clear()
    model_xml = b'<?xml version="1.0" encoding="UTF-8"?>\n' + tostring(model, encoding="utf-8")
    content_types = b'''<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
</Types>'''
    relationships = b'''<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>'''
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", content_types)
        archive.writestr("_rels/.rels", relationships)
        archive.writestr("3D/3dmodel.model", model_xml)


# Lower tray: a plain circular shell, board support ledge, and phone magnets.
tray = cylinder("lower_tray", 32.0, 0, 11.5)
boolean(tray, cylinder("tray_interior", 24.8, 2.2, 11.7), "DIFFERENCE")
fuse(tray, ring("pcb_support_ledge", 25.55, 22.8, 7.65, 8.4))

# Six 6 mm magnets are retained in the phone-facing side. No USB cutout or
# legacy pouch-battery pocket is present; the central bay clears the cell.
for i in range(6):
    angle = math.radians(i * 60)
    cut_at(tray, 3.12, -0.1, 2.25,
           27.7 * math.cos(angle), 27.7 * math.sin(angle), f"magnet_{i}")

# Three M2 cover screws on a 28 mm pitch radius.
screw_angles = (30, 150, 270)
for i, degrees in enumerate(screw_angles):
    angle = math.radians(degrees)
    cut_at(tray, 0.95, -0.1, 11.7,
           28.0 * math.cos(angle), 28.0 * math.sin(angle), f"tray_screw_{i}")

# Upper cover: flat top, short cylindrical skirt and matching screw holes.
cover = cylinder("upper_cover", 32.72, 11.5, 18.8)
boolean(cover, cylinder("cover_cavity", 29.95, 11.4, 17.0), "DIFFERENCE")
# Opening for the encoder shaft and square drive pin.
cut_at(cover, 3.0, 16.9, 18.9, 0, 0, "encoder_shaft_clearance")
for i, degrees in enumerate(screw_angles):
    angle = math.radians(degrees)
    cut_at(cover, 1.25, 11.4, 18.9,
           28.0 * math.cos(angle), 28.0 * math.sin(angle), f"cover_screw_{i}")

for obj, stem, title in (
    (tray, "01_lower_tray", "TurnCount simplified lower tray"),
    (cover, "02_upper_cover", "TurnCount simplified upper cover"),
):
    export_obj(obj, os.path.join(OUT, f"{stem}_assembly.obj"))
    export_3mf(obj, os.path.join(OUT, f"{stem}.3mf"), title, flip_z=(stem == "02_upper_cover"))

print("Generated simplified tray and cover OBJ/3MF files in", OUT)
