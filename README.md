# TurnCount

TurnCount is a 48 mm round, two-layer rotary encoder prototype. The current circuit uses a CR2032 coin cell, a bare Nordic nRF52810-QFAA-R QFN-48, and a low-profile SMD encoder. USB-C charging and the LiPo charger/regulator path have been removed. The coin cell feeds the nRF52810 supply directly; its 1.7–3.6 V operating range accommodates a CR2032 over its discharge curve.

This remains a design review prototype, not a fabrication release. The CR2032 holder, enclosure clearance, RF layout and antenna tuning need physical review. The nRF52810 requires its supply decoupling, DEC capacitors, ground exposed pad, RF matching network and antenna, which are represented in the circuit.

## Main parts

| Function | Part |
| --- | --- |
| BLE MCU | Nordic nRF52810-QFAA-R, QFN-48; JLCPCB C141828 |
| Battery holder | MY-2032-16 CR2032 holder; JLCPCB C2902340 |
| RF antenna | RFANT3216120A5T; JLCPCB C127629 |
| Encoder | GT-EVA01AA-L1 |

GPIO assignments are P0.11 for A, P0.12 for B, P0.13 for push and P0.14 for the debug LED. SWDIO, SWDCLK and reset are exposed on test pads. The CR2032 holder mounts on the underside; verify it clears the encoder and printed enclosure before fabrication.

## Mechanical prototype

See [mechanical/README.md](mechanical/README.md) for the enclosure and fit workflow. The enclosure geometry predates the coin-cell holder revision and must be rechecked against the holder and battery thickness.

## Development

```sh
npm install
npm run typecheck
npm run build
```

The PCB uses exact imported JLCPCB footprints for the nRF52810, battery holder, RF antenna, encoder and LED. Check current stock, verify the selected footprints and RF network against the Nordic reference design, and tune the antenna on the assembled board before treating this as a production design.
