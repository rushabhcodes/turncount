# TurnCount enclosure prototype

This is a simplified print-and-fit enclosure for the 48 mm TurnCount PCB. It
uses a plain circular tray, a flat screw-on cover, the existing rotating
encoder knob, and six phone-facing magnet pockets. The legacy USB opening and
pouch-battery pocket are removed. The open bay below the PCB clears the
board-mounted CR2032 holder and cell.

## Printable parts

| Part | 3MF | Material |
| --- | --- | --- |
| PCB tray and magnetic base | `output/01_lower_tray.3mf` | PETG or ASA |
| Flat screw-on cover | `output/02_upper_cover.3mf` | PETG or ASA |
| Fluted rotating cap | `output/03_rotating_cap.3mf` | PETG or ASA |

The 3MF files are print oriented: the tray sits phone-side down, and the cover
prints with its closed roof on the build plate. The `*_assembly.obj` files are viewer models;
do not print those. The circuit uses the OBJ files so the published 3D viewer
can render the enclosure. Regenerate the tray and cover with
`blender -b --python mechanical/generate_enclosure.py`.
The original vendor CAD links in the imported PCB components remain untouched.

`output/assembled.png` shows the enclosure in the circuit's 3D view.
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
| Tray central bay | 49.6 mm diameter, open above a 2.2 mm floor |
| PCB support ledge | z 7.65–8.4 mm |
| CR2032 clear area | 20 mm cell within the central bay below the PCB |
| Encoder shaft opening | 6 mm diameter |
| Magnet pockets | six, 6.24 mm diameter × 2.25 mm deep |
| Magnet pitch radius | 27.7 mm |

The PCB support ledge is at z = 8.4 mm. The cover has a flat 1.8 mm roof and
opens around the encoder shaft. Its 32.72 mm radius slightly overhangs the
tray; the existing cap remains the rotating control. The lower shell leaves a
6.2 mm open cavity beneath the PCB ledge for the holder and cell. Verify actual
holder, cell, encoder, and screw clearances before printing a full set.

The six magnets form three opposing pairs at a 27.7 mm pitch radius. Check
polarity and phone-case clearance before gluing them in. RF behavior and
magnetic holding force still need a real test.

## Hardware and fit sequence

1. Print the tray, cover and cap. Start with a dimensional test of the PCB
   bore, CR2032 clearance, screw holes, shaft opening and magnet pockets.
2. Fit six 6 × 2 mm disc magnets in the underside pockets with adhesive.
   Check polarity against the chosen phone mounting plate before gluing. The
   pattern is a custom attachment pattern, not a verified MagSafe ring.
3. Check coin-cell contact retention and replacement access before closing the
   cover.
4. Seat the PCB, then fasten the cover using three M2 screws. The cover has
   2.5 mm clearance holes and the tray has 1.9 mm pilot holes. Choose screw
   length after a physical fit test.
5. The cap has a 0.98 mm square bore in its central printed hub. Fit a **metal
   0.8 mm square drive pin** to the encoder socket; trim its length on the
   actual board. Do not use a long printed pin or force the encoder switch.
6. Test magnetic holding force on the intended phone/case. Check camera
   clearance and BLE range with the magnets installed.

Component heights, coin-cell fit, RF performance and magnet retention require
a physical fit test with real parts.
