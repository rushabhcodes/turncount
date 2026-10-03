// First electrical draft for TurnCount V1. Pad numbers for the Raytac module
// follow the MDBT42Q-512K KiCad symbol; enclosure fit still needs verification.
// Encoder, USB, charger, regulator, pack connector and radio: exact JLCPCB imports.
import { Fragment } from "react"
import { assembly } from "@tscircuit/core"
import { RechargeablePower } from "./components/RechargeablePower"
import { GT_EVA01AA_L1 } from "./imports/GT_EVA01AA_L1"
import { KT_0603R } from "./imports/KT_0603R"
import { MDBT42Q_512KV2 } from "./imports/MDBT42Q_512KV2"
import { EnclosureAssembly } from "./mechanical/EnclosureAssembly"
// The imported locating holes sit 1.4 mm below the shaft axis in the drawing.
// Shift the imported anchor so the mechanical shaft axis remains at (0, 0).
const encoderFootprintOffsetY = -1.072594
const signalNames = ["A", "B", "SW"] as const
const boardDiameter = 48
const boardRadius = boardDiameter / 2
const batteryNotchHalfHeight = 3
const batteryNotchInnerX = -18
const notchAngle = Math.asin(batteryNotchHalfHeight / boardRadius)
const notchOuterX = -Math.sqrt(boardRadius ** 2 - batteryNotchHalfHeight ** 2)
const circularOutline = Array.from({ length: 180 }, (_, i) => {
  const angle = 2 * Math.PI * i / 180
  return { x: boardRadius * Math.cos(angle), y: boardRadius * Math.sin(angle) }
})
const boardOutline = [
  ...circularOutline.filter((_, i) => 2 * Math.PI * i / 180 < Math.PI - notchAngle),
  { x: notchOuterX, y: batteryNotchHalfHeight },
  { x: batteryNotchInnerX, y: batteryNotchHalfHeight },
  { x: batteryNotchInnerX, y: -batteryNotchHalfHeight },
  { x: notchOuterX, y: -batteryNotchHalfHeight },
  ...circularOutline.filter((_, i) => 2 * Math.PI * i / 180 > Math.PI + notchAngle),
]
const radioTraces: [string, string][] = [
  ["U1.VDD", "net.V3V0"],
  ...["GND1", "GND12", "GND24", "GND39"].map((pin): [string, string] => [`U1.${pin}`, "net.GND"]),
  ...["C1", "C2"].flatMap((ref): [string, string][] => [[`${ref}.pin1`, "net.V3V0"], [`${ref}.pin2`, "net.GND"]]),
  ...signalNames.map((_, i): [string, string] => [`U1.P0_${11 + i}`, `net.ENC_${signalNames[i]}`]),
  ["R7.pin1", "net.V3V0"],
  ["TP1.pin1", "net.V3V0"], ["TP2.pin1", "net.GND"],
  ["TP3.pin1", "U1.SWDCLK"], ["TP4.pin1", "U1.SWDIO"],
  ["TP5.pin1", "U1.RESET"], ["TP6.pin1", "net.ENC_A"],
  ["TP7.pin1", "net.ENC_B"],
  ["U1.P0_14", "net.DEBUG_LED_DRIVE"],
  ["R14.pin1", "net.DEBUG_LED_DRIVE"],
  ["R14.pin2", "LED1.anode"],
  ["LED1.cathode", "net.GND"],
]
const inputTraces: [string, string][] = [
  ["ENC1.COM", "net.GND"], ["ENC1.D", "net.GND"],
  ["ENC1.pin1", "net.GND"], ["ENC1.pin2", "net.GND"],
  ...signalNames.flatMap((signal, i): [string, string][] => [
    [`ENC1.${signal === "SW" ? "E" : signal}`, `net.ENC_${signal}_RAW`],
    [`R${i + 1}.pin1`, `net.ENC_${signal}_RAW`],
    [`R${i + 1}.pin2`, `net.ENC_${signal}`],
    [`R${i + 4}.pin1`, "net.V3V0"],
    [`R${i + 4}.pin2`, `net.ENC_${signal}`],
    [`C${i + 3}.pin1`, `net.ENC_${signal}`],
    [`C${i + 3}.pin2`, "net.GND"],
  ]),
]

