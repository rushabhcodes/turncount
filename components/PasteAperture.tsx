// The pinned core generates paste for rectangular pads, but not pill/polygon
// pads, and does not register a standalone <solderpaste> element. A rectangle
// wholly inside an existing pad, assigned to the same port, adds no copper
// outside that pad. Its zero paste margin emits the intended stencil opening
// through tscircuit's native footprint rendering and manufacturing exporter.
export const PasteAperture = ({ x, y, width, height, pin }: {
  x: number; y: number; width: number; height: number; pin: string
}) => (
  <smtpad shape="rect" pcbX={x} pcbY={y} width={width} height={height}
    portHints={[pin]} solderPasteMargin={0} />
)
