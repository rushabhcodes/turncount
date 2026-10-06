# TurnCount full-depth dial enclosure

Three printed parts: **base**, **lid**, and **knob**. The 60 mm rotating knob covers the entire PCB and extends down around the 57 mm fixed base, almost to its bottom. Overall height including the phone contact film is 20.7 mm. PCB supports, the encoder drive, and retention snaps are integrated; there are no assembly screws or separate shaft inserts.

## Files and printing

- `output/base.stl`: base with PCB ledges, magnet pocket, and knob retention bead.
- `output/lid.stl`: snap-in lid with PCB clamp fingers and central shaft guide.
- `output/knob.stl`: full-depth rotating cover with integrated square encoder tip.
- `output/tip-fit-*.stl`: optional small test coupons, not assembly parts.
- `output/preview.html`: offline interactive assembly, exploded, and underside views.
- `output/turncount-assembled.glb` and `turncount-exploded.glb`: native tscircuit assembly models.

STLs use millimetres and are positioned on the print bed. Print the base upright. The lid is exported guide side down; support its flat face around the guide. The knob is exported top down, with its skirt and integrated shaft pointing upward. Use a tough material suitable for flexible snaps. A calibrated tough-resin printer is preferable for the small encoder tip; fine-nozzle PETG is a possible prototype route. Test the coupons before committing to the full knob.

The GT-EVA01AA-L1 drawing specifies a 0.8 ± 0.03 mm square drive opening. The nominal printed tip is 0.76 mm. Print coupons from 0.72 to 0.84 mm, choose a gentle sliding fit, and update `squareDrive` in `enclosure/dimensions.ts` if necessary. The actual encoder engagement depth must also be confirmed physically. Never force a tip into the encoder.

## Purchased items

Use an **accessory-side MagSafe magnet module**, correctly polarized, preferably supplied with its shielding. A plain steel adhesive ring is not the specified magnetic module. The nominal magnetic ring is 54.1 mm outside diameter and 46 mm inside diameter. This pocket is 54.5 mm outside diameter, 45.6 mm inside diameter, and 2.15 mm deep; the complete module including adhesive and shield must fit within the 2 mm modeled envelope. Measure the purchased module before printing.

Add a 0.8 mm soft phone-facing film, approximately 56.8 mm diameter, and three 0.2 mm compliant PCB clamp pads. The ring and film use thin adhesive; the printed assembly itself snaps together. The underside reference geometry represents the module envelope, not its individual magnet segments.

## Assembly

1. Secure the correctly oriented magnet module in the underside pocket. Apply the soft contact film so no hard print edge contacts the phone.
2. Install the battery, then seat the PCB on the three built-in base ledges. The supports keep the bottom battery holder clear of the floor.
3. Apply the three thin clamp pads beneath the lid fingers. Align the lid clips with the base groove and press the lid into place evenly.
4. Gently align the knob's integrated square tip with the encoder opening through the lid guide. Lower the knob and flex its lower skirt over the base retention bead. Do not use the snap force to force the shaft into the encoder.
5. Confirm a full turn, free return after pressing, and secure retention. The cover has 0.2 mm of modeled press travel. Its rim remains approximately 0.65 mm above the phone contact surface at full press.

For servicing, remove the device from the phone, ease the flexible lower skirt outward and lift the knob evenly. The lid has three edge notches for gentle release.

## Geometry and validation

The knob's 12 short skirt slots provide flex for assembly. The lower lip catches the base bead when lifted; the operating position leaves room to rotate and press. The lid bore guides the shaft while the base supports carry PCB loads.

`npm run enclosure:export` exports watertight meshes with the Manifold kernel and checks material intersections at eleven knob angles, both released and pressed. It also checks the PCB, battery-holder envelope, magnet pocket, and conservative top-side component envelopes. These checks cover operating clearances, not material flex, wear, magnetic holding force, or real print tolerances. Fit-test the shaft and snaps and check antenna performance with the magnet and enclosure installed before production.

The assembly uses documented `assembly.device` and `assembly.printedpart` elements, with the unchanged PCB in `TurnCountBoard.tsx`.

References: [tscircuit assembly](https://docs.tscircuit.com/elements/assembly-device), [printed parts](https://docs.tscircuit.com/elements/assembly-printedpart), [encoder drawing](https://datasheet.lcsc.com/datasheet/pdf/d558dce12d76d23321eaeb216a98bcc8.pdf), and [Apple accessory guidelines](https://developer.apple.com/accessories/Accessory-Design-Guidelines.pdf).
