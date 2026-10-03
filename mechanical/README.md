# TurnCount enclosure prototype

This is a fresh print-and-fit enclosure for the current 48 mm rechargeable
TurnCount PCB. It includes a phone-facing magnetic base, battery space, USB-C
access, a screw-retained cover and a rotating bottle-cap style knob. It is not
yet validated against a manufactured PCB, selected battery, phone case or USB
plug.

## Printable parts

| Part | 3MF | Material |
| --- | --- | --- |
| PCB tray and magnetic base | `output/01_lower_tray.3mf` | PETG or ASA |
| Retaining cover | `output/02_upper_cover.3mf` | PETG or ASA |
| Fluted rotating cap | `output/03_rotating_cap.3mf` | PETG or ASA |
| Optional phone-contact ring | `output/04_phone_grip_TPU.3mf` | TPU |

The 3MF files are print oriented. The `*_assembly.glb` files are recentered
viewer models; do not print those. The circuit uses the GLB files so the
published 3D viewer can render the enclosure.
The original vendor CAD links in the
imported PCB components remain untouched.
The cover and cap print files have their closed top faces on the build plate; the
tray and TPU ring have their phone-facing sides on the build plate.

`output/assembled.png`, `output/exploded.png`, `output/phone_side.png`,
`output/magnet_pockets.png` show the prototype.
The enclosure is also included in the default circuit's 3D view. Rendering
that view may require network access to the imported components' vendor CAD
models.

## Mechanical dimensions

| Feature | Design value |
| --- | ---: |
| PCB diameter and thickness | 48.0 × 1.6 mm, with a 6 mm wide left-side lead notch |
| PCB bore | 48.7 mm |
| Stationary body diameter | 64.0 mm |
| Fluted cap outer diameter | about 69.4 mm |
| Cap to body radial clearance | 0.45 mm |
| Tray top / cover top from phone-facing base | 11.5 / 18.8 mm |
| Cap top from base | 28.0 mm |
| Battery pocket | 22.4 × 32.4 × 5.6 mm maximum cavity |
| USB opening | 15.4 mm wide, z 8.65–16.25 mm |
| Magnet pockets | six, 6.24 mm diameter × 2.25 mm deep |
| Magnet pitch radius | 27.7 mm |

The PCB bottom sits at z = 8.4 mm; the cover cavity ends at z = 17.1 mm,
giving 7.1 mm above the PCB top for populated parts. The cap skirt starts at
z = 17.2 mm, leaving 0.95 mm above the USB opening. Its diameter overhangs the
stationary body so fingers can turn it without reaching into the body. A shallow
cover bead and cap recess retain the cap while allowing axial push travel;
deburr and tune the snap fit on a first print before installing the encoder.

The battery pocket is a design allowance. The PCB currently reserves 20 × 30
mm beneath the encoder; no battery SKU, connector lead dress or swelling
allowance has been approved. A 20 × 30 × 4.5 mm reference block fits inside the
nominal cavity, but the pack and insulation must be measured on a real build.
The left-side lead trench is aligned with the PCB edge notch (from x = −24 mm
to x = −18 mm, y = −3 mm to +3 mm). J2 is set inward of the notch so the
three pack wires can drop beneath the PCB into the tray channel. Check the
actual plug, wire bend radius and strain relief on a physical assembly.
The six magnets form three opposing pairs, with no magnet in the radio's
positive-X/positive-Y antenna sector. The optional TPU ring has matching
access holes so it does not cover the magnet pockets. RF behavior and holding
force still need a real test.

## Hardware and fit sequence

1. Print the four 3MF files. Start with a dimensional test of the PCB bore, USB
   opening, cap clearance, screw holes and magnet pockets.
2. Fit six 6 × 2 mm disc magnets in the underside pockets with adhesive.
   Check polarity against the chosen phone mounting plate before gluing. The
   pattern is a custom attachment pattern, not a verified MagSafe ring.
3. Fit the selected protected 1S LiPo pack with insulation, strain relief and
   clearance for swelling. Route its wires to J2 without pinching them beneath
   the PCB. Verify connector polarity and NTC wiring.
4. Seat the PCB, then close the cover using three M2 nylon screws. The cover
   holes are 2.32 mm clearance with 4.36 mm head recesses; the tray has 1.72
   mm pilot holes. Choose screw length after a physical fit test.
5. The cap has a 0.98 mm square bore in its central printed hub. Fit a **metal
   0.8 mm square drive pin** to the encoder socket; trim its length on the
   actual board. Do not use a long printed pin or force the encoder switch.
6. Add the TPU ring and test grip and magnetic holding force on the intended
   phone/case. Check camera clearance, USB cable overmould clearance and BLE
   range with the magnets installed.

The USB receptacle's plug envelope, component heights, RF performance, magnet
retention and chosen battery require a physical fit test with real parts.