const TurnCountBoard = () => (
  <board title="TurnCount — USB-C rechargeable prototype"
    width={boardDiameter} height={boardDiameter} outline={boardOutline}
    layers={2} thickness="1.6mm" defaultViaTenting="both_sides"
    schLayout={{ layoutMode: "relative" }}>
    <schematicsheet name="Power" displayName="1 · USB-C charging and power"
      sheetIndex={0} sheetWidth="260mm" sheetHeight="210mm">
      <schematicsection name="power" displayName="Charging and 3 V supply" />
      <RechargeablePower />
    </schematicsheet>

    <schematicsheet name="Inputs" displayName="2 · Rotary encoder inputs"
      sheetIndex={1} sheetWidth="150mm" sheetHeight="110mm">
      <schematicsection name="inputs" displayName="Encoder and input filters" />
      <GT_EVA01AA_L1 name="ENC1"
        schSectionName="inputs" schX={-4} schY={0} pcbX={0} pcbY={encoderFootprintOffsetY} />
      <schematictext schX={-4} schY={2.7} fontSize={0.24}
        anchor="center" color="#334155" text="12-detent rotary encoder + push" />
      <schematictext schX={-4} schY={2.3} fontSize={0.24}
        anchor="center" color="#334155" text="12 V / 50 mA contact rating" />
      {signalNames.map((signal, i) => (
        <Fragment key={signal}>
          <resistor name={`R${i + 1}`} resistance="1k" footprint="jlcpcb:C11702" supplierPartNumbers={{ jlcpcb: ["C11702"] }} schSectionName="inputs" schX={0} schY={3 - i * 3} pcbX={-15.5 + i * 3} pcbY={-9} />
          <resistor name={`R${i + 4}`} resistance="100k" footprint="jlcpcb:C25741" supplierPartNumbers={{ jlcpcb: ["C25741"] }} schSectionName="inputs" schX={3} schY={3 - i * 3} schRotation={-90} pcbX={-15.5 + i * 3} pcbY={-11} />
          <capacitor name={`C${i + 3}`} capacitance="1nF" footprint="jlcpcb:C1523" supplierPartNumbers={{ jlcpcb: ["C1523"] }} schSectionName="inputs" schX={6} schY={3 - i * 3} schRotation={-90} pcbX={-15.5 + i * 3} pcbY={-13} pcbRotation={180} />
        </Fragment>
      ))}
      {inputTraces.map(([from, to], i) => (
        <Fragment key={`input-trace-${i}`}>
          <trace from={from} to={to} />
        </Fragment>
      ))}
    </schematicsheet>

    <schematicsheet name="Radio" displayName="3 · BLE and programming"
      sheetIndex={2} sheetWidth="170mm" sheetHeight="180mm">
      <schematicsection name="radio" displayName="BLE module and debug" />
      <MDBT42Q_512KV2 name="U1"
        schSectionName="radio" schX={0} schY={0} pcbX={16.5} pcbY={-2.05} />
      <schematictext schX={0} schY={4.3} fontSize={0.24}
        anchor="center" color="#334155" text="nRF52832 BLE module" />
      <schematictext schX={0} schY={3.9} fontSize={0.24}
        anchor="center" color="#334155" text="3.0 V supply; SWD programming" />
      <capacitor name="C1" capacitance="100nF" footprint="jlcpcb:C1525" supplierPartNumbers={{ jlcpcb: ["C1525"] }} schSectionName="radio" schX={-4} schY={3} schRotation={-90} pcbX={10.5} pcbY={-9.5} />
      <capacitor name="C2" capacitance="10uF" footprint="0805" schSectionName="radio" schX={-4} schY={0} schRotation={-90} pcbX={14} pcbY={-10.5} />
      <resistor name="R7" resistance="100k" footprint="jlcpcb:C25741" supplierPartNumbers={{ jlcpcb: ["C25741"] }} schSectionName="radio" schX={-4} schY={-3} schRotation={-90} pcbX={17.5} pcbY={-10.5} />
      <resistor name="R14" resistance="1k" footprint="jlcpcb:C11702" supplierPartNumbers={{ jlcpcb: ["C11702"] }} schSectionName="radio" schX={0} schY={-4.5} schRotation={-90} pcbX={-5.5} pcbY={-11} />
      <KT_0603R name="LED1" color="red" schSectionName="radio" schX={0} schY={-6} schRotation={-90} pcbX={-2} pcbY={-11} />
      <schematictext schX={2.5} schY={-6} fontSize={0.24}
        anchor="center" color="#334155" text="Debug LED, 3 V GPIO via 1 k" />
      <trace name="RADIO_RESET" from="R7.pin2" to="U1.RESET"
        pcbRouteHints={[{ x: 19.5, y: 0.8, via: true, to_layer: "top" }]} />
      {[[5, -11], [7, -11], [9, -11], [5, -13], [7, -13], [9, -13], [11, -13]].map(([x, y], i) => (
        <Fragment key={`testpoint-${i}`}>
          <testpoint name={`TP${i + 1}`} footprintVariant="pad" padDiameter="1mm" schSectionName="radio" schX={6} schY={7 - i * 2} pcbX={x} pcbY={y} />
        </Fragment>
      ))}
      {radioTraces.map(([from, to], i) => (
        <Fragment key={`radio-trace-${i}`}>
          <trace from={from} to={to} />
        </Fragment>
      ))}
    </schematicsheet>

    <keepout shape="rect" pcbX={17} pcbY={14.25}
      width="11mm" height="19.5mm" layers={["top", "bottom"]} excludeRefs={[".U1"]} />
    <keepout shape="rect" pcbX={20.35} pcbY={0.8}
      width="0.8mm" height="0.8mm" layers={["bottom"]} />
  </board>
)

export default () => (
  <assembly.device name="TurnCountDevice">
    <TurnCountBoard />
    <EnclosureAssembly />
  </assembly.device>
)
