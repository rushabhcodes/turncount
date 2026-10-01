# TurnCount

TurnCount is a proposed battery-powered rotary counter that mounts magnetically to a phone. Turning the puck updates a signed count in a companion iOS or Android app over Bluetooth Low Energy (BLE). The puck has no display or charging port; it uses a replaceable CR2032 coin cell.

**Project status:** This repository is a tscircuit starter project. [`index.circuit.tsx`](index.circuit.tsx) currently contains an empty board. The hardware, firmware, enclosure, and phone apps described below are proposed work, not completed features.

This README summarizes the *TurnCount product proposal*, team review version 1, dated 1 October 2026.

## V1 prototype

The first prototype uses a stationary magnetic base and a shaft-driven top knob. It is intended to prove counting, BLE communication, battery operation, and mounting before developing the thinner contactless rotating-ring concept.

| Area | Proposed V1 choice |
| --- | --- |
| Bluetooth module | Raytac MDBT42Q-512KV2 (nRF52832) |
| Dial | Bourns PEC11R-4215F-S0024 mechanical encoder with push switch |
| Power | Replaceable, non-rechargeable CR2032 in a Keystone 3002 holder |
| PCB | Circular, two-layer, 1.0 mm FR4; 40 mm diameter is a placement target |
| Enclosure | 3D-printed base and knob, battery access, accessory-side magnetic mount |
| Phone interface | Custom BLE GATT service and companion iOS and Android apps |

The encoder's 15 mm shaft makes this a thicker demonstration unit. The proposal does not specify a 10 mm product thickness. Magnetic mounting does not imply Qi2 certification or wireless charging support. Android use may require a compatible magnetic case or adapter.

## Intended behavior

- In **full-turn mode**, one clockwise revolution adds one and one counterclockwise revolution subtracts one. Reversing direction cancels partial progress.
- In **step mode**, each validated detent changes the count. A GPIO edge alone is not a step.
- A long dial press enters pairing mode. Reset is an explicit app action.
- The app displays the count, connection status, mode, and battery warning while open. Phone-wide overlays and generic media, camera, shortcut, or HID control are outside V1 scope.
- The device retains a signed cumulative step total while disconnected and sends an absolute state snapshot after reconnect, so duplicate or missed BLE notifications do not change the app's count incorrectly.

The selected encoder has 24 pulses and 24 detents per revolution. The proposed four-edge decoder uses 96 legal quadrature transitions per full turn; direction, detent alignment, and debounce must be calibrated on hardware. The V1 operating limit is 60 rpm.

## Hardware design notes

The module runs directly from the coin cell. The proposed board includes local supply decoupling and reservoir capacitors, filtered encoder A/B and push inputs, and exposed SWD, supply, and input test pads. Proposed GPIO assignments are P0.11 for A, P0.12 for B, P0.13 for push, and P0.21 for reset. These are logical assignments **pending verification against the module's exact pad mapping and reference circuit**.

Place the encoder at the mechanical center, the module near the board edge with its antenna facing outward, and the battery holder on the bottom where it clears encoder pins. The module's antenna keep-out must be respected on both PCB layers and by the battery, magnets, and enclosure. The 40 mm board target depends on a 3D interference check and is not yet a confirmed fit.

The proposed supply validation range is 2.0–3.2 V. Do not recharge the CR2032 or feed current into it from a programming fixture. Remove the cell when the fixture powers the board; use VTREF only as a reference during battery-powered debugging.

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

This project pins `tscircuit` to `0.0.2711`. From the repository root:

```sh
npm install
npm run dev        # Open the local circuit preview
npm run typecheck  # Check TypeScript
npm run build      # Generate Circuit JSON in dist/
```

The current build validates only the empty starter board. It does not validate the proposed electrical design or produce manufacturing-ready files.

## Proposed acceptance gates

1. **Bench proof:** Decode 100 turns in each direction without mismatch, including reversals and rests.
2. **App proof:** Show the correct count after 100 offline turns and reconnect; duplicate packets must not double-count.
3. **PCB and CAD:** Review module pad mapping, footprints, antenna clearances, enclosure fit, and battery access.
4. **Assembled prototype:** Verify SWD, operation across 2.0–3.2 V, and BLE performance mounted on real phones.
5. **Product decision:** Measure power, mount retention, dial feel, and thickness before deciding whether to develop the thin ring.

The thin rotating-ring design is a later revision. Its sensing method and magnetic geometry have not been selected.
