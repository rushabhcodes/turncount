# TurnCount enclosure prototype

This is a print-and-fit enclosure for the 48 mm TurnCount PCB. It includes a
phone-facing magnetic base, battery space, an unused legacy USB opening, a
screw-retained cover and a rotating bottle-cap style knob. The PCB now uses a
CR2032 and a board-mounted holder; the existing enclosure has not been updated
to fit or clear that holder and battery.

## Printable parts

| Part | 3MF | Material |
| --- | --- | --- |
| PCB tray and magnetic base | `output/01_lower_tray.3mf` | PETG or ASA |
| Retaining cover | `output/02_upper_cover.3mf` | PETG or ASA |
| Fluted rotating cap | `output/03_rotating_cap.3mf` | PETG or ASA |
| Optional phone-contact ring | `output/04_phone_grip_TPU.3mf` | TPU |

The 3MF files are print oriented. The `*_assembly.obj` files are recentered
viewer models; do not print those. The circuit uses the OBJ files so the
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
| PCB diameter and thickness | 48.0 × 1.6 mm, circular outline |
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

The battery pocket was designed around a 20 × 30 mm pack and does not establish
clearance for the MY-2032-16 holder (26.4 × 10.6 mm footprint) or a CR2032.
Redesign and reprint the tray before fitting the coin cell. Verify the holder's
metal clips, cell thickness, encoder underside and cover clearance together.
The six magnets form three opposing pairs, with no magnet in the radio's
positive-X/positive-Y antenna sector. The optional TPU ring has matching
access holes so it does not cover the magnet pockets. RF behavior and holding
force still need a real test.

## Hardware and fit sequence

1. Print the four 3MF files. Start with a dimensional test of the PCB bore,
   cap clearance, screw holes and magnet pockets. Treat the existing USB
   opening and battery pocket as legacy geometry.
2. Fit six 6 × 2 mm disc magnets in the underside pockets with adhesive.
   Check polarity against the chosen phone mounting plate before gluing. The
   pattern is a custom attachment pattern, not a verified MagSafe ring.
3. Do not fit a battery until the tray is redesigned for the CR2032 holder and
   its cell. Check contact retention and battery replacement access.
4. Seat the PCB, then close the cover using three M2 nylon screws. The cover
   holes are 2.32 mm clearance with 4.36 mm head recesses; the tray has 1.72
   mm pilot holes. Choose screw length after a physical fit test.
5. The cap has a 0.98 mm square bore in its central printed hub. Fit a **metal
   0.8 mm square drive pin** to the encoder socket; trim its length on the
   actual board. Do not use a long printed pin or force the encoder switch.
6. Add the TPU ring and test grip and magnetic holding force on the intended
   phone/case. Check camera clearance and BLE range with the magnets installed.

Component heights, coin-cell fit, RF performance and magnet retention require
a physical fit test with real parts.
