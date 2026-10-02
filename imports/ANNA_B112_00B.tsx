import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["ANT_PCB"],
  pin2: ["ANT_GND1"],
  pin3: ["ANT_GND2"],
  pin4: ["GND3"],
  pin5: ["ANT_INT"],
  pin6: ["ANT"],
  pin7: ["GND2"],
  pin8: ["GND1"],
  pin9: ["VCC"],
  pin10: ["GND5"],
  pin11: ["GND4"],
  pin12: ["RESET_N"],
  pin13: ["GPIO_13"],
  pin14: ["GPIO_14"],
  pin15: ["GPIO_15"],
  pin16: ["pin16"],
  pin17: ["XL1"],
  pin18: ["XL2"],
  pin19: ["GPIO_19"],
  pin20: ["GPIO_20"],
  pin21: ["pin21"],
  pin22: ["pin22"],
  pin23: ["GPIO_23"],
  pin24: ["GPIO_24"],
  pin25: ["GPIO_25"],
  pin26: ["GPIO_26"],
  pin27: ["GPIO_27"],
  pin28: ["GPIO_28"],
  pin29: ["GPIO_29"],
  pin30: ["GPIO_30"],
  pin31: ["GPIO_31"],
  pin32: ["GND7"],
  pin33: ["GND6"],
  pin34: ["GPIO_34"],
  pin35: ["GPIO_35"],
  pin36: ["GPIO_36"],
  pin37: ["GPIO_37"],
  pin38: ["GPIO_38"],
  pin39: ["SWDCLK"],
  pin40: ["SWDIO"],
  pin41: ["GND10"],
  pin42: ["GND9"],
  pin43: ["GND12"],
  pin44: ["GND8"],
  pin45: ["GPIO_45"],
  pin46: ["GND14"],
  pin47: ["GND13"],
  pin48: ["GND11"],
  pin49: ["EGP1"],
  pin50: ["EGP2"],
  pin51: ["EGP4"],
  pin52: ["EGP3"]
} as const

const pinAttributes = {
  pin4: {requiresGround: true},
  pin7: {requiresGround: true},
  pin8: {requiresGround: true},
  pin9: {requiresPower: true},
  pin10: {requiresGround: true},
  pin11: {requiresGround: true},
  pin32: {requiresGround: true},
  pin33: {requiresGround: true},
  pin41: {requiresGround: true},
  pin42: {requiresGround: true},
  pin43: {requiresGround: true},
  pin44: {requiresGround: true},
  pin46: {requiresGround: true},
  pin47: {requiresGround: true},
  pin48: {requiresGround: true}
} as const

