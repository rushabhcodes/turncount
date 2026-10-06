import { jscad } from "tscircuit"
import { dimensions as d, supportAngles, latchAngles } from "./dimensions"

function Cylinder({ radius, bottom, top, x = 0, y = 0 }: {
  radius: number; bottom: number; top: number; x?: number; y?: number
}) {
  const points: [number, number][] = Array.from({ length: 128 }, (_, i) => [
    radius * Math.cos(i * Math.PI / 64), radius * Math.sin(i * Math.PI / 64),
  ])
  return <jscad.translate offset={[x, y, bottom]}>
    <jscad.extrudeLinear height={top - bottom}><jscad.polygon points={points} /></jscad.extrudeLinear>
  </jscad.translate>
}
function Ring({ outer, inner, bottom, top }: {
  outer: number; inner: number; bottom: number; top: number
}) {
  return <jscad.subtract>
    <Cylinder radius={outer} bottom={bottom} top={top} />
    <Cylinder radius={inner} bottom={bottom - 0.1} top={top + 0.1} />
  </jscad.subtract>
}

export function Base() {
  return <jscad.colorize color="#344252"><jscad.union>
    <jscad.subtract>
      <Cylinder radius={d.baseRadius} bottom={d.baseBottom} top={d.baseTop} />
      <Cylinder radius={d.cavityRadius} bottom={d.floorTop} top={d.baseTop + 0.1} />
      <Ring outer={25.15} inner={24.7} bottom={2.15} top={2.95} />
      <Ring outer={d.magnetPocketOuterDiameter / 2} inner={d.magnetPocketInnerDiameter / 2}
        bottom={d.baseBottom - 0.1} top={d.baseBottom + d.magnetPocketDepth} />
    </jscad.subtract>
    <Ring outer={d.baseBeadRadius} inner={28.4} bottom={-7.6} top={-7.1} />
    {supportAngles.map(angle => <jscad.rotate key={angle} angles={[0, 0, angle * Math.PI / 180]}>
      <jscad.union>
        <jscad.cuboid size={[2.6, 4, 4.7]} center={[24, 0, -3.15]} />
        <jscad.cuboid size={[0.6, 4, 1.9]} center={[24.5, 0, 0.05]} />
      </jscad.union>
    </jscad.rotate>)}
  </jscad.union></jscad.colorize>
}

export function Lid() {
  return <jscad.colorize color="#506176"><jscad.subtract>
    <jscad.union>
      <Cylinder radius={28.4} bottom={d.baseTop} top={d.lidTop} />
      <Cylinder radius={4.2} bottom={d.baseTop} top={8.3} />
      <Ring outer={24.55} inner={23.95} bottom={1.8} top={d.baseTop + 0.05} />
      {supportAngles.map(angle => <jscad.rotate key={angle} angles={[0, 0, angle * Math.PI / 180]}>
        <jscad.cuboid size={[1.5, 3, 3.85]} center={[23.5, 0, 2.925]} />
      </jscad.rotate>)}
      {latchAngles.map(angle => <jscad.rotate key={angle} angles={[0, 0, angle * Math.PI / 180]}>
        <jscad.hull>
          <jscad.cuboid size={[0.4, 3, 0.1]} center={[24.3, 0, 1.95]} />
          <jscad.cuboid size={[0.9, 3, 0.5]} center={[24.45, 0, 2.5]} />
        </jscad.hull>
      </jscad.rotate>)}
    </jscad.union>
    <Cylinder radius={d.bearingBoreRadius} bottom={1.7} top={8.4} />
    {latchAngles.flatMap(angle => [-2, 2].map(y => <jscad.rotate key={`${angle}-${y}`} angles={[0, 0, angle * Math.PI / 180]}>
      <jscad.cuboid size={[4, 0.6, 2.6]} center={[24.5, y, 3]} />
    </jscad.rotate>))}
    {latchAngles.map(angle => <Cylinder key={angle} radius={1.1}
      x={28.4 * Math.cos(angle * Math.PI / 180)} y={28.4 * Math.sin(angle * Math.PI / 180)}
      bottom={4.7} top={6.7} />)}
  </jscad.subtract></jscad.colorize>
}

export function UmbrellaKnob() {
  return <jscad.colorize color="#edb66e"><jscad.subtract>
    <jscad.union>
      <jscad.hull>
        <Cylinder radius={d.canopyRadius} bottom={d.canopyBottom} top={d.canopyBottom + 0.1} />
        <Cylinder radius={26} bottom={d.canopyTop - 0.1} top={d.canopyTop} />
      </jscad.hull>
      <Ring outer={d.canopyRadius} inner={d.skirtInnerRadius} bottom={d.skirtBottom} top={d.canopyBottom + 0.1} />
      <Ring outer={d.canopyRadius} inner={d.retentionLipRadius} bottom={d.skirtBottom} top={-7.85} />
      <Cylinder radius={d.bearingRadius} bottom={4.6} top={9.2} />
      <jscad.cuboid size={[d.squareDrive, d.squareDrive, 1.1]} center={[0, 0, d.driveBottom + 0.55]} />
    </jscad.union>
    {Array.from({ length: 12 }, (_, i) => <jscad.rotate key={i} angles={[0, 0, i * Math.PI / 6]}>
      <jscad.cuboid size={[3, 0.65, 4.6]} center={[29.5, 0, -6.25]} />
    </jscad.rotate>)}
    <Cylinder radius={0.65} x={19} bottom={10.9} top={11.5} />
  </jscad.subtract></jscad.colorize>
}

// Purchased accessory magnet ring and soft contact film, shown as references.
export function MagnetRing() {
  return <jscad.colorize color="#aeb6c0"><Ring outer={d.magnetOuterDiameter / 2}
    inner={d.magnetInnerDiameter / 2} bottom={d.baseBottom + 0.075}
    top={d.baseBottom + 0.075 + d.magnetThickness} /></jscad.colorize>
}
export function ContactFilm() {
  return <jscad.colorize color="#1f252d"><Cylinder radius={28.4}
    bottom={d.baseBottom - d.contactFilmThickness} top={d.baseBottom} /></jscad.colorize>
}
