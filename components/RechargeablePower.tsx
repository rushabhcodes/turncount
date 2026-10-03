import { Fragment } from "react"
import { BQ24074RGTR } from "../imports/BQ24074RGTR"
import { TPS7A0230PDBVR } from "../imports/TPS7A0230PDBVR"
import { TYPE_C_31_M_12 } from "../imports/TYPE_C_31_M_12"
import { S3B_PH_SM4_TB_LF__SN_ } from "../imports/S3B_PH_SM4_TB_LF__SN_"

// USB power only: independent CC pull-downs work with either cable orientation.
// EN1=EN2=0 selects USB100. ISET requests ~103 mA; the 100 mA input
// limit gives priority to the system and reduces charging current as needed.
// TMR and ITERM are intentionally open, selecting TI's default active timers
// and termination threshold. TS must connect to a pack-mounted 10k NTC.
const connections: [string, string][] = [
  ...["VBUS1", "VBUS2"].map((pin): [string, string] => [`J1.${pin}`, "net.USB_5V"]),
  ...["GND1", "GND2", "EH1", "EH2", "EH3", "EH4"].map((pin): [string, string] => [`J1.${pin}`, "net.GND"]),
  ["J1.CC1", "R8.pin1"], ["J1.CC2", "R9.pin1"],
  ["R8.pin2", "net.GND"], ["R9.pin2", "net.GND"],
  ["J2.BAT_POS", "net.VBAT"], ["J2.BAT_NEG", "net.GND"],
  ["J2.NTC", "U2.TS"],
  ["J2.ANCHOR_R", "net.GND"], ["J2.ANCHOR_L", "net.GND"],
  ["U2.IN", "net.USB_5V"],
  ["U2.BAT1", "net.VBAT"], ["U2.BAT2", "net.VBAT"],
  ["U2.OUT1", "net.VSYS"], ["U2.OUT2", "net.VSYS"],
  ...["VSS", "EP", "N_CE", "EN1", "EN2"].map((pin): [string, string] => [`U2.${pin}`, "net.GND"]),
  ["U2.ISET", "R10.pin1"], ["R10.pin2", "net.GND"],
  ["U2.ILIM", "R11.pin1"], ["R11.pin2", "net.GND"],
  ["U2.N_CHG", "net.CHARGE_N"], ["U2.N_PGOOD", "net.USB_PRESENT_N"],
  ["R12.pin1", "net.V3V0"], ["R12.pin2", "net.CHARGE_N"],
  ["R13.pin1", "net.V3V0"], ["R13.pin2", "net.USB_PRESENT_N"],
  ["U3.IN", "net.VSYS"], ["U3.EN", "net.VSYS"],
  ["U3.GND", "net.GND"], ["U3.OUT", "net.V3V0"],
  ...([ ["C6", "USB_5V"], ["C7", "VBAT"], ["C8", "VSYS"], ["C9", "V3V0"] ] as const)
    .flatMap(([ref, rail]): [string, string][] => [[`${ref}.pin1`, `net.${rail}`], [`${ref}.pin2`, "net.GND"]]),
  ["TP8.pin1", "net.VBAT"], ["TP9.pin1", "net.VSYS"],
  ["TP10.pin1", "net.USB_5V"], ["TP11.pin1", "net.CHARGE_N"],
  ["TP12.pin1", "net.USB_PRESENT_N"],
]
const directTraceNames: Record<string, string> = {
  "J1.CC1->R8.pin1": "USB_CC1",
  "J1.CC2->R9.pin1": "USB_CC2",
  "J2.NTC->U2.TS": "BAT_NTC",
  "U2.ISET->R10.pin1": "CHARGE_ISET",
  "U2.ILIM->R11.pin1": "INPUT_ILIM",
}

