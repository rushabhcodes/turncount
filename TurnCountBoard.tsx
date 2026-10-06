// Coin-cell nRF52810 prototype. RF fit still needs verification.
import { Fragment } from "react"
import { assembly } from "@tscircuit/core"
import { CoinCellPower } from "./components/CoinCellPower"
import { GT_EVA01AA_L1 } from "./imports/GT_EVA01AA_L1"
import { KT_0603R } from "./imports/KT_0603R"
import { NRF52810_QFAA_R } from "./imports/NRF52810_QFAA_R"
import { RFANT3216120A5T } from "./imports/RFANT3216120A5T"
import { X201632MKB4SI } from "./imports/X201632MKB4SI"
import { fanoutTracePath } from "@tscircuit/props"
import savedTracePaths from "./routing/pcb-trace-paths.json"
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
  ...["C1", "C2", "C15"].flatMap((ref): [string, string][] => [[`${ref}.pin1`, "net.VBAT"], [`${ref}.pin2`, "net.GND"]]),
  ...["C8", "C9", "C10", "C11"].flatMap((ref): [string, string][] => [[`${ref}.pin1`, `U1.${ref === "C8" ? "DEC1" : ref === "C9" ? "DEC2" : ref === "C10" ? "DEC3" : "DEC4"}`], [`${ref}.pin2`, "net.GND"]]),
  ...signalNames.map((_, i): [string, string] => [`U1.P0_${11 + i}`, `net.ENC_${signalNames[i]}`]),
  ["R7.pin1", "net.VBAT"],
  ["TP1.pin1", "net.VBAT"], ["TP2.pin1", "net.GND"],
  ["TP3.pin1", "U1.SWDCLK"], ["TP4.pin1", "U1.SWDIO"],
  ["TP5.pin1", "R7.pin2"], ["TP6.pin1", "net.ENC_A"],
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
    layers={2} thickness="1.6mm" defaultViaTenting="both_sides" routeRemaining={false}
    // Standard mechanical through-vias; avoid JLCPCB small-hole surcharges.
    minViaHoleDiameter="0.3mm" minViaPadDiameter="0.6mm"
    pcbStyle={{ viaHoleDiameter: "0.3mm", viaPadDiameter: "0.6mm" }}
    minTraceWidth="0.15mm" minTraceToPadEdgeClearance="0.15mm"
    minPadEdgeToPadEdgeClearance="0.15mm" minBoardEdgeClearance="0.3mm"
    minTraceToHoleEdgeClearance="0.2mm"
    minViaHoleEdgeToViaHoleEdgeClearance="0.45mm"
    minViaEdgeToPadEdgeClearance="0.2mm"
    autorouter={{ allowViaInPad: false }}
    minPlatedHoleDrillEdgeToDrillEdgeClearance="0.45mm"
    schLayout={{ layoutMode: "relative" }}>
    <autoroutingphase name="LocalDecoupling" phaseIndex={0} connections={[]}
      pcbTracePaths={savedTracePaths.filter(path => /^(C8|C9|C10|C11)\.pin1$/.test(path.connection)).map(path => fanoutTracePath.parse(path))} />
    <autoroutingphase name="VerifiedRoutes" connections={[]}
      pcbTracePaths={savedTracePaths.filter(path => !/^(C8|C9|C10|C11)\.pin1$/.test(path.connection)).map(path => fanoutTracePath.parse(path))} />

      <schematicsheet name="Power" displayName="1 · Coin-cell power"
      sheetIndex={0} sheetWidth="80mm" sheetHeight="60mm">
      <CoinCellPower />
    </schematicsheet>

    <schematicsheet name="Inputs" displayName="2 · Rotary encoder inputs"
      sheetIndex={1} sheetWidth="150mm" sheetHeight="100mm">
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
          <capacitor name={`C${i + 3}`} capacitance="1nF" footprint="jlcpcb:C1523" supplierPartNumbers={{ jlcpcb: ["C1523"] }} schSectionName="inputs" schX={5} schY={3 - i * 3} schRotation={-90} pcbX={-15.5 + i * 3} pcbY={-13} pcbRotation={180} />
        </Fragment>
      ))}
      {inputTraces.map(([from, to], i) => (
        <Fragment key={`input-trace-${i}`}>
          <trace name={`${from}_TO_${to}`} from={from} to={to} />
        </Fragment>
      ))}
    </schematicsheet>

    <schematicsheet name="Controller" displayName="3 · Controller, RF and debug"
      sheetIndex={2} sheetWidth="220mm" sheetHeight="220mm">
      <schematicsection name="radio" displayName="nRF52810 MCU" />
      <NRF52810_QFAA_R name="U1"
        schSectionName="radio" schX={-0.73} schY={0} pcbX={8} pcbY={4} />
      <schematictext schX={0} schY={4.7} fontSize={0.24}
        anchor="center" color="#334155" text="Nordic nRF52810-QFAA-R · bare QFN-48" />
      <schematictext schX={0} schY={4.3} fontSize={0.24}
        anchor="center" color="#334155" text="CR2032 direct supply · SWD programming" />
      <schematicsection name="hf_clock" displayName="HF crystal" />
      <X201632MKB4SI name="X1" noSchematicRepresentation pcbX={7} pcbY={14} pcbRotation={90} />
      <schematicsymbol name="X1_SYMBOL" displayName="X1 · 32 MHz" chipRef=".X1"
        symbolName="crystal_4pin" schSectionName="hf_clock" schX={0} schY={7}
        connections={{
          pin1: ".X1 > .XTAL1", gnd1: ".X1 > .GND1",
          pin3: ".X1 > .XTAL2", gnd2: ".X1 > .GND2",
        }} />
      <capacitor name="C13" capacitance="12pF" footprint="0603"
        schSectionName="hf_clock" schX={-3} schY={7} schRotation={-90} pcbX={4} pcbY={14} />
      <capacitor name="C14" capacitance="12pF" footprint="0603"
        schSectionName="hf_clock" schX={3} schY={7} schRotation={-90} pcbX={10.5} pcbY={14} />
      <trace name="HF_XTAL1_MCU" from="U1.XC1" to="X1.XTAL1" />
      <trace name="HF_XTAL2_MCU" from="U1.XC2" to="X1.XTAL2" />
      <trace from="X1.GND1" to="net.GND" />
      <trace from="X1.GND2" to="net.GND" />
      <trace name="HF_XTAL1_LOAD" from="X1.XTAL1" to="C13.pin1" />
      <trace from="C13.pin2" to="net.GND" />
      <trace name="HF_XTAL2_LOAD" from="X1.XTAL2" to="C14.pin1" />
      <trace from="C14.pin2" to="net.GND" />
      <capacitor name="C1" decouplingFor="U1.VDD1" maxDecouplingTraceLength="3mm" capacitance="100nF" footprint="0603" schSectionName="radio" schX={3.74} schY={4} schRotation={-90} pcbX={14.125} pcbY={2.5} pcbRotation={0} />
      <capacitor name="C2" decouplingFor="U1.VDD2" maxDecouplingTraceLength="3mm" capacitance="100nF" footprint="0603" schSectionName="radio" schX={3.37} schY={2} schRotation={-90} pcbX={2.7} pcbY={2.9} pcbRotation={180} />
      <capacitor name="C15" decouplingFor="U1.VDD3" maxDecouplingTraceLength="3mm" capacitance="100nF" footprint="0603" schSectionName="radio" schX={5} schY={6} schRotation={-90} pcbX={4.3} pcbY={9.4} pcbRotation={90} />
      <capacitor name="C8" decouplingFor="U1.DEC1" maxDecouplingTraceLength="3mm" capacitance="100nF" footprint="0603" schSectionName="radio" schX={6.5} schY={0} schRotation={-90} pcbX={5.8} pcbY={-1.5} pcbRotation={-90} />
      <capacitor name="C9" decouplingFor="U1.DEC2" maxDecouplingTraceLength="3mm" capacitance="100pF" footprint="0603" schSectionName="radio" schX={4.15} schY={-2} schRotation={-90} pcbX={8.2} pcbY={9.925} pcbRotation={90} />
      <capacitor name="C10" decouplingFor="U1.DEC3" maxDecouplingTraceLength="3mm" capacitance="100nF" footprint="0603" schSectionName="radio" schX={4.8} schY={-4} schRotation={-90} pcbX={6.5} pcbY={10.5} pcbRotation={90} />
      <capacitor name="C11" decouplingFor="U1.DEC4" maxDecouplingTraceLength="3mm" capacitance="1uF" footprint="0603" schSectionName="radio" schX={5.45} schY={-6} schRotation={-90} pcbX={2.7} pcbY={4.5} pcbRotation={180} />
      <inductor name="L1" inductance="3.9nH" footprint="jlcpcb:C98062" manufacturerPartNumber="LQW15AN3N9B00D" supplierPartNumbers={{ jlcpcb: ["C98062"] }} schSectionName="radio" schX={4.46} schY={3} pcbX={13} pcbY={1} />
      <capacitor name="C12" capacitance="0.8pF" footprint="jlcpcb:C88902" supplierPartNumbers={{ jlcpcb: ["C88902"] }} schSectionName="radio" schX={4.11} schY={1} schRotation={-90} pcbX={12} pcbY={-1} />
      <inductor name="L2" inductance="6.8nH" footprint="jlcpcb:C82919" manufacturerPartNumber="LQW15AN6N8G00D" supplierPartNumbers={{ jlcpcb: ["C82919"] }} schSectionName="radio" schX={7} schY={3} pcbX={15.5} pcbY={1} />
      <RFANT3216120A5T name="ANT1" schSectionName="radio" schX={9} schY={3} pcbX={19.5} pcbY={1} />
      <trace name="RF_CHIP_MATCH" from="U1.ANT" to="L1.pin1" />
      <trace name="RF_SHUNT_C" from="L1.pin1" to="C12.pin1" />
      <trace from="C12.pin2" to="net.GND" />
      <trace name="RF_MATCH_SERIES" from="L1.pin2" to="L2.pin1" />
      <trace name="RF_ANT_FEED" from="L2.pin2" to="ANT1.FEED" />
      <resistor name="R7" resistance="100k" footprint="jlcpcb:C25741" supplierPartNumbers={{ jlcpcb: ["C25741"] }} schSectionName="radio" schX={-4} schY={-6} schRotation={-90} pcbX={17.5} pcbY={-10.5} />
      <resistor name="R14" resistance="1k" footprint="jlcpcb:C11702" supplierPartNumbers={{ jlcpcb: ["C11702"] }} schSectionName="radio" schX={1} schY={-7} schRotation={-90} pcbX={-5.5} pcbY={-11} />
      <KT_0603R name="LED1" color="red" schSectionName="radio" schX={1} schY={-9} schRotation={-90} pcbX={-2} pcbY={-11} />
      <schematictext schX={3} schY={-9} fontSize={0.24}
        anchor="center" color="#334155" text="Debug LED, 3 V GPIO via 1 k" />
      <trace name="RADIO_RESET" from="R7.pin2" to="U1.RESET" />
      {[[5, -11, -7, 1], [7, -11, -7, -1], [9, -11, -7, -3], [5, -13, -7, -5], [7, -13, -7, -7], [9, -13, 9, -1], [11, -13, 9, -3]].map(([pcbX, pcbY, schX, schY], i) => (
        <Fragment key={`testpoint-${i}`}>
          <testpoint name={`TP${i + 1}`} doNotPlace footprintVariant="pad" padDiameter="1mm" schSectionName="radio" schX={schX} schY={schY} pcbX={pcbX} pcbY={pcbY} />
        </Fragment>
      ))}
      {radioTraces.map(([from, to], i) => (
        <Fragment key={`radio-trace-${i}`}>
          <trace name={`${from}_TO_${to}`} from={from} to={to}
            routingPhaseIndex={/^(C8|C9|C10|C11)\.pin1$/.test(from) ? 0 : undefined}
            // Shared rail routing uses a net anchor; check-decoupling measures the
            // actual capacitor-to-pin top-layer copper path against 3 mm.
            maxLength={to.startsWith("net.") && /^(C1|C2|C15|C8|C9|C10|C11)\.pin[12]$/.test(from) ? "30mm" : undefined} />
        </Fragment>
      ))}
    </schematicsheet>

    <keepout shape="rect" pcbX={20} pcbY={1}
      width="5mm" height="5mm" layers={["top", "bottom"]} excludeRefs={[".ANT1"]} />
    {/* Bottom keepouts prevent through-vias in these top-side ground pads. */}
    <keepout shape="rect" pcbX={8} pcbY={4}
      width="4.7mm" height="4.7mm" layers={["bottom"]} />
    <keepout shape="rect" pcbX={12.42} pcbY={-1}
      width="0.95mm" height="1.2mm" layers={["bottom"]} />
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
