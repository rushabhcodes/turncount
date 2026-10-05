# TurnCount

TurnCount is a 48 mm round, two-layer rotary encoder prototype. The current circuit uses a CR2032 coin cell, a bare Nordic nRF52810-QFAA-R QFN-48, and a low-profile SMD encoder. USB-C charging and the LiPo charger/regulator path have been removed. The coin cell feeds the nRF52810 supply directly; its 1.7–3.6 V operating range accommodates a CR2032 over its discharge curve.

This remains a design review prototype, not a fabrication release. The CR2032 holder, RF layout and antenna tuning need physical review. The nRF52810 requires its supply decoupling, DEC capacitors, ground exposed pad, RF matching network and antenna, which are represented in the circuit.

## Main parts

| Function | Part |
| --- | --- |
| BLE MCU | Nordic nRF52810-QFAA-R, QFN-48; JLCPCB C141828 |
| Battery holder | MY-2032-16 CR2032 holder; JLCPCB C2902340 |
| RF antenna | RFANT3216120A5T; JLCPCB C127629 |
| Encoder | GT-EVA01AA-L1 |

GPIO assignments are P0.11 for A, P0.12 for B, P0.13 for push and P0.14 for the debug LED. SWDIO, SWDCLK and reset are exposed on test pads. The CR2032 holder mounts on the underside; check clearance against any future enclosure before fabrication.

## JLCPCB fabrication settings

The board explicitly uses 0.30 mm drilled through-vias with 0.60 mm copper pads
(0.15 mm radial annular ring), tented on both sides. JLCPCB lists extra charges
for 0.10/0.15 mm via holes and for 0.20/0.25 mm holes with pads below 0.45 mm;
these standard 0.30/0.60 mm vias avoid that small-hole category. Routing uses
0.15 mm minimum trace width and trace-to-pad clearance, 0.15 mm pad clearance,
0.20 mm hole and via-to-pad clearance, 0.45 mm via drill-to-drill clearance,
and 0.30 mm copper
clearance from the routed outline. The encoder's two 0.60 mm non-plated locating
holes exceed the 0.50 mm NPTH minimum.

For the economical PCB quote, use two-layer FR-4, 1.6 mm thickness, 1 oz copper,
green solder mask, standard outline tolerance and tented vias. Do not request
filled/capped vias, blind/buried vias, edge plating or controlled impedance.
Surface finish and assembly services affect the quote separately; confirm the
final Gerbers in JLCPCB's DFM/quote before ordering. Re-export fabrication files
after changing these rules; an older Gerber ZIP does not inherit source changes.

Requirements: <https://jlcpcb.com/capabilities/pcb-capabilities>.

Validation is reproducible with `npm run check`: all eight CLI check types,
TypeScript, the routed build, and the manufacturing dimension audit must pass.
The pin specification check retains two nonblocking warnings for passive imported
encoder/crystal parts without power-pin metadata. Bare test pads have no courtyard.

Verified routes are stored in `routing/pcb-trace-paths.json` and loaded by an
explicit routing phase. Changes to pad locations or footprints require updating
these routes and repeating the checks before exporting. The latest fabrication
bundle and validation summary are saved in `manufacturing/`.

The CLI doctor reports an npm authentication-header logging diagnostic despite
matching registry credentials. This is separate from the circuit checks; registry
publication verifies the active session directly.

## Build

```sh
npm install
npm run check
```

The PCB uses exact imported JLCPCB footprints for the nRF52810, battery holder, RF antenna, encoder and LED. Check current stock, verify the selected footprints and RF network against the Nordic reference design, and tune the antenna on the assembled board before treating this as a production design.
