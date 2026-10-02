# TurnCount

TurnCount is a proposed battery-powered rotary counter that mounts magnetically to a phone. Turning the puck updates a signed count in a companion iOS or Android app over Bluetooth Low Energy (BLE). The puck has no display or charging port; it uses a replaceable CR2032 coin cell.

**Project status:** [`index.circuit.tsx`](index.circuit.tsx) now contains a first electrical PCB draft. It is a 48 mm circular prototype with an SMD encoder centered above a bottom-mounted coin cell holder, input filters, decoupling, and test pads. Firmware, enclosure, and phone apps remain proposed work. This is a review prototype, with unresolved electrical and sourcing questions below.

This README summarizes the *TurnCount product proposal*, team review version 1, dated 1 October 2026.

## V1 prototype

The first prototype uses a stationary magnetic base and a shaft-driven top knob. It is intended to prove counting, BLE communication, battery operation, and mounting before developing the thinner contactless rotating-ring concept.

| Area | Proposed V1 choice |
| --- | --- |
| Bluetooth module | Raytac MDBT42Q-512KV2 (nRF52832) |
| Dial | [ALPS Alpine EC11J1525402](https://www.lcsc.com/product-detail/C209762.html), SMD with push switch; JLCPCB C209762 |
| Power | Replaceable, non-rechargeable CR2032 in a Keystone 3002 holder |
| PCB | Circular, two-layer, 1.6 mm FR4; 48 mm diameter |
| Enclosure | 3D-printed base and knob, battery access, accessory-side magnetic mount |
| Phone interface | Custom BLE GATT service and companion iOS and Android apps |

The encoder's 20 mm actuator and 24.5 mm mounting-surface-to-top height make this a thicker demonstration unit. The proposal does not specify a 10 mm product thickness. Magnetic mounting does not imply Qi2 certification or wireless charging support. Android use may require a compatible magnetic case or adapter.

## Intended behavior

- In **full-turn mode**, one clockwise revolution adds one and one counterclockwise revolution subtracts one. Reversing direction cancels partial progress.
- In **step mode**, each validated detent changes the count. A GPIO edge alone is not a step.
- A long dial press enters pairing mode. Reset is an explicit app action.
- The app displays the count, connection status, mode, and battery warning while open. Phone-wide overlays and generic media, camera, shortcut, or HID control are outside V1 scope.
- The device retains a signed cumulative step total while disconnected and sends an absolute state snapshot after reconnect, so duplicate or missed BLE notifications do not change the app's count incorrectly.

The selected encoder has 15 pulses and 30 detents per revolution. The proposed four-edge decoder uses 60 legal quadrature transitions per full turn; direction, detent alignment, and debounce must be calibrated on hardware. The V1 operating limit is 60 rpm.

## Hardware design notes

The module runs directly from the coin cell. The draft board includes 100 nF and 10 µF supply capacitors; 1 kΩ series resistors, 100 kΩ pull-ups, and 1 nF capacitors on encoder A/B and push; plus exposed SWD, supply, reset, and A/B test pads. GPIO assignments are P0.11 for A, P0.12 for B, P0.13 for push, and P0.21 for reset. Module pad numbers were checked against the [MDBT42Q-512K KiCad symbol](https://github.com/devbisme/skidl/blob/master/src/skidl/tools/skidl/libs/RF_Module_sklib.py); confirm them against the exact Raytac variant and reference circuit before fabrication.

The encoder and holder are local components generated with `tsci import C209762 --jlcpcb --use-exact-footprint` and `tsci import C5503436 --jlcpcb --use-exact-footprint`, without `--download`. Their 3D models use remote tscircuit model CDN URLs; no OBJ or STEP files for these imported parts are stored in the project. The imported holder has two separate pads on the same positive metal contact; the component models those pads as internally connected so the PCB router can identify each pad. The exact Raytac module is absent from the tscircuit registry and JLCPCB search, so its land pattern remains adapted from [Bishop Fox's MDBT42Q-P512KV2 footprint](https://github.com/BishopFox/mellon/blob/main/Mellon/ul_MDBT42Q-P512KV2/KiCADv6/footprints.pretty/MDBT42Q-P512KV2_RAY.kicad_mod). Its separate local [MDBT42Q STEP model](https://github.com/yuhki50/kicad-packages3D/blob/master/Raytac.3dshapes/MDBT42Q.step) is used for visualization under [CC BY-SA 4.0](https://github.com/yuhki50/kicad-packages3D/blob/master/LICENSE). Verify the P variant's pad geometry and the 3D model against the selected 512KV2 module. The encoder retains two non-plated locating holes, with 1.2 mm locating pegs specified in the drawing. A 1.6 mm PCB is intended to contain these pegs above the battery face; production peg tolerances still need confirmation. The holder's PCB negative contact is a 5 mm circular land offset 4 mm from center, within the CR2032 negative face, to clear both holes. The holder's two solder tabs and remote CAD model are retained. Verify contact pressure and solder-mask isolation on an assembled sample.

The encoder and battery holder share the board center. The holder is rotated 90 degrees to keep its solder tabs away from the module's antenna region. The module sits near the right edge, with a keepout on both layers extending from its antenna toward the circular edge. This reduces PCB area by about 50% compared with the previous 60 mm square. Exact antenna clearance must be confirmed against the selected module's reference design, including the battery, magnets, phone and enclosure.

The proposed supply validation range is 2.0–3.2 V. Do not recharge the CR2032 or feed current into it from a programming fixture. Remove the cell when the fixture powers the board; use VTREF only as a reference during battery-powered debugging.

## Product questions before fabrication

- **Encoder contact current:** the [ALPS datasheet](https://datasheet.lcsc.com/datasheet/pdf/3358ec822187e9212730cac20f8e02d4.pdf?productCode=C209762) specifies a minimum encoder operating current of 1 mA; the push switch minimum rating is 1 mA at 5 V. The existing 100 kΩ pull-ups at coin-cell voltage provide only about 20–30 µA. Reliable contact operation at that current is unqualified. Resolve the input circuit or obtain manufacturer approval for low-current sensing before treating this as a compatible production selection. Continuous 1 mA pull-ups would conflict with the idle power target.
- **JLCPCB sourcing:** encoder C209762 and holder C5503436 have catalog codes. Search stock is indicative and must be rechecked when ordering. The exact Raytac module has no verified JLCPCB listing, so the whole BOM is not yet ready for JLCPCB-only assembly; select a stocked module or arrange a supported sourcing option before manufacturing.
- **Mechanical and RF verification:** check the exact Raytac footprint, locating-peg tolerances, battery insertion and retention, access to programming pads, and RF behavior beside the cell, phone and magnets. An SMD encoder removes electrical leads through the board but does not establish enclosure fit or a thin product.

## Firmware and BLE plan

Firmware should decode legal quadrature transitions, wake on GPIO activity, and preserve a signed 32-bit cumulative step total and sequence counter across disconnection. Partial-turn state remains in RAM; a wear-managed flash journal would checkpoint persistent state. Sudden battery removal can lose activity since the last checkpoint.

The proposed BLE contract includes a custom State characteristic (read and notify) with protocol version, boot ID, sequence, and cumulative steps; a Control characteristic (write with response) for reset and mode commands; plus Battery and Device Information services. UUIDs and byte encoding still need to be defined. The phone apps should treat State snapshots as authoritative and use boot ID and sequence to identify restarts and duplicate updates.

## Power targets

These are engineering targets, **not measured battery-life claims**:

| Condition | Target or planning assumption |
| --- | --- |
| Idle, disconnected | At most 15 µA average after initial fast advertising |
| Connected, no movement | At most 50 µA average at the selected connection interval |
| Slow advertising | Proposed 1–2 second interval |
| Battery model | 150 mAh usable for planning |

Closed 100 kΩ encoder pull-ups can each draw about 30 µA at 3 V. Rotation, radio traffic, leakage, temperature, and coin-cell impedance must be measured before making a battery-life claim. A six-month claim would require a measured duty-cycle average around 34 µA or less under the proposal's 150 mAh planning assumption.

## Development

This project pins `tscircuit` to `0.0.2711`. The `tsci` CLI also requires Bun. From the repository root:

```sh
npm install
npm run dev        # Open the local circuit preview
npm run typecheck  # Check TypeScript
npm run build      # Generate Circuit JSON in dist/
npx tsci build --pcb-png --3d-png  # Local previews in ignored dist/
```

`npm run typecheck`, `tsci check netlist`, `tsci check schematic-placement`, `tsci check placement`, `npm run build`, and `tsci check shorts` pass for this circular draft. The build autoroutes it. The CLI still reports lint warnings about generic passive footprints, missing courtyards and pin annotations, and a saved-routing-path export warning; Circuit JSON has no PCB errors. Passing these checks does not establish radio performance, battery life, mechanical fit, or manufacturing readiness. Check the exact module footprint and antenna keep-out, reconcile supplier footprints and courtyards, and measure supply behavior on real hardware before fabrication.

The encoder and holder load their imported remote OBJ/STEP models; the Raytac module references its separate STEP model. Preview support for that STEP model can differ between renderers. The default camera views the top of the board; the bottom-mounted holder is underneath. The model does not establish enclosure clearances.

## Proposed acceptance gates

1. **Bench proof:** Decode 100 turns in each direction without mismatch, including reversals and rests.
2. **App proof:** Show the correct count after 100 offline turns and reconnect; duplicate packets must not double-count.
3. **PCB and CAD:** Review module pad mapping, footprints, antenna clearances, enclosure fit, and battery access.
4. **Assembled prototype:** Verify SWD, operation across 2.0–3.2 V, and BLE performance mounted on real phones.
5. **Product decision:** Measure power, mount retention, dial feel, and thickness before deciding whether to develop the thin ring.

The thin rotating-ring design is a later revision. Its sensing method and magnetic geometry have not been selected.
