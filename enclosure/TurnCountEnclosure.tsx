import { assembly, jscad } from "tscircuit"
import { Base, Lid, UmbrellaKnob, MagnetRing, ContactFilm } from "./parts"

export function TurnCountEnclosure({ exploded = false }: { exploded?: boolean }) {
  const parts = [
    { name: "BASE", displayName: "MagSafe base with integrated PCB supports", geometry: <Base />, offset: -12 },
    { name: "LID", displayName: "Snap-in lid and shaft guide", geometry: <Lid />, offset: 12 },
    { name: "KNOB", displayName: "Full-depth rotating cover with integrated drive", geometry: <UmbrellaKnob />, offset: 28 },
    { name: "MAGNET_RING_REFERENCE", displayName: "Purchased MagSafe accessory ring (reference)", geometry: <MagnetRing />, offset: -18 },
    { name: "CONTACT_FILM_REFERENCE", displayName: "Soft phone contact film (reference)", geometry: <ContactFilm />, offset: -22 },
  ]
  return <>{parts.map(part => <assembly.printedpart key={part.name} name={part.name}
    displayName={part.displayName} jscad={
      <jscad.translate offset={[0, 0, exploded ? part.offset : 0]}>{part.geometry}</jscad.translate>
    } />)}</>
}