export const RechargeablePower = () => (
  <>
    <TYPE_C_31_M_12 name="J1" schSectionName="power" schX={-7} schY={0}
      pcbX={0} pcbY={-18.25} />
    <S3B_PH_SM4_TB_LF__SN_ name="J2" schSectionName="power" schX={-1} schY={6}
      pcbX={-12} pcbY={0} pcbRotation={90} />
    <BQ24074RGTR name="U2" schSectionName="power" schX={-1} schY={0}
      pcbX={-12} pcbY={11} />
    <TPS7A0230PDBVR name="U3" schSectionName="power" schX={6} schY={0}
      pcbX={-4} pcbY={14} pcbRotation={180} />

    <schematictext schX={-7} schY={2.7} fontSize={0.24}
      anchor="center" color="#334155" text="USB-C 5 V power input" />
    <schematictext schX={-7} schY={2.3} fontSize={0.24}
      anchor="center" color="#334155" text="100 mA USB input limit" />
    <schematictext schX={-1} schY={8.2} fontSize={0.24}
      anchor="center" color="#334155" text="Protected 1S LiPo connector" />
    <schematictext schX={-1} schY={7.8} fontSize={0.24}
      anchor="center" color="#334155" text="4.2 V max; 10 k NTC lead" />
    <schematictext schX={0.5} schY={3.6} fontSize={0.24}
      anchor="center" color="#334155" text="BQ24074 charger + power path" />
    <schematictext schX={0.5} schY={3.2} fontSize={0.24}
      anchor="center" color="#334155" text="4.2 V cell; USB100 mode" />
    <schematictext schX={6} schY={2.2} fontSize={0.24}
      anchor="center" color="#334155" text="3.0 V low-dropout regulator" />
    <schematictext schX={6} schY={1.8} fontSize={0.24}
      anchor="center" color="#334155" text="200 mA rated output" />

    <resistor name="R8" resistance="5.1k" footprint="jlcpcb:C25905" supplierPartNumbers={{ jlcpcb: ["C25905"] }}
      schSectionName="power" schX={-8} schY={-5} schRotation={-90} pcbX={-6.5} pcbY={-14} />
    <resistor name="R9" resistance="5.1k" footprint="jlcpcb:C25905" supplierPartNumbers={{ jlcpcb: ["C25905"] }}
      schSectionName="power" schX={-5} schY={-5} schRotation={-90} pcbX={1} pcbY={-12} pcbRotation={180} />
    <resistor name="R10" resistance="8.66k" footprint="jlcpcb:C227261" supplierPartNumbers={{ jlcpcb: ["C227261"] }}
      schSectionName="power" schX={-2} schY={-5} schRotation={-90} pcbX={-14} pcbY={14.5} />
    <resistor name="R11" resistance="3.09k" footprint="jlcpcb:C11460" supplierPartNumbers={{ jlcpcb: ["C11460"] }}
      schSectionName="power" schX={1} schY={-5} schRotation={-90} pcbX={-9.5} pcbY={15.5} />
    <resistor name="R12" resistance="100k" footprint="jlcpcb:C25741" supplierPartNumbers={{ jlcpcb: ["C25741"] }}
      schSectionName="power" schX={5} schY={-5} schRotation={-90} pcbX={4} pcbY={12} />
    <resistor name="R13" resistance="100k" footprint="jlcpcb:C25741" supplierPartNumbers={{ jlcpcb: ["C25741"] }}
      schSectionName="power" schX={8} schY={-5} schRotation={-90} pcbX={6.5} pcbY={12} />

    <capacitor name="C6" capacitance="1uF" footprint="0603"
      manufacturerPartNumber="CL10A105KB8NNNC" supplierPartNumbers={{ jlcpcb: ["C15849"] }}
      schSectionName="power" schX={-4} schY={3} schRotation={-90} pcbX={-16.5} pcbY={10} />
    {[
      ["C7", -4, 6, -14.5, 6.5],
      ["C8", 3, 3, -7.5, 11],
      ["C9", 9, -1, 0, 15.5],
    ].map(([name, schX, schY, pcbX, pcbY]) => (
      <Fragment key={String(name)}>
        <capacitor name={String(name)} capacitance="10uF" footprint="0805"
          manufacturerPartNumber="CL21A106KAYNNNE" supplierPartNumbers={{ jlcpcb: ["C15850"] }}
          schSectionName="power" schX={Number(schX)} schY={Number(schY)} schRotation={-90}
          pcbX={Number(pcbX)} pcbY={Number(pcbY)} pcbRotation={name === "C7" ? 180 : undefined} />
      </Fragment>
    ))}
    {[[13, -14], [15, -14], [11, -16], [4, 16], [6.5, 16]].map(([x, y], i) => (
      <Fragment key={`power-test-${i}`}>
        <testpoint name={`TP${i + 8}`} footprintVariant="pad" padDiameter="1mm"
          schSectionName="power" schX={11} schY={i === 4 ? -5.5 : 8 - i * 3} pcbX={x} pcbY={y} />
      </Fragment>
    ))}
    {/* Mechanical allocation only: an external pack, not a selected battery SKU. */}
    <pcbnoterect layer="bottom" pcbX={0} pcbY={0} width={20} height={30}
      isStrokeDashed strokeWidth={0.15} color="#38bdf8" />
    <pcbnotetext layer="bottom" pcbX={0} pcbY={10} fontSize={0.8}
      text="1S protected LiPo reserve: 20 x 30 mm; cell TBD" />
    {connections.map(([from, to], i) => (
      <Fragment key={`power-trace-${i}`}>
        <trace name={directTraceNames[`${from}->${to}`] ?? `power_${i}`} from={from} to={to} />
      </Fragment>
    ))}
  </>
)
