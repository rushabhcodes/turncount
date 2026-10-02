import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

// Run against the built netlist, rather than JSX strings. These checks guard
// against exposing the radio to LiPo/USB voltage and bypassing charge control.
const circuit = JSON.parse(readFileSync(process.argv[2] ?? "dist/index/circuit.json", "utf8"))
const byType = (type) => circuit.filter((entry) => entry.type === type)
const components = byType("source_component")
const component = (name) => {
  const value = components.find((entry) => entry.name === name)
  assert.ok(value, `Missing component ${name}`)
  return value
}
const port = (ref, alias) => {
  const id = component(ref).source_component_id
  const value = byType("source_port").find((entry) =>
    entry.source_component_id === id && (entry.name === alias || entry.port_hints?.includes(alias)))
  assert.ok(value, `Missing port ${ref}.${alias}`)
  return value.subcircuit_connectivity_map_key
}
const rail = (name) => {
  const value = byType("source_net").find((entry) => entry.name === name)
  assert.ok(value, `Missing rail ${name}`)
  return value.subcircuit_connectivity_map_key
}
const onRail = (ref, pin, name) => assert.equal(port(ref, pin), rail(name), `${ref}.${pin} must be on ${name}`)

assert.equal(new Set(["USB_5V", "VBAT", "VSYS", "V3V0", "GND"].map(rail)).size, 5,
  "USB, battery, system, regulated supply and ground must remain distinct")
onRail("U1", "VCC", "V3V0")
assert.equal(component("U1").manufacturer_part_number, "ANNA-B112-00B")
assert.ok(component("U1").supplier_part_numbers.jlcpcb.includes("C2931350"))
for (const pin of ["GND3","GND2","GND1","GND5","GND4","GND7","GND6","GND10","GND9","GND12","GND8","GND14","GND13","GND11","EGP1","EGP2","EGP4","EGP3","XL1","XL2","ANT_GND1","ANT_GND2"]) onRail("U1", pin, "GND")
for (const [i, signal] of ["A", "B", "SW"].entries()) onRail("U1", `GPIO_${13 + i}`, `ENC_${signal}`)
assert.ok(port("U1", "ANT"), "Antenna feed must be connected")
assert.equal(port("U1", "ANT"), port("U1", "ANT_INT"))
assert.notEqual(port("U1", "ANT"), rail("GND"))
assert.notEqual(port("U1", "ANT"), rail("V3V0"))
assert.ok(!port("U1", "ANT_PCB"), "PCB-edge antenna configuration requires ANT_PCB open")
assert.equal(port("U1", "SWDCLK"), port("TP3", "pin1"))
assert.equal(port("U1", "SWDIO"), port("TP4", "pin1"))
assert.equal(port("U1", "RESET_N"), port("TP5", "pin1"))
assert.equal(port("U1", "RESET_N"), port("R7", "pin2"))
for (const pin of ["IN", "EN"]) onRail("U3", pin, "VSYS")
onRail("U3", "OUT", "V3V0")
onRail("U2", "IN", "USB_5V")
for (const pin of ["OUT1", "OUT2"]) onRail("U2", pin, "VSYS")
for (const pin of ["BAT1", "BAT2"]) onRail("U2", pin, "VBAT")
for (const pin of ["EN1", "EN2", "N_CE", "VSS", "EP"]) onRail("U2", pin, "GND")
onRail("J2", "BAT_POS", "VBAT")
onRail("J2", "BAT_NEG", "GND")
assert.equal(port("J2", "NTC"), port("U2", "TS"), "Pack NTC must reach charger TS")
assert.notEqual(port("U2", "TS"), rail("GND"), "Do not bypass pack temperature sensing")
for (const [cc, ref] of [["CC1", "R8"], ["CC2", "R9"]]) {
  assert.equal(port("J1", cc), port(ref, "pin1"))
  onRail(ref, "pin2", "GND")
  assert.equal(component(ref).resistance, 5100, "USB-C needs a 5.1k Rd on each CC pin")
}
assert.notEqual(port("J1", "CC1"), port("J1", "CC2"), "CC pull-downs must be independent")
assert.equal(port("U2", "ISET"), port("R10", "pin1"))
onRail("R10", "pin2", "GND")
assert.ok(component("R10").resistance >= 590 && component("R10").resistance <= 8900,
  "Charge-program resistor must remain within TI's supported range")

// The battery rectangle is a mechanical allocation, not a selected pack model.
const intersectsBattery = (x, y, halfWidth, halfHeight) =>
  Math.abs(x) - halfWidth < 10 && Math.abs(y) - halfHeight < 15
for (const entry of byType("pcb_component")) {
  assert.ok(entry.layer !== "bottom" || !intersectsBattery(entry.center.x, entry.center.y, entry.width / 2, entry.height / 2),
    "A bottom-mounted component obstructs the battery allocation")
}
for (const entry of byType("pcb_plated_hole")) {
  assert.ok(!intersectsBattery(entry.x, entry.y, (entry.outer_width ?? entry.outer_diameter) / 2,
    (entry.outer_height ?? entry.outer_diameter) / 2), "A through-hole anchor intrudes beneath the battery")
}
for (const entry of byType("pcb_smtpad")) {
  let extent
  if (entry.shape === "circle") extent = Math.hypot(entry.x, entry.y) + entry.radius
  else if (entry.shape === "polygon") extent = Math.max(...entry.points.map(({ x, y }) => Math.hypot(x, y)))
  else extent = Math.max(...[-1, 1].flatMap((dx) => [-1, 1].map((dy) =>
    Math.hypot(entry.x + dx * entry.width / 2, entry.y + dy * entry.height / 2))))
  assert.ok(extent < 23.79, `Pad ${entry.pcb_smtpad_id} violates the 0.2 mm circular edge margin`)
}
for (const entry of byType("pcb_via")) {
  assert.ok(Math.hypot(entry.x, entry.y) + entry.outer_diameter / 2 < 23.79, "Via violates circular edge margin")
}
for (const entry of byType("pcb_trace")) {
  for (const point of entry.route) {
    if (point.x === undefined || point.y === undefined) continue
    assert.ok(Math.hypot(point.x, point.y) + (point.width ?? 0.2) / 2 < 23.79, "Trace violates circular edge margin")
  }
}
assert.equal(circuit.filter((entry) => entry.type.endsWith("_error")).length, 0, "Circuit JSON has errors")
console.log("Power rail isolation, USB-C configuration, pack interface and circular geometry checks passed.")
