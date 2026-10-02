import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["A"],
  pin4: ["COM"],
  pin5: ["B"],
  pin6: ["E"],
  pin7: ["D"]
} as const

export const GT_EVA01AA_L1 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      symbol={
        <symbol>
          <schematicrect schX={0} schY={0} width={1} height={0.8} strokeWidth={0.02} color="#880000" />
          <schematicpath points={[{"x":0.2,"y":0.2},{"x":0.06,"y":0.2}]} strokeColor="#880000" />
          <schematicpath points={[{"x":-0.12,"y":0.2},{"x":-0.06,"y":0.2}]} strokeColor="#880000" />
          <schematicpath points={[{"x":-0.08,"y":0.3},{"x":0.06,"y":0.22}]} strokeColor="#880000" />
          <schematiccircle center={{ x: 0.06, y: 0.2 }} radius={0.02} strokeWidth={0.02} color="#880000" />
          <schematiccircle center={{ x: -0.06, y: 0.2 }} radius={0.02} strokeWidth={0.02} color="#880000" />
          <schematicpath points={[{"x":-0.2,"y":0.2},{"x":-0.12,"y":0.2}]} strokeColor="#880000" />
          <port name="pin5" pinNumber={5} aliases={["B"]} direction="down" schX={0.3} schY={-0.7} schStemLength={0.3} />
          <port name="pin4" pinNumber={4} aliases={["COM"]} direction="down" schX={0} schY={-0.7} schStemLength={0.3} />
          <port name="pin3" pinNumber={3} aliases={["A"]} direction="down" schX={-0.3} schY={-0.7} schStemLength={0.3} />
          <port name="pin7" pinNumber={7} aliases={["D"]} direction="up" schX={0.2} schY={0.7} schStemLength={0.3} />
          <port name="pin6" pinNumber={6} aliases={["E"]} direction="up" schX={-0.2} schY={0.7} schStemLength={0.3} />
          <port name="pin1" pinNumber={1} aliases={["1"]} direction="left" schX={-0.8} schY={0.2} schStemLength={0.3} />
          <port name="pin2" pinNumber={2} aliases={["2"]} direction="right" schX={0.8} schY={0.2} schStemLength={0.3} />
          <schematicpath points={[{"x":-0.2,"y":0.4},{"x":-0.2,"y":0.2}]} strokeColor="#880000" />
          <schematicpath points={[{"x":0.2,"y":0.2},{"x":0.2,"y":0.4}]} strokeColor="#880000" />
        </symbol>
      }
      supplierPartNumbers={{
  "jlcpcb": [
    "C17702124"
  ]
}}
      manufacturerPartNumber="GT-EVA01AA-L1"
      footprint={<footprint>
        <hole pcbX="-1.499997mm" pcbY="-0.327406mm" diameter="0.5999988mm" />
<hole pcbX="1.499997mm" pcbY="-0.327406mm" diameter="0.5999988mm" />
<smtpad portHints={["pin3"]} pcbX="-1.499997mm" pcbY="-1.927606mm" width="0.7999984mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="0.000127mm" pcbY="-1.927606mm" width="0.7999984mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="1.499997mm" pcbY="-1.927606mm" width="0.7999984mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-0.749935mm" pcbY="-0.927608mm" width="0.499999mm" height="0.7999984mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="0.749935mm" pcbY="-0.927608mm" width="0.499999mm" height="0.7999984mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-2.600071mm" pcbY="1.7526mm" width="0.7999984mm" height="0.9500108mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="2.600071mm" pcbY="1.7526mm" width="0.7999984mm" height="0.9500108mm" shape="rect" />
<silkscreenpath route={[{"x":-2.399995199999921,"y":2.4586691999999175},{"x":-2.399995199999921,"y":2.7515057999999044}]} />
<silkscreenpath route={[{"x":-1.231112600000074,"y":-1.077493400000094},{"x":-2.399995199999921,"y":-1.077493400000094},{"x":-2.399995199999921,"y":1.0463783999999805}]} />
<silkscreenpath route={[{"x":0.2688843999999335,"y":-1.077493400000094},{"x":-0.26883360000010725,"y":-1.077493400000094}]} />
<silkscreenpath route={[{"x":2.399995200000035,"y":1.0463783999999805},{"x":2.399995200000035,"y":-1.077493400000094},{"x":1.2311633999999003,"y":-1.077493400000094}]} />
<silkscreenpath route={[{"x":-2.399995199999921,"y":2.8224987999999485},{"x":2.399995200000035,"y":2.8224987999999485},{"x":2.399995200000035,"y":2.4586691999999175}]} />
<silkscreentext text="{NAME}" pcbX="-0.014097mm" pcbY="3.853944mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-3.273997000000122,"y":3.103943999999956},{"x":3.24580299999991,"y":3.103943999999956},{"x":3.24580299999991,"y":-2.4760559999999714},{"x":-3.273997000000122,"y":-2.4760559999999714},{"x":-3.273997000000122,"y":3.103943999999956}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C17702124.obj?uuid=5fb4678cbdf9436282bd206245846ff7",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C17702124.step?uuid=5fb4678cbdf9436282bd206245846ff7",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: -0.8865244999999505, z: 0.000011799999999950739 },
      }}
      {...props}
    />
  )
}