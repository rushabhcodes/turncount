import { assembly } from "@tscircuit/core"

const boardCenter = 8.4 + 1.6 / 2
const zFromBoard = (z: number) => z - boardCenter

export const EnclosureAssembly = () => {
  const browser = typeof location !== "undefined"
  const model = (name: string) => browser
    ? `/api/files/static/mechanical/output/${name}_assembly.stl`
    : `./mechanical/output/${name}_assembly.stl`
  return (
    <assembly.cadassembly name="turncount_enclosure" displayName="TurnCount printed enclosure">
      <cadmodel modelUrl={model("01_lower_tray")} pcbZ={zFromBoard(11.5 / 2)} />
      <cadmodel modelUrl={model("02_upper_cover")} pcbZ={zFromBoard((11.5 + 18.8) / 2)} />
      <cadmodel modelUrl={model("03_rotating_cap")} pcbZ={zFromBoard((15.1 + 28.0) / 2)} />
      <cadmodel modelUrl={model("04_phone_grip_TPU")} pcbZ={zFromBoard(-0.65 / 2)} />
    </assembly.cadassembly>
  )
}
