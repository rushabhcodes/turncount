// Coin-cell nRF52810 prototype. RF fit still needs verification.
import { Fragment } from "react"
import { assembly } from "@tscircuit/core"
import { CoinCellPower } from "./components/CoinCellPower"
import { GT_EVA01AA_L1 } from "./imports/GT_EVA01AA_L1"
import { KT_0603R } from "./imports/KT_0603R"
import { NRF52810_QFAA_R } from "./imports/NRF52810_QFAA_R"
import { RFANT3216120A5T } from "./imports/RFANT3216120A5T"
import { X201632MKB4SI } from "./imports/X201632MKB4SI"
// The imported locating holes sit 1.4 mm below the shaft axis in the drawing.
// Shift the imported anchor so the mechanical shaft axis remains at (0, 0).
const encoderFootprintOffsetY = -1.072594
const signalNames = ["A", "B", "SW"] as const
const boardDiameter = 48
const boardRadius = boardDiameter / 2
const circularOutline = Array.from({ length: 180 }, (_, i) => {
  const angle = 2 * Math.PI * i / 180
  return { x: boardRadius * Math.cos(angle), y: boardRadius * Math.sin(angle) }
})
const boardOutline = circularOutline
const radioTraces: [string, string][] = [
  ...["VDD1", "VDD2", "VDD3"].map((pin): [string, string] => [`U1.${pin}`, "net.VBAT"]),
  ...["VSS1", "VSS2", "EP"].map((pin): [string, string] => [`U1.${pin}`, "net.GND"]),
  ...["C1", "C2"].flatMap((ref): [string, string][] => [[`${ref}.pin1`, "net.VBAT"], [`${ref}.pin2`, "net.GND"]]),
  ...["C8", "C9", "C10", "C11"].flatMap((ref): [string, string][] => [[`${ref}.pin1`, `U1.${ref === "C8" ? "DEC1" : ref === "C9" ? "DEC2" : ref === "C10" ? "DEC3" : "DEC4"}`], [`${ref}.pin2`, "net.GND"]]),
  ...signalNames.map((_, i): [string, string] => [`U1.P0_${11 + i}`, `net.ENC_${signalNames[i]}`]),
  ["R7.pin1", "net.VBAT"],
  ["TP1.pin1", "net.VBAT"], ["TP2.pin1", "net.GND"],
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
    [`R${i + 4}.pin1`, "net.VBAT"],
    [`R${i + 4}.pin2`, `net.ENC_${signal}`],
    [`C${i + 3}.pin1`, `net.ENC_${signal}`],
    [`C${i + 3}.pin2`, "net.GND"],
  ]),
]

