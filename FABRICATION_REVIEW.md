# TurnCount fabrication review

Status: **replacement layout under validation; not released for fabrication**.
Target: JLCPCB, 48 mm circular PCB, two layers, 1.6 mm FR4, 1 oz copper.

## Replacement

U1 is now u-blox ANNA-B112-00B, JLCPCB C2931350, imported through
`tsci import C2931350 --jlcpcb --use-exact-footprint` without `--download`.
Its linked OBJ/STEP files are the selected JLCPCB models.
The 6.5 × 6.5 × 1.2 mm module uses the same nRF52832 processor.

Encoder A/B/push now connect to GPIO_13/14/15 (P0.14/15/16).
Reset and SWD are retained at the test pads.
All grounds and exposed ground pads connect to GND.
XL1/XL2 are grounded for calibrated internal LFRC operation.
The module includes DC-DC inductors; firmware configuration must follow u-blox.
Factory u-connectXpress firmware must be erased for the counter application.

Native TSX implements the PCB-edge antenna feed, 0.35 mm tuning return strip,
top/bottom copper voids and a ground via fence using Appendix B, Figures 29/30
of u-blox UBX-18009821 R11 as its reference. ANT_PCB is left open.
The circular ground plane, stackup and enclosure differ from the reference.
A completed route and copper checks do not establish RF performance or inherited
regulatory approval.

## Verification

GitHub Actions runs TypeScript, netlist, schematic placement, PCB placement,
routed build, power/pin-map guards, assembly geometry/stencil guards, native
shorts checks and an independent exported-Gerber connectivity/clearance check.
Results for the previous Raytac revision are superseded by this layout.
Replacement results are pending; see the PR's Circuit verification workflow.

## Release gates

- Select a protected 1S 4.2 V-full-charge LiPo pack fitting the 20 × 30 × 3 mm
  reserve, with a compatible 10 kΩ NTC and verified polarity/harness/current rating.
- Obtain encoder qualification for approximately 30 µA contact sensing or test
  reliability over life/environment. Its 50 mA rating is not a minimum-current specification.
- Verify effective capacitor values under DC bias and tolerance against TI limits.
- Confirm JLCPCB BOM/CPL orientation, stencil/reflow and current component stock.
- Verify knob, pegs, connectors, cell insulation/swelling allowance and enclosure fit.
  The pack connector is approximately 5.5 mm tall.
- Qualify antenna performance with the actual cell, magnets and enclosure.
- Implement and test encoder/BLE firmware, calibrated LFRC, programming,
  power consumption, charging/NTC fault response and charger temperature.

## Reproduce

Bun must be on PATH; Python requires `gerbonara` and `shapely`.

```sh
npm run typecheck
npx tsci check netlist
npx tsci check schematic-placement
npx tsci check placement
npx tsci build
npm run check:power
npm run check:fabrication
npx tsci check shorts dist/index/circuit.json
npx tsci export dist/index/circuit.json -f gerbers -o /tmp/turncount-fab.zip
python -m zipfile -e /tmp/turncount-fab.zip /tmp/turncount-fab
python scripts/check-gerbers.py /tmp/turncount-fab dist/index/circuit.json
```

No generated ZIP bundles or snapshots are committed or included in source publication.
KiCad exports require independent review: the exporter previously translated
native keepout exemptions and ground polygons incorrectly. Gerber connectivity
checks inspect actual copper rather than relying on those translations.

## References

- [ANNA-B112 integration manual R11](https://content.u-blox.com/sites/default/files/ANNA-B112_SIM_UBX-18009821.pdf)
- [ANNA-B112 datasheet R12](https://datasheet.lcsc.com/datasheet/pdf/3a5d418e3b9c1983dcafdd9f72dbadbd.pdf?productCode=C2931350)
- [JLCPCB ANNA-B112-00B](https://jlcpcb.com/partdetail/ANNA_B112_00B/C2931350)
- [TI BQ24074 datasheet](https://www.ti.com/lit/ds/symlink/bq24074.pdf)
- [TI TPS7A02 datasheet](https://www.ti.com/lit/ds/symlink/tps7a02.pdf)
- [JLCPCB PCB capabilities](https://jlcpcb.com/capabilities/pcb-capabilities)
