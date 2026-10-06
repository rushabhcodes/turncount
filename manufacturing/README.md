# TurnCount fabrication bundle — 1.0.19

`turncount-gerbers.zip` contains the latest routed two-layer board export.
Use 1.6 mm FR-4, 1 oz copper, green solder mask, standard outline tolerance,
and tented through-vias for the standard PCB quote.

All 47 plated holes are 0.30 mm with 0.60 mm copper pads. Both mask layers
cover the vias. The two encoder locating holes are 0.60 mm non-plated holes.
`validation-summary.json` records the passing circuit and dimension checks.
Reproduce validation with `npm run check`.

The export also contains BOM and placement data. Battery-holder rotation has
not been automatically verified because the imported footprint lacks a pin-1
location. Check that rotation before ordering assembly. Passive encoder/crystal
power-pin metadata and bare test-pad courtyard warnings remain nonblocking.
The design still requires physical holder review and RF/antenna tuning.

The CLI doctor authentication-header logging diagnostic remains; it does not
change the passing circuit checks. Confirm the final manufacturing quote with
JLCPCB, since finish, assembly, and order options affect pricing separately.
