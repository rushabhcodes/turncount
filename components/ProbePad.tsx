import type { TestpointProps } from "@tscircuit/props"

// Bare probe lands remain exposed but receive no solder paste or assembly part.
export const ProbePad = (props: TestpointProps) => (
  <testpoint {...props} doNotPlace footprintVariant="pad" padDiameter="1mm"
    footprint={<footprint>
      <smtpad shape="circle" radius="0.5mm" portHints={["pin1"]}
        solderPasteMargin="-0.5mm" />
    </footprint>} />
)
