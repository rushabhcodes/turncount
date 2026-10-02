// First electrical draft for TurnCount V1. Pad numbers for the Raytac module
// follow the MDBT42Q-512K KiCad symbol; enclosure fit still needs verification.
// Module land pattern: BishopFox/mellon, MDBT42Q-P512KV2_RAY.kicad_mod.
// Encoder and holder: exact JLCPCB imports with remote CAD model URLs.
// The module STEP model is from yuhki50/kicad-packages3D (CC BY-SA 4.0).
import { Fragment } from "react"
import { A_3002 } from "./imports/A_3002"
import { EC11J1525402 } from "./imports/EC11J1525402"
import moduleStep from "./models/MDBT42Q.step"

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
      <Fragment key={pin}>
        <smtpad portHints={[String(pin)]} pcbX={x} pcbY={y} width={width} height={height} shape="rect" />
      </Fragment>
    ))}
  </footprint>
)
const signalNames = ["A", "B", "SW"] as const
const boardDiameter = 48
const boardOutline = Array.from({ length: 180 }, (_, i) => {
  const angle = 2 * Math.PI * i / 180
  return { x: boardDiameter / 2 * Math.cos(angle), y: boardDiameter / 2 * Math.sin(angle) }
})
const traces: [string, string][] = [
  ["BAT1.BAT_POS", "net.VBAT"], ["BAT1.BAT_NEG", "net.GND"],
  ["U1.VDD", "net.VBAT"],
  ...["GND1", "GND12", "GND24", "GND39"].map((pin): [string, string] => [`U1.${pin}`, "net.GND"]),
  ...["C1", "C2"].flatMap((ref): [string, string][] => [[`${ref}.pin1`, "net.VBAT"], [`${ref}.pin2`, "net.GND"]]),
  ["ENC1.C", "net.GND"], ["ENC1.E", "net.GND"],
  ...signalNames.flatMap((signal, i): [string, string][] => [
    [`ENC1.${signal === "SW" ? "D" : signal}`, `R${i + 1}.pin1`],
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
  <board title="TurnCount — circular SMT encoder prototype"
    width={boardDiameter} height={boardDiameter} outline={boardOutline}
    layers={2} thickness="1.6mm" defaultViaTenting="both_sides">
    <schematicsection name="power" displayName="Coin cell supply" />
    <schematicsection name="inputs" displayName="Rotary encoder inputs" />
    <schematicsection name="radio" displayName="BLE and programming" />

    <chip name="U1" manufacturerPartNumber="MDBT42Q-512KV2"
      footprint={moduleFootprint}
      cadModel={{
        stepUrl: moduleStep,
        modelBoardNormalDirection: "y+",
      }}
      pinLabels={{ pin1: "GND1", pin11: "VDD", pin12: "GND12", pin24: "GND24",
        pin25: "P0_11", pin26: "P0_12", pin27: "P0_13", pin35: "RESET",
        pin36: "SWDCLK", pin37: "SWDIO", pin39: "GND39" }}
      pinAttributes={{ VDD: { requiresPower: true }, SWDCLK: { mustBeConnected: true }, SWDIO: { mustBeConnected: true } }}
      schSectionName="radio" schX={20} schY={0} pcbX={16.5} pcbY={0} />
    <keepout shape="rect" pcbX={17} pcbY={14.25}
      width="11mm" height="19.5mm" layers={["top", "bottom"]} />
    <A_3002 name="BAT1"
      schSectionName="power" schX={0} schY={0} pcbX={0} pcbY={0} pcbRotation={90} layer="bottom" />
    <EC11J1525402 name="ENC1"
      schSectionName="inputs" schX={0} schY={-15} pcbX={0} pcbY={0} />

    <capacitor name="C1" capacitance="100nF" footprint="0402" schSectionName="power" schX={3} schY={1} schRotation={-90} pcbX={11.5} pcbY={-9} />
    <capacitor name="C2" capacitance="10uF" footprint="0805" schSectionName="power" schX={5} schY={1} schRotation={-90} pcbX={14} pcbY={-10.5} />
    {signalNames.map((signal, i) => (
      <Fragment key={signal}>
        <resistor name={`R${i + 1}`} resistance="1k" footprint="0402" schSectionName="inputs" schX={3} schY={-13 - i * 2} pcbX={-6 + i * 3} pcbY={-12} />
        <resistor name={`R${i + 4}`} resistance="100k" footprint="0402" schSectionName="inputs" schX={6} schY={-13 - i * 2} schRotation={-90} pcbX={-6 + i * 3} pcbY={-14} />
        <capacitor name={`C${i + 3}`} capacitance="1nF" footprint="0402" schSectionName="inputs" schX={9} schY={-13 - i * 2} schRotation={-90} pcbX={-6 + i * 3} pcbY={-16} pcbRotation={180} />
      </Fragment>
    ))}
    <resistor name="R7" resistance="100k" footprint="0402" schSectionName="radio" schX={24} schY={2} schRotation={-90} pcbX={17.5} pcbY={-10.5} />
    {[[4, -14], [6, -14], [8, -14], [10, -14], [4, -17], [6, -17], [8, -17]].map(([x, y], i) => (
      <Fragment key={`testpoint-${i}`}>
        <testpoint name={`TP${i + 1}`} footprintVariant="pad" padDiameter="1mm" schSectionName="radio" schX={24} schY={-2 - i * 2} pcbX={x} pcbY={y} />
      </Fragment>
    ))}
    {traces.map(([from, to], i) => (
      <Fragment key={`trace-${i}`}>
        <trace from={from} to={to} />
      </Fragment>
    ))}
  </board>
)
