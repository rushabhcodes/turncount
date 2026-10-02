import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["EH2"],
  pin2: ["EH1"],
  pin3: ["EH4"],
  pin4: ["EH3"],
  pin5: ["B8","SBU2"],
  pin6: ["A5","CC1"],
  pin7: ["B7","DN2"],
  pin8: ["A6","DP1"],
  pin9: ["A7","DN1"],
  pin10: ["B6","DP2"],
  pin11: ["A8","SBU1"],
  pin12: ["B5","CC2"],
  pin13: ["A1B12","GND1"],
  pin14: ["B1A12","GND2"],
  pin15: ["B4A9","VBUS1"],
  pin16: ["A4B9","VBUS2"]
} as const

export const TYPE_C_31_M_12 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C165948"
  ]
}}
      manufacturerPartNumber="TYPE-C-31-M-12"
      footprint={<footprint insertionDirection="from_bottom">
        <hole pcbX="-2.899918mm" pcbY="0.9055672mm" diameter="0.5999988mm" />
<hole pcbX="2.899918mm" pcbY="0.9055672mm" diameter="0.5999988mm" />
{/* Explicit drill clearance obstacles for routing near the locating pins. */}
<keepout shape="circle" pcbX={-2.899918} pcbY={0.9055672} radius={0.65}
  layers={["top", "bottom"]} excludeRefs={[".J1"]} />
<keepout shape="circle" pcbX={2.899918} pcbY={0.9055672} radius={0.65}
  layers={["top", "bottom"]} excludeRefs={[".J1"]} />
<platedhole  portHints={["pin2"]} pcbX="4.325112mm" pcbY="-2.7741308mm" holeWidth="0.7999984mm" holeHeight="1.3999972mm" outerWidth="1.1999976mm" outerHeight="1.7999964mm" shape="pill" />
<platedhole  portHints={["pin1"]} pcbX="4.325112mm" pcbY="1.4056932mm" holeWidth="0.7999984mm" holeHeight="1.5999968mm" outerWidth="1.1999976mm" outerHeight="1.999996mm" shape="pill" />
<platedhole  portHints={["pin4"]} pcbX="-4.325112mm" pcbY="1.4056932mm" holeWidth="0.7999984mm" holeHeight="1.5999968mm" outerWidth="1.1999976mm" outerHeight="1.999996mm" shape="pill" />
<platedhole  portHints={["pin3"]} pcbX="-4.325112mm" pcbY="-2.7741308mm" holeWidth="0.7999984mm" holeHeight="1.3999972mm" outerWidth="1.1999976mm" outerHeight="1.7999964mm" shape="pill" />
<smtpad portHints={["pin5"]} pcbX="-1.75006mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-1.249934mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-0.750062mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-0.249936mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="0.249936mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="0.750062mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="1.24968mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="1.75006mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX={-3.1999555000} pcbY={2.1740432000} width={0.5999734000} height={1.3001752000} shape="rect" solderPasteMargin="-0.05mm" />
<smtpad portHints={["pin14"]} pcbX={3.2000063000} pcbY={2.1741448000} width={0.6000242000} height={1.2999720000} shape="rect" solderPasteMargin="-0.05mm" />
<smtpad portHints={["pin15"]} pcbX={2.4001603000} pcbY={2.1741448000} width={0.6000242000} height={1.2999720000} shape="rect" solderPasteMargin="-0.05mm" />
<smtpad portHints={["pin16"]} pcbX={-2.3999571000} pcbY={2.1739797000} width={0.5999734000} height={1.2999974000} shape="rect" solderPasteMargin="-0.05mm" />
{/* Polygon rectangles normalized within 0.0002 mm of the imported outline.
    Native rectangular pads generate 0.5 x 1.2 mm stencil apertures. */}
<silkscreenpath route={[{"x":-4.4689776000000165,"y":-1.6757585999999947},{"x":-4.4689776000000165,"y":0.18715359999987413}]} />
<silkscreenpath route={[{"x":4.471009600000116,"y":-5.394140800000059},{"x":-4.4689776000000165,"y":-5.394140800000059},{"x":-4.4689776000000165,"y":-3.91283820000001}]} />
<silkscreenpath route={[{"x":4.471009600000116,"y":-1.676114200000029},{"x":4.471009600000116,"y":0.18750920000002225}]} />
<silkscreenpath route={[{"x":4.471009600000116,"y":-5.394140800000059},{"x":4.471009600000116,"y":-3.912482600000203}]} />
<silkscreentext text="{NAME}" pcbX="0.002794mm" pcbY="3.8286012mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-5.174805999999876,"y":3.0786011999998664},{"x":5.180394000000092,"y":3.0786011999998664},{"x":5.180394000000092,"y":-5.650998800000025},{"x":-5.174805999999876,"y":-5.650998800000025},{"x":-5.174805999999876,"y":3.0786011999998664}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C165948.obj?uuid=617b05f9bba7410b96c001093d8189e4",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C165948.step?uuid=617b05f9bba7410b96c001093d8189e4",
        pcbRotationOffset: 180,
        modelOriginPosition: { x: 0, y: -2.7500289000000517, z: 0.000010999999999872223 },
      }}
      {...props}
    />
  )
}
