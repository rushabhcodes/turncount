import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin6: ["pin6"],
  pin7: ["pin7"],
  pin8: ["pin8"],
  pin9: ["pin9"],
  pin10: ["pin10"],
  pin11: ["pin11"],
  pin12: ["A"],
  pin13: ["C"],
  pin14: ["B"],
  pin15: ["D"],
  pin16: ["E"]
} as const

export const EC11J1525402 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      symbol={
        <symbol>
          <schematicpath points={[{"x":-0.34,"y":-0.34},{"x":-0.28,"y":-0.34},{"x":-0.26,"y":-0.34},{"x":-0.26,"y":-0.26},{"x":0.26,"y":-0.26},{"x":0.26,"y":-0.34},{"x":0.34,"y":-0.34},{"x":0.34,"y":0.38},{"x":0.26,"y":0.38},{"x":0.26,"y":0.3},{"x":-0.26,"y":0.3},{"x":-0.26,"y":0.38},{"x":-0.34,"y":0.38},{"x":-0.34,"y":-0.34}]} strokeColor="#880000" />
          <schematiccircle center={{ x: 0, y: 0.02 }} radius={0.23} strokeWidth={0.02} color="#880000" />
          <schematicpath points={[{"x":-0.2,"y":-0.26},{"x":-0.2,"y":-0.4},{"x":-0.2,"y":-0.4}]} strokeColor="#880000" />
          <schematicpath points={[{"x":0,"y":-0.26},{"x":0,"y":-0.4}]} strokeColor="#880000" />
          <schematicpath points={[{"x":0.2,"y":-0.26},{"x":0.2,"y":-0.4}]} strokeColor="#880000" />
          <schematicpath points={[{"x":-0.2,"y":0.3},{"x":-0.2,"y":0.4}]} strokeColor="#880000" />
          <schematicpath points={[{"x":0.2,"y":0.3},{"x":0.2,"y":0.4}]} strokeColor="#880000" />
          <port name="pin12" pinNumber={12} aliases={["A"]} direction="down" schX={-0.2} schY={-0.6} schStemLength={0.2} />
          <port name="pin14" pinNumber={14} aliases={["B"]} direction="down" schX={0.2} schY={-0.6} schStemLength={0.2} />
          <port name="pin13" pinNumber={13} aliases={["C"]} direction="down" schX={0} schY={-0.6} schStemLength={0.2} />
          <port name="pin15" pinNumber={15} aliases={["D"]} direction="up" schX={-0.2} schY={0.6} schStemLength={0.2} />
          <port name="pin16" pinNumber={16} aliases={["E"]} direction="up" schX={0.2} schY={0.6} schStemLength={0.2} />
          <port name="pin6" pinNumber={6} aliases={["6"]} direction="up" schX={-0.34} schY={0.76} schStemLength={0.4} />
          <port name="pin7" pinNumber={7} aliases={["7"]} direction="down" schX={-0.34} schY={-0.74} schStemLength={0.4} />
          <port name="pin8" pinNumber={8} aliases={["8"]} direction="down" schX={0.34} schY={-0.74} schStemLength={0.4} />
          <port name="pin9" pinNumber={9} aliases={["9"]} direction="up" schX={0.34} schY={0.76} schStemLength={0.4} />
          <port name="pin10" pinNumber={10} aliases={["10"]} direction="left" schX={-0.74} schY={0} schStemLength={0.4} />
          <port name="pin11" pinNumber={11} aliases={["11"]} direction="right" schX={0.74} schY={0} schStemLength={0.4} />
        </symbol>
      }
      supplierPartNumbers={{
  "jlcpcb": [
    "C209762"
  ]
}}
      manufacturerPartNumber="EC11J1525402"
      footprint={<footprint>
        <hole pcbX="0mm" pcbY="0mm" diameter="2.1999956mm" />
<hole pcbX="0.026924mm" pcbY="-4.499991mm" diameter="1.5999968mm" />
<smtpad portHints={["pin12"]} pcbX="-2.54mm" pcbY="-7.29996mm" width="1.2999974mm" height="2.3999952mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="0mm" pcbY="-7.29996mm" width="1.2999974mm" height="2.3999952mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="2.54mm" pcbY="-7.29996mm" width="1.2999974mm" height="2.3999952mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="-2.54mm" pcbY="6.999986mm" width="1.2999974mm" height="2.3999952mm" shape="rect" />
<smtpad portHints={["pin16"]} pcbX="2.54mm" pcbY="6.999986mm" width="1.2999974mm" height="2.3999952mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-5.08mm" pcbY="7.899908mm" width="2.499995mm" height="3.1999936mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-5.08mm" pcbY="-7.899908mm" width="2.499995mm" height="3.1999936mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="5.334mm" pcbY="-7.899908mm" width="2.499995mm" height="3.1999936mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="5.08mm" pcbY="7.899908mm" width="2.499995mm" height="3.1999936mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="-6.400038mm" pcbY="0mm" width="3.7999924mm" height="3.999992mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="6.400038mm" pcbY="0mm" width="3.7999924mm" height="3.999992mm" shape="rect" />
<silkscreenpath route={[{"x":-5.851982200000066,"y":-2.2311359999998785},{"x":-5.851982200000066,"y":-6.068847399999868}]} />
<silkscreenpath route={[{"x":-5.851982200000066,"y":6.0688473999999815},{"x":-5.851982200000066,"y":2.2311359999999922}]} />
<silkscreenpath route={[{"x":5.846978400000012,"y":-2.2311359999998785},{"x":5.846978400000012,"y":-6.068847399999868}]} />
<silkscreenpath route={[{"x":5.871997399999941,"y":6.0688473999999815},{"x":5.871997399999941,"y":2.2311359999999922}]} />
<silkscreenpath route={[{"x":-3.4211259999999584,"y":-7.496987799999943},{"x":-3.5988498000001528,"y":-7.496987799999943}]} />
<silkscreenpath route={[{"x":-0.8813799999999219,"y":-7.496987799999943},{"x":-1.6588486000000557,"y":-7.496987799999943}]} />
<silkscreenpath route={[{"x":1.658619999999928,"y":-7.496987799999943},{"x":0.8813799999999219,"y":-7.496987799999943}]} />
<silkscreenpath route={[{"x":3.8528751999999713,"y":-7.496987799999943},{"x":3.4213799999998855,"y":-7.496987799999943}]} />
<silkscreenpath route={[{"x":3.4211513999998715,"y":7.472984800000063},{"x":3.598875199999952,"y":7.472984800000063}]} />
<silkscreenpath route={[{"x":-1.6588486000000557,"y":7.472984800000063},{"x":1.6588739999999689,"y":7.472984800000063}]} />
<silkscreenpath route={[{"x":-3.5988498000001528,"y":7.472984800000063},{"x":-3.4211259999999584,"y":7.472984800000063}]} />
<silkscreencircle pcbX="0mm" pcbY="0mm" radius="2.5180036mm" />
<silkscreencircle pcbX="0mm" pcbY="0mm" radius="3.1569914mm" />
<silkscreentext text="{NAME}" pcbX="0mm" pcbY="10.4996mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-8.55580000000009,"y":9.749599999999987},{"x":8.55580000000009,"y":9.749599999999987},{"x":8.55580000000009,"y":-9.749599999999873},{"x":-8.55580000000009,"y":-9.749599999999873},{"x":-8.55580000000009,"y":9.749599999999987}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C209762.obj?uuid=dd41107f0caf4aba9dfb10d8b1eb67f1",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C209762.step?uuid=dd41107f0caf4aba9dfb10d8b1eb67f1",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: -0.0000024000000000690136 },
      }}
      {...props}
    />
  )
}