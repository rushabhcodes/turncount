import { readFile, writeFile, mkdir } from 'node:fs/promises'
import modeling from '@jscad/modeling'
import Module from 'manifold-3d'
const manifold = await Module()
manifold.setup()
const { Manifold, CrossSection } = manifold

const { primitives, booleans, transforms, colors, hulls, measurements, geometries, extrusions } = modeling
const output = 'enclosure/output'
await mkdir(output, { recursive: true })
const circuit = JSON.parse(await readFile('dist/index/circuit.json', 'utf8'))
const sources = new Map(circuit.filter(e => e.type === 'source_component').map(e => [e.source_component_id, e.name]))

// Evaluate the documented primitive plan stored by tscircuit in circuit JSON.
// A fixed mesh resolution is used for the print exports and the clearance audit.
function evaluate(op) {
  const { type, ...options } = op
  switch (type) {
    case 'cylinder': return primitives.cylinder({ ...options, segments: 128 })
    case 'cuboid': return primitives.cuboid(options)
    case 'polygon': return primitives.polygon(options)
    case 'extrudeLinear': return extrusions.extrudeLinear(op.options, evaluate(op.shape))
    case 'union': return booleans.union(...op.shapes.map(evaluate))
    case 'subtract': return booleans.subtract(...op.shapes.map(evaluate))
    case 'hull': return hulls.hull(...op.shapes.map(evaluate))
    case 'translate': return transforms.translate(op.vector, evaluate(op.shape))
    case 'rotate': return transforms.rotate(op.angles, evaluate(op.shape))
    case 'colorize': return colors.colorize(op.color, evaluate(op.shape))
    default: throw new Error(`Unsupported enclosure operation: ${type}`)
  }
}
function printableSolid(op) {
  switch (op.type) {
    case 'cylinder': return Manifold.cylinder(op.height, op.radius, op.radius, 128, true)
    case 'cuboid': return Manifold.cube(op.size, true)
    case 'polygon': return new CrossSection(op.points)
    case 'extrudeLinear': return printableSolid(op.shape).extrude(op.options.height)
    case 'union': return Manifold.union(op.shapes.map(printableSolid))
    case 'subtract': return printableSolid(op.shapes[0]).subtract(Manifold.union(op.shapes.slice(1).map(printableSolid)))
    case 'hull': return Manifold.hull(op.shapes.map(printableSolid))
    case 'translate': return printableSolid(op.shape).translate(op.vector)
    case 'rotate': return printableSolid(op.shape).rotate(op.angles.map(angle => angle * 180 / Math.PI))
    case 'colorize': return printableSolid(op.shape)
    default: throw new Error(`Unsupported printable operation: ${op.type}`)
  }
}
const meshChecks = []
async function exportStl(name, plan, flip) {
  let solid = printableSolid(plan)
  if (flip) solid = solid.rotate([180, 0, 0])
  solid = solid.translate([0, 0, -solid.boundingBox().min[2]])
  if (solid.status() !== 'NoError') throw new Error(`${name}: mesh kernel ${solid.status()}`)
  const mesh = solid.getMesh()
  const count = mesh.triVerts.length / 3
  const binary = Buffer.alloc(84 + count * 50)
  binary.write('TurnCount manifold print mesh, units mm', 0)
  binary.writeUInt32LE(count, 80)
  const edges = new Map()
  for (let i = 0; i < count; i++) {
    const indices = Array.from(mesh.triVerts.slice(i * 3, i * 3 + 3))
    const vertices = indices.map(index => Array.from(mesh.vertProperties.slice(index * mesh.numProp, index * mesh.numProp + 3)))
    const [a, b, c] = vertices
    const ab = b.map((v, j) => v - a[j]); const ac = c.map((v, j) => v - a[j])
    const normal = [ab[1]*ac[2]-ab[2]*ac[1], ab[2]*ac[0]-ab[0]*ac[2], ab[0]*ac[1]-ab[1]*ac[0]]
    const length = Math.hypot(...normal)
    if (!length) throw new Error(`${name}: degenerate triangle`)
    const values = [...normal.map(value => value / length), ...vertices.flat()]
    values.forEach((value, j) => binary.writeFloatLE(value, 84 + i * 50 + j * 4))
    for (let j = 0; j < 3; j++) {
      // Validate the actual float32 positions serialized into the STL.
      const key = [vertices[j].join(','), vertices[(j + 1) % 3].join(',')].sort().join('|')
      edges.set(key, (edges.get(key) ?? 0) + 1)
    }
  }
  const invalid = [...edges.values()].filter(count => count !== 2).length
  if (invalid) throw new Error(`${name}: ${invalid} non-manifold STL edges`)
  meshChecks.push({ file: name, triangles: count, nonManifoldEdges: invalid, passed: true, kernel: 'manifold-3d' })
  await writeFile(`${output}/${name}`, binary)
}
const parts = new Map()
for (const cad of circuit.filter(e => e.type === 'cad_component' && e.model_jscad)) {
  const name = sources.get(cad.source_component_id)
  const geometry = evaluate(cad.model_jscad)
  parts.set(name, geometry)
  if (name.endsWith('_REFERENCE')) continue
  await exportStl(`${name.toLowerCase()}.stl`, cad.model_jscad, ['LID', 'KNOB', 'DRIVE'].includes(name))
}
// Small fit coupons are test tools, not additional assembly parts.
for (const square of [0.72, 0.76, 0.8, 0.84]) {
  const plan = { type: 'union', shapes: [
    { type: 'translate', vector: [0,0,0.55], shape: { type: 'cuboid', size: [square,square,1.1] } },
    { type: 'translate', vector: [0,0,3.05], shape: { type: 'cylinder', radius: 2.5, height: 4 } },
  ] }
  await exportStl(`tip-fit-${square.toFixed(2)}mm.stl`, plan, true)
}
const checks = []
function assertClear(name, a, b) {
  const volume = Math.abs(measurements.measureVolume(booleans.intersect(a, b)))
  checks.push({ name, passed: volume < 0.001, overlapVolumeMm3: volume })
  if (volume >= 0.001) throw new Error(`${name}: ${volume.toFixed(4)} mm³ interference`)
}
const stationary = ['BASE', 'LID']
for (let i = 0; i < stationary.length; i++) for (let j = i + 1; j < stationary.length; j++) {
  assertClear(`${stationary[i]} / ${stationary[j]}`, parts.get(stationary[i]), parts.get(stationary[j]))
}
for (const name of ['KNOB']) {
  for (const angle of [0, 15, 30, 45, 60, 90, 120, 180, 240, 300, 345]) {
    for (const press of [0, 0.2]) {
      const moving = transforms.translate([0, 0, -press], transforms.rotateZ(angle * Math.PI / 180, parts.get(name)))
      for (const fixed of stationary) assertClear(`${name} ${angle}° press ${press} / ${fixed}`, moving, parts.get(fixed))
    }
  }
}
assertClear('Magnet / base pocket', parts.get('MAGNET_RING_REFERENCE'), parts.get('BASE'))
const pcb = primitives.cylinder({ radius: 24, height: 1.6, segments: 180 })
for (const fixed of [...stationary, 'KNOB']) assertClear(`PCB / ${fixed}`, pcb, parts.get(fixed))
// The imported holder's 24.5 × 9 × 3.75 mm OBJ envelope, rotated with BT1.
const holder = primitives.cuboid({ size: [9, 24.5, 3.75], center: [-9.5, 0, -2.675] })
for (const fixed of stationary) assertClear(`Battery holder / ${fixed}`, holder, parts.get(fixed))
// Top-side component envelopes from the verified PCB placement; explicit height
// bounds are conservative for passive parts. The encoder drive opening is kept
// separate because engagement with its rotating hub is intentional.
for (const component of circuit.filter(e => e.type === 'pcb_component' && e.layer === 'top')) {
  const name = sources.get(component.source_component_id)
  if (name === 'ENC1' || name?.startsWith('TP')) continue
  const tall = name === 'ANT1' ? 2 : name === 'X1' ? 1 : 1.5
  const body = primitives.cuboid({size:[component.width, component.height, tall], center:[component.center.x, component.center.y, 0.8 + tall / 2]})
  for (const fixed of [...stationary, 'KNOB']) assertClear(`${name} envelope / ${fixed}`, body, parts.get(fixed))
}
const manifest = [...parts].map(([name, geometry]) => ({
  name, printable: !name.endsWith('_REFERENCE'),
  boundsMm: measurements.measureBoundingBox(geometry),
  volumeMm3: measurements.measureVolume(geometry),

}))
await writeFile(`${output}/parts-manifest.json`, JSON.stringify(manifest))
await writeFile(`${output}/clearance-checks.json`, JSON.stringify(checks, null, 2) + '\n')
await writeFile(`${output}/mesh-checks.json`, JSON.stringify(meshChecks, null, 2) + '\n')
console.log(`Exported ${parts.size - 2} STL parts; ${checks.length} mechanical clearance checks passed.`)
