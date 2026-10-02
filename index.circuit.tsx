// TurnCount prototype. Raytac pin numbers and land dimensions are checked
// against its Version N datasheet; enclosure fit still needs verification.
// Module land pattern: BishopFox/mellon, MDBT42Q-P512KV2_RAY.kicad_mod.
// Encoder, USB, charger, regulator and pack connector: exact JLCPCB imports.
// The module STEP model is from yuhki50/kicad-packages3D (CC BY-SA 4.0).
import { Fragment } from "react"
import { RechargeablePower } from "./components/RechargeablePower"
import { ProbePad } from "./components/ProbePad"
import { GT_EVA01AA_L1 } from "./imports/GT_EVA01AA_L1"

const modulePads: [number, number, number, number, number][] = [
  [1, -4.6, 3.801, 1.397, 0.813],
  ...Array.from({ length: 10 }, (_, i): [number, number, number, number, number] => [i + 2, -4.6, 0.801 - i * 0.7, 1.397, 0.406]),
  ...Array.from({ length: 13 }, (_, i): [number, number, number, number, number] => [i + 12, -4.2 + i * 0.7, -7.6, 0.406, 1.397]),
  ...Array.from({ length: 15 }, (_, i): [number, number, number, number, number] => [i + 25, 4.6, i === 14 ? 3.801 : -6.199 + i * 0.7, 1.397, i === 14 ? 0.813 : 0.406]),
  // Raytac permits omitting unused P0.24/P0.23 pads (40/41), avoiding
  // excessive solder and preserving the top-layer no-ground region.
]

const moduleFootprint = (
  <footprint>
    {modulePads.map(([pin, x, y, width, height]) => (
      <Fragment key={pin}>
        <smtpad portHints={[String(pin)]} pcbX={x} pcbY={y} width={width} height={height} shape="rect" />
      </Fragment>
    ))}
  </footprint>
)
// The imported locating holes sit 1.4 mm below the shaft axis in the drawing.
// Shift the imported anchor so the mechanical shaft axis remains at (0, 0).
const encoderFootprintOffsetY = -1.072594
const signalNames = ["A", "B", "SW"] as const
const boardDiameter = 48
const boardOutline = Array.from({ length: 180 }, (_, i) => {
  const angle = 2 * Math.PI * i / 180
  return { x: boardDiameter / 2 * Math.cos(angle), y: boardDiameter / 2 * Math.sin(angle) }
})
const traces: [string, string][] = [
  ["U1.VDD", "net.V3V0"],
  ...["GND1", "GND12", "GND24", "GND39"].map((pin): [string, string] => [`U1.${pin}`, "net.GND"]),
  ...["C1", "C2"].flatMap((ref): [string, string][] => [[`${ref}.pin1`, "net.V3V0"], [`${ref}.pin2`, "net.GND"]]),
  ["ENC1.COM", "net.GND"], ["ENC1.D", "net.GND"],
  ["ENC1.pin1", "net.GND"], ["ENC1.pin2", "net.GND"],
  ...signalNames.flatMap((signal, i): [string, string][] => [
    [`ENC1.${signal === "SW" ? "E" : signal}`, `R${i + 1}.pin1`],
    [`R${i + 1}.pin2`, `net.ENC_${signal}`],
    [`R${i + 4}.pin1`, "net.V3V0"],
    [`R${i + 4}.pin2`, `net.ENC_${signal}`],
    [`C${i + 3}.pin1`, `net.ENC_${signal}`],
    [`C${i + 3}.pin2`, "net.GND"],
    [`U1.P0_${11 + i}`, `net.ENC_${signal}`],
  ]),
  ["R7.pin1", "net.V3V0"], ["R7.pin2", "U1.RESET"],
  ["TP1.pin1", "net.V3V0"], ["TP2.pin1", "net.GND"],
  ["TP3.pin1", "U1.SWDCLK"], ["TP4.pin1", "U1.SWDIO"],
  ["TP5.pin1", "U1.RESET"], ["TP6.pin1", "net.ENC_A"],
  ["TP7.pin1", "net.ENC_B"],
]

