// First electrical draft for TurnCount V1. Pad numbers for the Raytac module
// follow the MDBT42Q-512K KiCad symbol; enclosure fit still needs verification.
// Module land pattern: BishopFox/mellon, MDBT42Q-P512KV2_RAY.kicad_mod.
// Encoder land pattern: ElectronicCats/SamyKamTools, SW_PEC11R-4215F-S0024.kicad_mod.
const modulePads: [number, number, number, number, number][] = [
  [1, -4.6, 3.801, 1.397, 0.813],
  ...Array.from({ length: 10 }, (_, i): [number, number, number, number, number] => [i + 2, -4.6, 0.801 - i * 0.7, 1.397, 0.406]),
  ...Array.from({ length: 13 }, (_, i): [number, number, number, number, number] => [i + 12, -4.2 + i * 0.7, -7.6, 0.406, 1.397]),
  ...Array.from({ length: 15 }, (_, i): [number, number, number, number, number] => [i + 25, 4.6, i === 14 ? 3.801 : -6.199 + i * 0.7, 1.397, i === 14 ? 0.813 : 0.406]),
  [40, 2.9, 3.251, 0.991, 0.406],
  [41, 2.9, 1.851, 0.991, 0.406],
]

const moduleFootprint = (
  <footprint>
    {modulePads.map(([pin, x, y, width, height]) => (
      <smtpad portHints={[String(pin)]} pcbX={x} pcbY={y} width={width} height={height} shape="rect" />
    ))}
  </footprint>
)
const encoderFootprint = (
  <footprint>
    <platedhole portHints={["A"]} pcbX={-2.5} pcbY={-7.5} holeDiameter="1mm" outerDiameter="1.51mm" shape="circle" />
    <platedhole portHints={["C"]} pcbX={0} pcbY={-7.5} holeDiameter="1mm" outerDiameter="1.51mm" shape="circle" />
    <platedhole portHints={["B"]} pcbX={2.5} pcbY={-7.5} holeDiameter="1mm" outerDiameter="1.51mm" shape="circle" />
    <platedhole portHints={["1"]} pcbX={-2.5} pcbY={7} holeDiameter="1mm" outerDiameter="1.51mm" shape="circle" />
    <platedhole portHints={["2"]} pcbX={2.5} pcbY={7} holeDiameter="1mm" outerDiameter="1.51mm" shape="circle" />
    <smtpad portHints={["P1"]} pcbX={-5.7} pcbY={0} width="1.8mm" height="2.6mm" shape="rect" />
    <smtpad portHints={["P2"]} pcbX={5.7} pcbY={0} width="1.8mm" height="2.6mm" shape="rect" />
  </footprint>
)

const signalNames = ["A", "B", "SW"] as const
const traces: [string, string][] = [
  ["BAT1.POS", "net.VBAT"], ["BAT1.NEG", "net.GND"],
  ["U1.VDD", "net.VBAT"],
  ...["GND1", "GND12", "GND24", "GND39"].map((pin): [string, string] => [`U1.${pin}`, "net.GND"]),
  ...["C1", "C2"].flatMap((ref): [string, string][] => [[`${ref}.pin1`, "net.VBAT"], [`${ref}.pin2`, "net.GND"]]),
  ["ENC1.C", "net.GND"], ["ENC1.SW2", "net.GND"],
  ...signalNames.flatMap((signal, i): [string, string][] => [
    [`ENC1.${signal === "SW" ? "SW1" : signal}`, `R${i + 1}.pin1`],
    [`R${i + 1}.pin2`, `net.ENC_${signal}`],
    [`R${i + 4}.pin1`, "net.VBAT"],
    [`R${i + 4}.pin2`, `net.ENC_${signal}`],
    [`C${i + 3}.pin1`, `net.ENC_${signal}`],
    [`C${i + 3}.pin2`, "net.GND"],
    [`U1.P0_${11 + i}`, `net.ENC_${signal}`],
  ]),
  ["R7.pin1", "net.VBAT"], ["R7.pin2", "U1.RESET"],
  ["TP1.pin1", "net.VBAT"], ["TP2.pin1", "net.GND"],
  ["TP3.pin1", "U1.SWDCLK"], ["TP4.pin1", "U1.SWDIO"],
  ["TP5.pin1", "U1.RESET"], ["TP6.pin1", "net.ENC_A"],
  ["TP7.pin1", "net.ENC_B"],
]

