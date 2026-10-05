import { MY_2032_16 } from "../imports/MY_2032_16"

export const CoinCellPower = () => (
  <>
    <MY_2032_16 name="BT1" schX={-2} schY={0}
      pcbX={-9.5} pcbY={0} pcbRotation={90} layer="bottom" />
    <schematictext schX={0} schY={2.5} fontSize={0.24}
      anchor="center" color="#334155" text="CR2032 coin cell · 3 V nominal" />
    <capacitor name="C7" capacitance="4.7uF" footprint="0603"
      schX={2} schY={0} schRotation={-90} pcbX={-6} pcbY={12} />
    <trace from="BT1.pin1" to="net.VBAT" />
    <trace from="BT1.pin2" to="net.VBAT" />
    <trace from="BT1.pin3" to="net.GND" />
    <trace from="C7.pin1" to="net.VBAT" />
    <trace from="C7.pin2" to="net.GND" />
  </>
)
