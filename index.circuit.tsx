import { assembly } from "tscircuit"
import TurnCountBoard from "./TurnCountBoard"
import { TurnCountEnclosure } from "./enclosure/TurnCountEnclosure"

export default () => (
  <assembly.device name="TurnCount">
    <TurnCountBoard />
    <assembly.cadassembly name="Enclosure" displayName="Complete umbrella enclosure">
      <TurnCountEnclosure />
    </assembly.cadassembly>
  </assembly.device>
)