export const ANNA_B112_00B = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C2931350"
  ]
}}
      manufacturerPartNumber="ANNA-B112-00B"
      footprint={<footprint>
        <smtpad portHints={["pin9"]} pcbX="-2.839974mm" pcbY="-2.652014mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-2.839974mm" pcbY="2.839974mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-2.839974mm" pcbY="-2.002028mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-2.839974mm" pcbY="-1.352042mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-2.839974mm" pcbY="-0.701802mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-2.839974mm" pcbY="-0.051816mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-2.839974mm" pcbY="0.59817mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-2.839974mm" pcbY="1.248156mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-2.839974mm" pcbY="2.189988mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="-2.189988mm" pcbY="-1.676908mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="-2.189988mm" pcbY="-1.026922mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="-2.189988mm" pcbY="-0.376936mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="-2.189988mm" pcbY="0.27305mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="-1.949958mm" pcbY="-2.839974mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="-1.299972mm" pcbY="-2.839974mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin16"]} pcbX="-0.649986mm" pcbY="-2.839974mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin17"]} pcbX="0mm" pcbY="-2.839974mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin18"]} pcbX="0.649986mm" pcbY="-2.839974mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin19"]} pcbX="1.299972mm" pcbY="-2.839974mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin20"]} pcbX="1.949958mm" pcbY="-2.839974mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin21"]} pcbX="-0.975106mm" pcbY="-2.189988mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin22"]} pcbX="-0.32512mm" pcbY="-2.189988mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin23"]} pcbX="0.324866mm" pcbY="-2.189988mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin24"]} pcbX="0.974852mm" pcbY="-2.189988mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin27"]} pcbX="2.839974mm" pcbY="-1.352042mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin31"]} pcbX="2.839974mm" pcbY="1.248156mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin26"]} pcbX="2.839974mm" pcbY="-2.002028mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin28"]} pcbX="2.839974mm" pcbY="-0.701802mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin36"]} pcbX="2.189988mm" pcbY="-0.376936mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin30"]} pcbX="2.839974mm" pcbY="0.59817mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin33"]} pcbX="2.839974mm" pcbY="2.839974mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin34"]} pcbX="2.189988mm" pcbY="-1.676908mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin37"]} pcbX="2.189988mm" pcbY="0.27305mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin25"]} pcbX="2.839974mm" pcbY="-2.652014mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin29"]} pcbX="2.839974mm" pcbY="-0.051816mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin35"]} pcbX="2.189988mm" pcbY="-1.026922mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin32"]} pcbX="2.839974mm" pcbY="2.189988mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin44"]} pcbX="-1.949958mm" pcbY="1.4351mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin38"]} pcbX="1.949958mm" pcbY="1.4351mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin42"]} pcbX="-0.649986mm" pcbY="1.4351mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin41"]} pcbX="0mm" pcbY="1.4351mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin48"]} pcbX="-0.975106mm" pcbY="0.785114mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin40"]} pcbX="0.649986mm" pcbY="1.4351mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin45"]} pcbX="0.974852mm" pcbY="0.785114mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin43"]} pcbX="-1.299972mm" pcbY="1.4351mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin47"]} pcbX="-0.32512mm" pcbY="0.785114mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin46"]} pcbX="0.324866mm" pcbY="0.785114mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin39"]} pcbX="1.299972mm" pcbY="1.4351mm" width="0.350012mm" height="0.350012mm" shape="rect" />
<smtpad portHints={["pin49"]} pcbX="-0.520192mm" pcbY="-0.251968mm" width="0.420116mm" height="0.420116mm" shape="rect" />
<smtpad portHints={["pin50"]} pcbX="-0.520192mm" pcbY="-1.15189mm" width="0.420116mm" height="0.420116mm" shape="rect" />
<smtpad portHints={["pin52"]} pcbX="0.519938mm" pcbY="-0.251968mm" width="0.420116mm" height="0.420116mm" shape="rect" />
<smtpad portHints={["pin51"]} pcbX="0.519938mm" pcbY="-1.15189mm" width="0.420116mm" height="0.420116mm" shape="rect" />
<silkscreenpath route={[{"x":-3.25018399999999,"y":3.250184000000104},{"x":3.2499299999999494,"y":3.250184000000104},{"x":3.2499299999999494,"y":-3.2499299999999494},{"x":-3.25018399999999,"y":-3.2499299999999494},{"x":-3.25018399999999,"y":3.250184000000104}]} />
<silkscreencircle pcbX="-3.626612mm" pcbY="2.824734mm" radius="0.128524mm" />
<silkscreentext text="{NAME}" pcbX="-0.242062mm" pcbY="4.26771mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-3.9972620000000916,"y":3.517710000000193},{"x":3.513137999999799,"y":3.517710000000193},{"x":3.513137999999799,"y":-3.5100899999998774},{"x":-3.9972620000000916,"y":-3.5100899999998774},{"x":-3.9972620000000916,"y":3.517710000000193}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2931350.obj?uuid=8ddc51b0f1bb48fa972a914c079a2d4a",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2931350.step?uuid=8ddc51b0f1bb48fa972a914c079a2d4a",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012699999842880061, y: 0.000012699999842880061, z: -0.25 },
      }}
      {...props}
    />
  )
}
