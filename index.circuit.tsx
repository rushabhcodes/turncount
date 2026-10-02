import { Fragment } from "react"
import { AnnaRadio, radioPathPoint } from "./components/AnnaRadio"
import { RechargeablePower } from "./components/RechargeablePower"
import { ProbePad } from "./components/ProbePad"
import { GT_EVA01AA_L1 } from "./imports/GT_EVA01AA_L1"

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
    [`U1.GPIO_${13 + i}`, `net.ENC_${signal}`],
  ]),
  ["R7.pin1", "net.V3V0"], ["R7.pin2", "U1.RESET_N"],
  ["TP1.pin1", "net.V3V0"], ["TP2.pin1", "net.GND"],
  ["U1.SWDCLK", "TP3.pin1"], ["U1.SWDIO", "TP4.pin1"],
  ["TP5.pin1", "U1.RESET_N"], ["TP6.pin1", "net.ENC_A"],
  ["TP7.pin1", "net.ENC_B"],
]

export default () => (
  <board title="TurnCount — USB-C rechargeable prototype"
    width={boardDiameter} height={boardDiameter} outline={boardOutline}
    layers={2} thickness="1.6mm" defaultViaTenting="both_sides"
    minViaHoleDiameter="0.3mm" minViaPadDiameter="0.6mm"
    minViaHoleEdgeToViaHoleEdgeClearance="0.2mm"
    minPlatedHoleDrillEdgeToDrillEdgeClearance="0.45mm"
    minTraceWidth="0.1mm" nominalTraceWidth="0.15mm"
    minTraceToHoleEdgeClearance="0.28mm" minBoardEdgeClearance="0.2mm"
    pcbStyle={{ silkscreenFontSize: "0.8mm" }}>
    <schematicsection name="power" displayName="USB-C charging and 3 V supply" />
    <schematicsection name="inputs" displayName="Rotary encoder inputs" />
    <schematicsection name="radio" displayName="BLE and programming" />

    <AnnaRadio />
    <copperpour name="GND_TOP" connectsTo="net.GND" layer="top"
      clearance="0.2mm" boardEdgeMargin="0.3mm" cutoutMargin="0.28mm" useThermalReliefs={false} />
    <copperpour name="GND_BOTTOM" connectsTo="net.GND" layer="bottom"
      clearance="0.2mm" boardEdgeMargin="0.3mm" cutoutMargin="0.28mm" useThermalReliefs={false} />
    <RechargeablePower />
    <GT_EVA01AA_L1 name="ENC1"
      schSectionName="inputs" schX={0} schY={-15} pcbX={0} pcbY={encoderFootprintOffsetY} />
    {/* Keep the push-signal layer change outside the encoder's solder land. */}
    {[-1.499997, 1.499997].map((x) => (
      <Fragment key={x}>
        <keepout shape="circle" pcbX={x} pcbY={-1.4} radius="0.58mm"
          layers={["top", "bottom"]} excludeRefs={[".ENC1"]} />
      </Fragment>
    ))}
    <tracehint for=".ENC1 port.pin3" offset={{ x: -1.5, y: -5.5, via: true, to_layer: "bottom" }} />
    <tracehint for=".ENC1 port.pin5" offset={{ x: 1.5, y: -5.5, via: true, to_layer: "bottom" }} />
    <tracehint for=".ENC1 port.pin6" offset={{ x: -0.75, y: -4.5, via: true, to_layer: "bottom" }} />

    <capacitor name="C1" capacitance="100nF" footprint="0402" schSectionName="power" schX={-16} schY={2} schRotation={-90} pcbX={10.5} pcbY={3} pcbRotation={180} />
    <capacitor name="C2" capacitance="10uF" footprint="0805" schSectionName="power" schX={-16} schY={-2} schRotation={-90} pcbX={10.5} pcbY={5.5} pcbRotation={180} />
    {signalNames.map((signal, i) => (
      <Fragment key={signal}>
        <resistor name={`R${i + 1}`} resistance="1k" footprint="0402" schSectionName="inputs" schX={3} schY={-13 - i * 2} pcbX={-15.5 + i * 3} pcbY={-9} />
        <resistor name={`R${i + 4}`} resistance="100k" footprint="0402" schSectionName="inputs" schX={6} schY={-13 - i * 2} schRotation={-90} pcbX={-15.5 + i * 3} pcbY={-11} />
        <capacitor name={`C${i + 3}`} capacitance="1nF" footprint="0402" schSectionName="inputs" schX={9} schY={-13 - i * 2} schRotation={-90} pcbX={-15.5 + i * 3} pcbY={-13} pcbRotation={180} />
      </Fragment>
    ))}
    <resistor name="R7" resistance="100k" footprint="0402" schSectionName="radio" schX={30} schY={2} schRotation={-90} pcbX={10.5} pcbY={0.5} />
    {[[5, -11], [7, -11], [9, -11], [5, -13], [7, -13], [9, -15.5], [11, -13]].map(([x, y], i) => (
      <Fragment key={`testpoint-${i}`}>
        <ProbePad name={`TP${i + 1}`} schSectionName="radio" schX={30} schY={-2 - i * 2} pcbX={x} pcbY={y} />
      </Fragment>
    ))}
    {traces.map(([from, to], i) => (
      <Fragment key={`trace-${i}`}>
        <trace name={`signal_${i}`} from={from} to={to}
          thickness={from === "U1.SWDIO" || from === "U1.SWDCLK" ? "0.1mm" : undefined}
          pcbPath={from === "U1.SWDIO" ? [
            radioPathPoint(15.92, -0.649859),
            radioPathPoint(15.92, -1.1),
            radioPathPoint(15.748057, -1.1),
            radioPathPoint(15.748057, -2.515),
            radioPathPoint(16.073162, -2.515),
            {...radioPathPoint(16.073162, -3.75), via: true, fromLayer: "top", toLayer: "bottom"},
            {...radioPathPoint(5, -11.9), via: true, fromLayer: "bottom", toLayer: "top"},
          ] : from === "U1.SWDCLK" ? [
            radioPathPoint(16.723163, -1.299972),
            {...radioPathPoint(16.723163, -4.5), via: true, fromLayer: "top", toLayer: "bottom"},
            {...radioPathPoint(9, -10), via: true, fromLayer: "bottom", toLayer: "top"},
          ] : undefined} />
      </Fragment>
    ))}
  </board>
)