export default () => (
  <board title="TurnCount — USB-C rechargeable prototype"
    width={boardDiameter} height={boardDiameter} outline={boardOutline}
    layers={2} thickness="1.6mm" defaultViaTenting="both_sides"
    minViaHoleDiameter="0.3mm" minViaPadDiameter="0.6mm"
    minViaHoleEdgeToViaHoleEdgeClearance="0.2mm"
    minPlatedHoleDrillEdgeToDrillEdgeClearance="0.45mm"
    minTraceToHoleEdgeClearance="0.28mm" minBoardEdgeClearance="0.2mm"
    pcbStyle={{ silkscreenFontSize: "0.8mm" }}>
    <schematicsection name="power" displayName="USB-C charging and 3 V supply" />
    <schematicsection name="inputs" displayName="Rotary encoder inputs" />
    <schematicsection name="radio" displayName="BLE and programming" />

    <chip name="U1" manufacturerPartNumber="MDBT42Q-512KV2"
      footprint={moduleFootprint}
      cadModel={{
        stepUrl: "https://raw.githubusercontent.com/yuhki50/kicad-packages3D/master/Raytac.3dshapes/MDBT42Q.step",
        modelBoardNormalDirection: "y+",
        // CAD placement otherwise uses the asymmetric land-pattern center.
        positionOffset: { x: 0, y: 2.0455, z: 0 },
      }}
      pinLabels={{ pin1: "GND1", pin11: "VDD", pin12: "GND12", pin24: "GND24",
        pin25: "P0_11", pin26: "P0_12", pin27: "P0_13", pin35: "RESET",
        pin36: "SWDCLK", pin37: "SWDIO", pin39: "GND39" }}
      pinAttributes={{ VDD: { requiresPower: true }, SWDCLK: { mustBeConnected: true }, SWDIO: { mustBeConnected: true } }}
      schSectionName="radio" schX={20} schY={0} pcbX={16.5} pcbY={0} />
    {/* Raytac Version N, pp. 8–12: antenna exclusion on every layer,
        extended to the circular edge; separate top-only under-module region. */}
    <keepout shape="rect" pcbX={17.85} pcbY={14.105}
      width="13.3mm" height="19.79mm" layers={["top", "bottom"]} excludeRefs={[".U1"]} />
    <keepout shape="rect" pcbX={18.2} pcbY={2.655}
      width="4.4mm" height="3.11mm" layers={["top"]} excludeRefs={[".U1"]} />
    <copperpour name="GND_TOP" connectsTo="net.GND" layer="top"
      clearance="0.2mm" boardEdgeMargin="0.3mm" cutoutMargin="0.28mm" useThermalReliefs={false} />
    <copperpour name="GND_BOTTOM" connectsTo="net.GND" layer="bottom"
      clearance="0.2mm" boardEdgeMargin="0.3mm" cutoutMargin="0.28mm" useThermalReliefs={false} />
    <RechargeablePower />
    <GT_EVA01AA_L1 name="ENC1"
      schSectionName="inputs" schX={0} schY={-15} pcbX={0} pcbY={encoderFootprintOffsetY} />
    {/* Keep the push-signal layer change outside the encoder's solder land. */}
    <tracehint for=".ENC1 port.pin6" offset={{ x: -0.75, y: -4.5, via: true, to_layer: "bottom" }} />

    <capacitor name="C1" capacitance="100nF" footprint="0402" schSectionName="power" schX={-16} schY={2} schRotation={-90} pcbX={11.5} pcbY={-9} />
    <capacitor name="C2" capacitance="10uF" footprint="0805" schSectionName="power" schX={-16} schY={-2} schRotation={-90} pcbX={14} pcbY={-10.5} />
    {signalNames.map((signal, i) => (
      <Fragment key={signal}>
        <resistor name={`R${i + 1}`} resistance="1k" footprint="0402" schSectionName="inputs" schX={3} schY={-13 - i * 2} pcbX={-15.5 + i * 3} pcbY={-9} />
        <resistor name={`R${i + 4}`} resistance="100k" footprint="0402" schSectionName="inputs" schX={6} schY={-13 - i * 2} schRotation={-90} pcbX={-15.5 + i * 3} pcbY={-11} />
        <capacitor name={`C${i + 3}`} capacitance="1nF" footprint="0402" schSectionName="inputs" schX={9} schY={-13 - i * 2} schRotation={-90} pcbX={-15.5 + i * 3} pcbY={-13} pcbRotation={180} />
      </Fragment>
    ))}
    <resistor name="R7" resistance="100k" footprint="0402" schSectionName="radio" schX={24} schY={2} schRotation={-90} pcbX={17.5} pcbY={-10.5} />
    {[[5, -11], [7, -11], [9, -11], [5, -13], [7, -13], [9, -15.5], [11, -13]].map(([x, y], i) => (
      <Fragment key={`testpoint-${i}`}>
        <ProbePad name={`TP${i + 1}`} schSectionName="radio" schX={24} schY={-2 - i * 2} pcbX={x} pcbY={y} />
      </Fragment>
    ))}
    {traces.map(([from, to], i) => (
      <Fragment key={`trace-${i}`}>
        <trace name={`signal_${i}`} from={from} to={to} />
      </Fragment>
    ))}
  </board>
)
