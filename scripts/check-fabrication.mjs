import { readFileSync } from "node:fs"

// Geometry and assembly guards for a JLCPCB 2-layer, 1 oz prototype.
// Passing these guards does not replace the datasheet/mechanical review or DRC.
const circuit = JSON.parse(readFileSync(process.argv[2] ?? "dist/index/circuit.json", "utf8"))
const entries = (type) => circuit.filter((entry) => entry.type === type)
const sources = new Map(entries("source_component").map((entry) => [entry.source_component_id, entry]))
const owners = new Map(entries("pcb_component").map((entry) => [entry.pcb_component_id, sources.get(entry.source_component_id)]))
const problems = []
const check = (condition, message) => { if (!condition) problems.push(message) }
const eps = 1e-5
const vias = entries("pcb_via")
for (const via of vias) {
  check(via.hole_diameter >= 0.3 - eps, `${via.pcb_via_id}: drill below standard 0.30 mm target`)
  check(via.outer_diameter >= 0.45 - eps, `${via.pcb_via_id}: pad below 0.45 mm standard-cost target`)
  check((via.outer_diameter - via.hole_diameter) / 2 >= 0.075 - eps,
    `${via.pcb_via_id}: via annular ring below 0.075 mm preferred minimum`)
}
let minimumViaGap = Infinity
for (let i = 0; i < vias.length; i++) {
  for (const other of vias.slice(i + 1)) {
    const via = vias[i]
    const gap = Math.hypot(via.x - other.x, via.y - other.y) - (via.hole_diameter + other.hole_diameter) / 2
    minimumViaGap = Math.min(minimumViaGap, gap)
    check(gap >= 0.2 - eps, `${via.pcb_via_id}/${other.pcb_via_id}: drill spacing below 0.20 mm`)
  }
}
for (const hole of entries("pcb_plated_hole")) {
  const rings = hole.shape === "circle"
    ? [(hole.outer_diameter - hole.hole_diameter) / 2]
    : [(hole.outer_width - hole.hole_width) / 2, (hole.outer_height - hole.hole_height) / 2]
  check(rings.every((ring) => Number.isFinite(ring) && ring >= 0.18 - eps),
    `${hole.pcb_plated_hole_id}: component-hole annular ring below 0.18 mm`)
}
for (const trace of entries("pcb_trace")) {
  for (const point of trace.route) {
    if (point.route_type === "wire") check(point.width >= 0.1 - eps,
      `${trace.pcb_trace_id}: copper trace below 0.10 mm`)
  }
}
const isPopulated = (source) => source && !source.do_not_place && source.ftype !== "simple_test_point"
for (const source of sources.values()) {
  if (isPopulated(source)) check(source.supplier_part_numbers?.jlcpcb?.length > 0,
    `${source.name}: no JLCPCB assembly part code`)
}
const contains = (pad, point) => {
  if (pad.shape === "polygon") {
    let inside = false
    const points = pad.points
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const a = points[i], b = points[j]
      if ((a.y > point.y) !== (b.y > point.y) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside
    }
    return inside
  }
  const angle = -(pad.ccw_rotation ?? 0) * Math.PI / 180
  const dx = point.x - pad.x, dy = point.y - pad.y
  const x = dx * Math.cos(angle) - dy * Math.sin(angle)
  const y = dx * Math.sin(angle) + dy * Math.cos(angle)
  if (pad.shape === "circle") return Math.hypot(x, y) <= pad.radius + eps
  if (pad.shape === "pill" || pad.shape === "rotated_pill") {
    const radius = Math.min(pad.width, pad.height) / 2
    const horizontal = pad.width >= pad.height
    const along = Math.abs(horizontal ? x : y)
    const across = horizontal ? y : x
    const halfSegment = Math.abs(pad.width - pad.height) / 2
    return Math.hypot(Math.max(0, along - halfSegment), across) <= radius + eps
  }
  return Math.abs(x) <= pad.width / 2 + eps && Math.abs(y) <= pad.height / 2 + eps
}
// Standard tented vias must not drill through populated SMT solder lands.
const distanceToPad = (pad, point) => {
  if (contains(pad, point)) return 0
  if (pad.shape === "polygon") {
    return Math.min(...pad.points.map((a, i) => {
      const b = pad.points[(i + 1) % pad.points.length]
      const vx = b.x - a.x, vy = b.y - a.y
      const t = Math.max(0, Math.min(1, ((point.x - a.x) * vx + (point.y - a.y) * vy) / (vx * vx + vy * vy)))
      return Math.hypot(point.x - a.x - t * vx, point.y - a.y - t * vy)
    }))
  }
  const angle = -(pad.ccw_rotation ?? 0) * Math.PI / 180
  const dx = point.x - pad.x, dy = point.y - pad.y
  const x = dx * Math.cos(angle) - dy * Math.sin(angle)
  const y = dx * Math.sin(angle) + dy * Math.cos(angle)
  if (pad.shape === "circle") return Math.max(0, Math.hypot(x, y) - pad.radius)
  if (pad.shape === "pill" || pad.shape === "rotated_pill") {
    const horizontal = pad.width >= pad.height
    const along = Math.abs(horizontal ? x : y), across = horizontal ? y : x
    return Math.max(0, Math.hypot(Math.max(0, along - Math.abs(pad.width - pad.height) / 2), across) - Math.min(pad.width, pad.height) / 2)
  }
  return Math.hypot(Math.max(0, Math.abs(x) - pad.width / 2), Math.max(0, Math.abs(y) - pad.height / 2))
}
for (const pad of entries("pcb_smtpad")) {
  const source = owners.get(pad.pcb_component_id)
  if (!isPopulated(source) || pad.is_covered_with_solder_mask) continue
  for (const via of vias) {
    if (!via.layers.includes(pad.layer)) continue
    check(distanceToPad(pad, via) >= via.hole_diameter / 2 - eps,
      `${source.name}.${pad.port_hints?.join("/")}: via drill intersects solder land at (${via.x.toFixed(3)}, ${via.y.toFixed(3)})`)
  }
}

const pastes = entries("pcb_solder_paste")
for (const pad of entries("pcb_smtpad")) {
  const source = owners.get(pad.pcb_component_id)
  if (!isPopulated(source) || pad.is_covered_with_solder_mask) continue
  // Several native aperture pads can lie within the same imported copper pad.
  // Check their position as well as the associated pad ID.
  const hasPaste = pastes.some((paste) => paste.layer === pad.layer &&
    (paste.pcb_smtpad_id === pad.pcb_smtpad_id || contains(pad, paste)))
  check(hasPaste, `${source.name}.${pad.port_hints?.join("/") ?? pad.pcb_smtpad_id}: missing stencil aperture`)
}
check(!circuit.some((entry) => entry.type.endsWith("_error")), "Circuit JSON contains errors")
console.log(`${vias.length} vias; minimum via drill gap ${minimumViaGap.toFixed(3)} mm`)
if (problems.length) {
  console.error(`Fabrication guards FAILED (${problems.length} findings):\n${problems.map((problem) => `- ${problem}`).join("\n")}`)
  process.exitCode = 1
} else {
  console.log("Geometry and assembly guards passed. Complete FABRICATION_REVIEW.md before release.")
}