export default () => (
  <board width="60mm" height="60mm" layers={2} thickness="1mm">
    <schematicsection name="power" displayName="Coin cell supply" />
    <schematicsection name="inputs" displayName="Rotary encoder inputs" />
    <schematicsection name="radio" displayName="BLE and programming" />

    <chip name="U1" manufacturerPartNumber="MDBT42Q-512KV2"
      footprint={moduleFootprint}
      pinLabels={{ pin1: "GND1", pin11: "VDD", pin12: "GND12", pin24: "GND24",
        pin25: "P0_11", pin26: "P0_12", pin27: "P0_13", pin35: "RESET",
        pin36: "SWDCLK", pin37: "SWDIO", pin39: "GND39" }}
      pinAttributes={{ VDD: { requiresPower: true }, SWDCLK: { mustBeConnected: true }, SWDIO: { mustBeConnected: true } }}
      schSectionName="radio" schX={20} schY={0} pcbX={14} pcbY={13} />
    <keepout shape="rect" pcbX={14} pcbY={22} width="10mm" height="9mm" layers={["top", "bottom"]} />
    <chip name="BAT1" manufacturerPartNumber="Keystone 3002"
      footprint="kicad:Battery/BatteryHolder_Keystone_3002_1x2032"
      pinLabels={{ pin1: "POS", pin2: "NEG" }}
      schSectionName="power" schX={0} schY={0} pcbX={-14} pcbY={-18} layer="bottom" />
    <chip name="ENC1" manufacturerPartNumber="PEC11R-4215F-S0024"
      footprint={encoderFootprint}
      pinLabels={{ pin1: "SW1", pin2: "SW2", pin3: "A", pin4: "C", pin5: "B", pin6: "P1", pin7: "P2" }}
      schSectionName="inputs" schX={0} schY={-15} pcbX={0} pcbY={0} />

    <capacitor name="C1" capacitance="100nF" footprint="0402" schSectionName="power" schX={3} schY={1} schRotation={-90} pcbX={9} pcbY={-7} />
    <capacitor name="C2" capacitance="10uF" footprint="0805" schSectionName="power" schX={5} schY={1} schRotation={-90} pcbX={9} pcbY={-9} />
    {signalNames.map((signal, i) => (
      <>
        <resistor name={`R${i + 1}`} resistance="1k" footprint="0402" schSectionName="inputs" schX={3} schY={-13 - i * 2} pcbX={4 + i * 2} pcbY={-11} />
        <resistor name={`R${i + 4}`} resistance="100k" footprint="0402" schSectionName="inputs" schX={6} schY={-13 - i * 2} schRotation={-90} pcbX={4 + i * 2} pcbY={-13} />
        <capacitor name={`C${i + 3}`} capacitance="1nF" footprint="0402" schSectionName="inputs" schX={9} schY={-13 - i * 2} schRotation={-90} pcbX={4 + i * 2} pcbY={-15} pcbRotation={180} />
      </>
    ))}
    <resistor name="R7" resistance="100k" footprint="0402" schSectionName="radio" schX={24} schY={2} schRotation={-90} pcbX={7.5} pcbY={9} />
    {[[16, -12], [18, -12], [20, -12], [22, -12], [16, -15], [18, -15], [20, -15]].map(([x, y], i) => (
      <testpoint key={i} name={`TP${i + 1}`} footprintVariant="pad" padDiameter="1mm" schSectionName="radio" schX={24} schY={-2 - i * 2} pcbX={x} pcbY={y} />
    ))}
    {traces.map(([from, to], i) => <trace key={String(i)} from={from} to={to} />)}
  </board>
)
