import { Fragment } from "react"
import { ANNA_B112_00B } from "../imports/ANNA_B112_00B"

// u-blox UBX-18009821 R11, Appendix B, Figures 29 and 30.
// Reference origin is the lower-left of the 6.5 mm module in Figure 29.
// Numeric pcbPath points use the module’s local frame, including its rotation.
export const radioPathPoint = (x: number, y: number) => ({ x: -y, y: x - 15.8 })
const referencePoint = (x: number, y: number) => radioPathPoint(19.05 - x, 3.25 - y)
const unusedPads = [
  {
    "pin": 16,
    "x": 12.960026000000001,
    "y": 0.649986
  },
  {
    "pin": 19,
    "x": 12.960026000000001,
    "y": -1.299972
  },
  {
    "pin": 20,
    "x": 12.960026000000001,
    "y": -1.949958
  },
  {
    "pin": 21,
    "x": 13.610012000000001,
    "y": 0.975106
  },
  {
    "pin": 22,
    "x": 13.610012000000001,
    "y": 0.32512
  },
  {
    "pin": 23,
    "x": 13.610012000000001,
    "y": -0.324866
  },
  {
    "pin": 24,
    "x": 13.610012000000001,
    "y": -0.974852
  },
  {
    "pin": 27,
    "x": 14.447958,
    "y": -2.839974
  },
  {
    "pin": 31,
    "x": 17.048156000000002,
    "y": -2.839974
  },
  {
    "pin": 26,
    "x": 13.797972000000001,
    "y": -2.839974
  },
  {
    "pin": 28,
    "x": 15.098198,
    "y": -2.839974
  },
  {
    "pin": 36,
    "x": 15.423064,
    "y": -2.189988
  },
  {
    "pin": 30,
    "x": 16.39817,
    "y": -2.839974
  },
  {
    "pin": 34,
    "x": 14.123092,
    "y": -2.189988
  },
  {
    "pin": 37,
    "x": 16.073050000000002,
    "y": -2.189988
  },
  {
    "pin": 25,
    "x": 13.147986000000001,
    "y": -2.839974
  },
  {
    "pin": 29,
    "x": 15.748184,
    "y": -2.839974
  },
  {
    "pin": 35,
    "x": 14.773078000000002,
    "y": -2.189988
  },
  {
    "pin": 38,
    "x": 17.2351,
    "y": -1.949958
  },
  {
    "pin": 45,
    "x": 16.585114,
    "y": -0.974852
  }
]
const groundPins = ["GND3", "GND2", "GND1", "GND5", "GND4", "GND7",
  "GND6", "GND10", "GND9", "GND12", "GND8", "GND14", "GND13",
  "GND11", "EGP1", "EGP2", "EGP4", "EGP3", "XL1", "XL2", "ANT_GND2"]

export const AnnaRadio = () => (
  <>
    <ANNA_B112_00B name="U1" schSectionName="radio" schX={20} schY={0}
      pcbX={15.8} pcbY={0} pcbRotation={-90} />
    <trace name="radio_supply" from=".U1 > .VCC" to="net.V3V0" />
    {groundPins.map((pin) => (
      <Fragment key={pin}>
        <trace name={`radio_ground_${pin}`} from={`.U1 > .${pin}`} to="net.GND" />
      </Fragment>
    ))}
    {/* Internal antenna feed is a direct short bridge. ANT_PCB stays open.
        XL1/XL2 are grounded for the calibrated internal LFRC clock. */}
    <trace name="radio_antenna_feed" from=".U1 > .ANT" to=".U1 > .ANT_INT"
      thickness="0.35mm" pcbPath={[".U1 > .ANT", ".U1 > .ANT_INT"]} />
    <trace name="radio_antenna_return" from=".U1 > .ANT_GND1" to=".U1 > .ANT_GND2"
      thickness="0.35mm" pcbPath={[".U1 > .ANT_GND1",
        referencePoint(1.060012, -0.875), referencePoint(2.001844, -0.875),
        ".U1 > .ANT_GND2"]} />
    {/* Keep foreign traces and via pads away from unused GPIO lands. */}
    {unusedPads.map(({pin, x, y}) => (
      <Fragment key={pin}>
        <keepout shape="rect" pcbX={x} pcbY={y} width="0.55mm" height="0.55mm"
          layers={["top"]} excludeRefs={[".U1"]} />
      </Fragment>
    ))}
    {/* Align the 0.403 mm gap with the imported pad coordinate, including its
        0.000012 mm conversion offset, so it stays clear of the 0.35 mm strip. */}
    {/* Reference antenna voids, plus clearance extended to the circular edge.
        Only the imported module's own lands are exempt. */}
    <keepout shape="rect" pcbX={20.35} pcbY={2.05}
      width="4.37mm" height="3.8mm" layers={["top"]} excludeRefs={[".U1"]} />
    <keepout shape="rect" pcbX={17.61347} pcbY={0.35}
      width="0.403mm" height="7.2mm" layers={["top"]} excludeRefs={[".U1"]} />
    <keepout shape="rect" pcbX={20.043} pcbY={2.475}
      width="4.984mm" height="4.65mm" layers={["bottom"]} excludeRefs={[".U1"]} />
    <keepout shape="rect" pcbX={18.525} pcbY={14.4}
      width="11.95mm" height="20.2mm" layers={["top", "bottom"]} excludeRefs={[".U1"]} />
    {[3.55, 2.75, 1.95, 1.15, 0.35, -0.45].map((y, i) => (
      <Fragment key={i}>
        <via name={`RADIO_GND_${i}`} pcbX={22.935} pcbY={y}
          fromLayer="top" toLayer="bottom" connectsTo="net.GND"
          holeDiameter="0.3mm" outerDiameter="0.6mm" tented="both_sides" />
      </Fragment>
    ))}
  </>
)
