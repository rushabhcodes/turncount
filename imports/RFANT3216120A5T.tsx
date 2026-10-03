import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["FEED"],
  pin2: ["NC"]
} as const

const pinAttributes = {
  pin1: { mustBeConnected: true },
  pin2: { doNotConnect: true },
} as const

export const RFANT3216120A5T = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C127629"
  ]
}}
      manufacturerPartNumber="RFANT3216120A5T"
      footprint={<footprint>
        <smtpad portHints={["pin2"]} pcbX="1.57607mm" pcbY="-0mm" width="0.7999984mm" height="1.6599916mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-1.524mm" pcbY="-0mm" width="0.7999984mm" height="1.6599916mm" shape="rect" />
<silkscreenrect pcbX="-0.418592mm" pcbY="0mm" width="0.127mm" height="2.032mm" strokeWidth="0.254mm" />
<silkscreenrect pcbX="-0.722884mm" pcbY="0.0635mm" width="0.228092mm" height="1.905mm" strokeWidth="0.254mm" />
<silkscreenrect pcbX="0mm" pcbY="0mm" width="4.318mm" height="2.032mm" strokeWidth="0.254mm" />
<silkscreentext text="{NAME}" pcbX="0.00127mm" pcbY="2.016mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-2.4077299999999013,"y":1.265999999999849},{"x":2.4102700000000823,"y":1.265999999999849},{"x":2.4102700000000823,"y":-1.2660000000000764},{"x":-2.4077299999999013,"y":-1.2660000000000764},{"x":-2.4077299999999013,"y":1.265999999999849}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C127629.obj?uuid=ad99fc1789904603aa1325d0ded16988",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C127629.step?uuid=ad99fc1789904603aa1325d0ded16988",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: -0.026035000000092623, y: 0, z: -0.6 },
      }}
      {...props}
    />
  )
}
