import type { ChipProps } from "@tscircuit/props"

// GPIO/reset aliases below complete the JLCPCB import using Raytac's pin assignment.
const pinLabels = {
  pin1: ["GND1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"],
  pin5: ["pin5"],
  pin6: ["pin6"],
  pin7: ["pin7"],
  pin8: ["pin8"],
  pin9: ["DEC4"],
  pin10: ["DCC"],
  pin11: ["VDD"],
  pin12: ["GND12"],
  pin13: ["pin13"],
  pin14: ["pin14"],
  pin15: ["pin15"],
  pin16: ["pin16"],
  pin17: ["pin17"],
  pin18: ["pin18"],
  pin19: ["pin19"],
  pin20: ["pin20"],
  pin21: ["pin21"],
  pin22: ["pin22"],
  pin23: ["pin23"],
  pin24: ["GND24"],
  pin25: ["P0_11"],
  pin26: ["P0_12"],
  pin27: ["P0_13"],
  pin28: ["P0_14"],
  pin29: ["pin29"],
  pin30: ["pin30"],
  pin31: ["pin31"],
  pin32: ["pin32"],
  pin33: ["pin33"],
  pin34: ["pin34"],
  pin35: ["RESET"],
  pin36: ["SWDCLK"],
  pin37: ["SWDIO"],
  pin38: ["pin38"],
  pin39: ["GND39"],
  pin40: ["pin40"],
  pin41: ["pin41"]
} as const

const pinAttributes = {
  pin1: {requiresGround: true},
  pin11: {requiresPower: true},
  pin12: {requiresGround: true},
  pin24: {requiresGround: true},
  pin39: {requiresGround: true},
  pin36: {mustBeConnected: true},
  pin37: {mustBeConnected: true}
} as const

export const MDBT42Q_512KV2 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C2828282"
  ]
}}
      manufacturerPartNumber="MDBT42Q-512KV2"
      footprint={<footprint>
        <smtpad portHints={["pin11"]} pcbX="-4.59994mm" pcbY="-3.4512123mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="-4.59994mm" pcbY="-2.7511883mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="-4.59994mm" pcbY="-2.0511643mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-4.59994mm" pcbY="-1.3511403mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-4.59994mm" pcbY="-0.6511163mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-4.59994mm" pcbY="5.8489977mm" width="1.3999972mm" height="0.7999984mm" shape="rect" />
<smtpad portHints={["pin39"]} pcbX="4.59994mm" pcbY="5.8489977mm" width="1.3999972mm" height="0.7999984mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-4.59994mm" pcbY="0.0489077mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-4.59994mm" pcbY="0.7489317mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-4.59994mm" pcbY="1.4489557mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-4.59994mm" pcbY="2.1489797mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-4.59994mm" pcbY="2.8490037mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin25"]} pcbX="4.59994mm" pcbY="-4.1509823mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin26"]} pcbX="4.59994mm" pcbY="-3.4512123mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin27"]} pcbX="4.59994mm" pcbY="-2.7511883mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin28"]} pcbX="4.59994mm" pcbY="-2.0511643mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin29"]} pcbX="4.59994mm" pcbY="-1.3511403mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin30"]} pcbX="4.59994mm" pcbY="-0.6511163mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin38"]} pcbX="4.59994mm" pcbY="4.9488217mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin32"]} pcbX="4.59994mm" pcbY="0.7489317mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin33"]} pcbX="4.59994mm" pcbY="1.4489557mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin34"]} pcbX="4.59994mm" pcbY="2.1489797mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin35"]} pcbX="4.59994mm" pcbY="2.8490037mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin36"]} pcbX="4.59994mm" pcbY="3.5490277mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin31"]} pcbX="4.59994mm" pcbY="0.0489077mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin37"]} pcbX="4.59994mm" pcbY="4.2490517mm" width="1.3999972mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="-4.19989mm" pcbY="-5.5489983mm" width="0.3999992mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin18"]} pcbX="-0mm" pcbY="-5.5489983mm" width="0.3999992mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="-3.499866mm" pcbY="-5.5489983mm" width="0.3999992mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="-2.800096mm" pcbY="-5.5489983mm" width="0.3999992mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="-2.100072mm" pcbY="-5.5489983mm" width="0.3999992mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin16"]} pcbX="-1.400048mm" pcbY="-5.5489983mm" width="0.3999992mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin17"]} pcbX="-0.700024mm" pcbY="-5.5489983mm" width="0.3999992mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin19"]} pcbX="0.700024mm" pcbY="-5.5489983mm" width="0.3999992mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin20"]} pcbX="1.400048mm" pcbY="-5.5489983mm" width="0.3999992mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin21"]} pcbX="2.100072mm" pcbY="-5.5489983mm" width="0.3999992mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin22"]} pcbX="2.800096mm" pcbY="-5.5489983mm" width="0.3999992mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin23"]} pcbX="3.50012mm" pcbY="-5.5489983mm" width="0.3999992mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin24"]} pcbX="4.200144mm" pcbY="-5.5489983mm" width="0.3999992mm" height="1.3999972mm" shape="rect" />
<smtpad portHints={["pin41"]} pcbX="2.899918mm" pcbY="3.8987857mm" width="0.999998mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin40"]} pcbX="2.899918mm" pcbY="5.2988337mm" width="0.999998mm" height="0.3999992mm" shape="rect" />
<silkscreenpath route={[{"x":-3.6499800000000278,"y":6.299974699999893},{"x":3.650005399999941,"y":6.299974699999893}]} />
<silkscreenpath route={[{"x":-0.4999735999999757,"y":6.248895299999731},{"x":-0.4999990000000025,"y":3.0999810999999227},{"x":3.4500057999999854,"y":3.0999810999999227}]} />
<silkscreenpath route={[{"x":-5.149976999999922,"y":5.21778229999984},{"x":-5.149976999999922,"y":3.298888499999748}]} />
<silkscreenpath route={[{"x":-4.699990600000092,"y":-6.101092700000095},{"x":-5.099989800000117,"y":-6.101092700000095},{"x":-5.099989800000117,"y":-4.001096900000221}]} />
<silkscreenpath route={[{"x":5.099989799999889,"y":-4.601095700000087},{"x":5.099989799999889,"y":-6.051080100000263},{"x":4.5999908000000005,"y":-6.051080100000263}]} />
<silkscreenpath route={[{"x":-5.099989800000117,"y":6.498882099999946},{"x":-5.099989800000117,"y":10.19887469999992},{"x":5.099989799999889,"y":10.19887469999992},{"x":5.099989799999889,"y":6.498882099999946}]} />
<silkscreentext text="{NAME}" pcbX="-0.14859mm" pcbY="11.2033197mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-5.834190000000035,"y":10.453319699999838},{"x":5.537009999999896,"y":10.453319699999838},{"x":5.537009999999896,"y":-6.505880300000172},{"x":-5.834190000000035,"y":-6.505880300000172},{"x":-5.834190000000035,"y":10.453319699999838}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2828282.obj?uuid=1924495ba01a447a81f0a6287fe78f7e",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2828282.step?uuid=1924495ba01a447a81f0a6287fe78f7e",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: -2.0550085999999554, z: -0.01 },
      }}
      {...props}
    />
  )
}