const TurnCountBoard = () => (
  <board title="TurnCount — nRF52810 coin-cell prototype"
    width={boardDiameter} height={boardDiameter} outline={boardOutline}
    layers={2} thickness="1.6mm" defaultViaTenting="both_sides"
    schLayout={{ layoutMode: "relative" }}>
      <schematicsheet name="Power" displayName="1 · Coin-cell power"
      sheetIndex={0} sheetWidth="260mm" sheetHeight="210mm">
      <schematicsection name="power" displayName="CR2032 battery and supply decoupling" />
      <CoinCellPower />
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
      sheetIndex={2} sheetWidth="460mm" sheetHeight="550mm">
      <schematicsection name="radio" displayName="nRF52810 and debug" />
      <NRF52810_QFAA_R name="U1"
        schSectionName="radio" schX={0} schY={0} pcbX={8} pcbY={4} />
      <schematictext schX={0} schY={4.3} fontSize={0.24}
        anchor="center" color="#334155" text="Nordic nRF52810-QFAA-R · bare QFN-48" />
      <schematictext schX={0} schY={3.9} fontSize={0.24}
        anchor="center" color="#334155" text="CR2032 direct supply · SWD programming" />
      <schematicsection name="hf_clock" displayName="32 MHz radio clock" />
      <X201632MKB4SI name="Y1" noSchematicRepresentation pcbX={7} pcbY={14} pcbRotation={90} />
      <schematicsymbol name="Y1_SYMBOL" displayName="Y1 · 32 MHz" chipRef=".Y1"
        symbolName="crystal_4pin" schSectionName="hf_clock" schX={4} schY={7}
        connections={{
          pin1: ".Y1 > .XTAL1", gnd1: ".Y1 > .GND1",
          pin3: ".Y1 > .XTAL2", gnd2: ".Y1 > .GND2",
        }} />
      <capacitor name="C13" capacitance="12pF" footprint="0603"
        schSectionName="hf_clock" schX={1} schY={7} schRotation={-90} pcbX={4} pcbY={14} />
      <capacitor name="C14" capacitance="12pF" footprint="0603"
        schSectionName="hf_clock" schX={7} schY={7} schRotation={-90} pcbX={10.5} pcbY={14} />
      <trace name="HF_XTAL1_MCU" from="U1.XC1" to="Y1.XTAL1" />
      <trace name="HF_XTAL2_MCU" from="U1.XC2" to="Y1.XTAL2" />
      <trace from="Y1.GND1" to="net.GND" />
      <trace from="Y1.GND2" to="net.GND" />
      <trace name="HF_XTAL1_LOAD" from="Y1.XTAL1" to="C13.pin1" />
      <trace from="C13.pin2" to="net.GND" />
      <trace name="HF_XTAL2_LOAD" from="Y1.XTAL2" to="C14.pin1" />
      <trace from="C14.pin2" to="net.GND" />
      <capacitor name="C1" capacitance="100nF" footprint="0603" schSectionName="radio" schX={-4} schY={3} schRotation={-90} pcbX={5.5} pcbY={-3} />
      <capacitor name="C2" capacitance="100nF" footprint="0603" schSectionName="radio" schX={-4} schY={0} schRotation={-90} pcbX={12} pcbY={-3} />
      <capacitor name="C8" capacitance="100nF" footprint="0603" schSectionName="radio" schX={-4} schY={-4} schRotation={-90} pcbX={2} pcbY={9} />
      <capacitor name="C9" capacitance="100pF" footprint="0603" schSectionName="radio" schX={-4} schY={-6} schRotation={-90} pcbX={5} pcbY={10} pcbRotation={180} />
      <capacitor name="C10" capacitance="100nF" footprint="0603" schSectionName="radio" schX={-4} schY={-9} schRotation={-90} pcbX={9} pcbY={10} />
      <capacitor name="C11" capacitance="1uF" footprint="0603" schSectionName="radio" schX={-4} schY={-12} schRotation={-90} pcbX={13} pcbY={10} />
      <inductor name="L1" inductance="3.9nH" footprint="0402" schSectionName="radio" schX={8} schY={5} pcbX={13} pcbY={1} />
      <capacitor name="C12" capacitance="0.8pF" footprint="jlcpcb:C88902" schSectionName="radio" schX={8} schY={3} schRotation={-90} pcbX={12} pcbY={-1} />
      <inductor name="L2" inductance="6.8nH" footprint="0402" schSectionName="radio" schX={9} schY={1} pcbX={15.5} pcbY={1} />
      <RFANT3216120A5T name="ANT1" schSectionName="radio" schX={12} schY={1} pcbX={19.5} pcbY={1} />
      <trace name="RF_CHIP_MATCH" from="U1.ANT" to="L1.pin1" />
      <trace name="RF_SHUNT_C" from="L1.pin1" to="C12.pin1" />
      <trace from="C12.pin2" to="net.GND" />
      <trace name="RF_MATCH_SERIES" from="L1.pin2" to="L2.pin1" />
      <trace name="RF_ANT_FEED" from="L2.pin2" to="ANT1.FEED" />
      <resistor name="R7" resistance="100k" footprint="jlcpcb:C25741" supplierPartNumbers={{ jlcpcb: ["C25741"] }} schSectionName="radio" schX={-1} schY={-5} schRotation={-90} pcbX={17.5} pcbY={-10.5} />
      <resistor name="R14" resistance="1k" footprint="jlcpcb:C11702" supplierPartNumbers={{ jlcpcb: ["C11702"] }} schSectionName="radio" schX={0} schY={-4.5} schRotation={-90} pcbX={-5.5} pcbY={-11} />
      <KT_0603R name="LED1" color="red" schSectionName="radio" schX={0} schY={-6} schRotation={-90} pcbX={-2} pcbY={-11} />
      <schematictext schX={2.5} schY={-6} fontSize={0.24}
        anchor="center" color="#334155" text="Debug LED, 3 V GPIO via 1 k" />
      <trace name="RADIO_RESET" from="R7.pin2" to="U1.RESET" />
      {[[5, -11], [7, -11], [9, -11], [5, -13], [7, -13], [9, -13], [11, -13]].map(([x, y], i) => (
        <Fragment key={`testpoint-${i}`}>
          <testpoint name={`TP${i + 1}`} footprintVariant="pad" padDiameter="1mm" schSectionName="radio" schX={6} schY={7 - i * 2} pcbX={x} pcbY={y} />
        </Fragment>
      ))}
      {radioTraces.map(([from, to], i) => (
        <Fragment key={`radio-trace-${i}`}>
          <trace name={`RADIO_LINK_${i + 1}`} from={from} to={to} />
        </Fragment>
      ))}
    </schematicsheet>

    <keepout shape="rect" pcbX={20} pcbY={1}
      width="5mm" height="5mm" layers={["top", "bottom"]} excludeRefs={[".ANT1"]} />
    <keepout shape="rect" pcbX={20.35} pcbY={0.8}
      width="0.8mm" height="0.8mm" layers={["bottom"]} />
    <keepout shape="rect" pcbX={7} pcbY={14}
      width="3mm" height="3mm" layers={["bottom"]} excludeRefs={[".X1"]} />
  </board>
)

export default () => (
  <assembly.device name="TurnCountDevice">
    <TurnCountBoard />
  </assembly.device>
)
