import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["BAT_POS"],
  pin2: ["BAT_NEG"],
  pin3: ["NTC"],
  pin4: ["ANCHOR_R"],
  pin5: ["ANCHOR_L"]
} as const

export const S3B_PH_SM4_TB_LF__SN_ = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C265101"
  ]
}}
      manufacturerPartNumber="S3B-PH-SM4-TB(LF)(SN)"
      footprint={<footprint insertionDirection="from_top">
        <smtpad portHints={["pin1"]} pcbX="2.000123mm" pcbY="-2.74995005mm" width="0.999998mm" height="3.499993mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="0.000127mm" pcbY="-2.74995005mm" width="0.999998mm" height="3.499993mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-1.999869mm" pcbY="-2.74995005mm" width="0.999998mm" height="3.499993mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="4.425061mm" pcbY="2.79994995mm" width="1.499997mm" height="3.3999932mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-4.425061mm" pcbY="2.79994995mm" width="1.499997mm" height="3.3999932mm" shape="rect" />
<silkscreenpath route={[{"x":-2.8061919999998963,"y":-1.7530000499999687},{"x":-4.0639999999999645,"y":-1.7530000499999687},{"x":-4.0639999999999645,"y":-3.2770000499999696},{"x":-4.952999999999861,"y":-3.2770000499999696},{"x":-4.952999999999861,"y":0.8688895500000626}]} />
<silkscreenpath route={[{"x":-0.8061959999998862,"y":-1.7530000499999687},{"x":-1.343913999999927,"y":-1.7530000499999687}]} />
<silkscreenpath route={[{"x":1.1938000000001239,"y":-1.7530000499999687},{"x":0.6560819999999694,"y":-1.7530000499999687}]} />
<silkscreenpath route={[{"x":4.953000000000088,"y":0.8688895500000626},{"x":4.953000000000088,"y":-3.2770000499999696},{"x":4.191000000000145,"y":-3.2770000499999696},{"x":4.064000000000078,"y":-3.2770000499999696},{"x":4.064000000000078,"y":-1.7530000499999687},{"x":2.656078000000093,"y":-1.7530000499999687}]} />
<silkscreenpath route={[{"x":-3.504056999999989,"y":4.362049950000028},{"x":3.4809430000000248,"y":4.362049950000028}]} />
<silkscreentext text="{NAME}" pcbX="-0.011557mm" pcbY="5.51444995mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-5.430456999999819,"y":4.764449949999857},{"x":5.407343000000083,"y":4.764449949999857},{"x":5.407343000000083,"y":-4.7779500499999585},{"x":-5.430456999999819,"y":-4.7779500499999585},{"x":-5.430456999999819,"y":4.764449949999857}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C265101.obj?uuid=5cd8c3a4ea954c56a35bebd156a3dd64",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C265101.step?uuid=5cd8c3a4ea954c56a35bebd156a3dd64",
        pcbRotationOffset: 180,
        modelOriginPosition: { x: -2.00005079999994, y: 2.8750317499999483, z: 0 },
      }}
      {...props}
    />
  )
}