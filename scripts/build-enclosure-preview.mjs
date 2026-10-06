import { readFile, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
const directory = 'enclosure/output'
const file = `${directory}/turncount-assembled.glb`
const original = await readFile(file)
const jsonLength = original.readUInt32LE(12)
const gltf = JSON.parse(original.subarray(20, 20 + jsonLength).toString())
const binaryChunk = original.subarray(20 + jsonLength)
const colors = {
  BASE: [0.025, 0.05, 0.08], CRADLE: [0.14, 0.24, 0.32], LID: [0.28, 0.39, 0.48],
  DRIVE: [0.88, 0.9, 0.92], KNOB: [0.58, 0.34, 0.13],
  MAGNET_RING_REFERENCE: [0.64, 0.68, 0.72], CONTACT_FILM_REFERENCE: [0.05, 0.07, 0.09],
}
for (const node of gltf.nodes) {
  if (!colors[node.name]) continue
  const material = gltf.materials.length
  gltf.materials.push({ name: node.name, pbrMetallicRoughness: {
    baseColorFactor: [...colors[node.name], 1], metallicFactor: node.name.includes('MAGNET') ? 0.65 : 0,
    roughnessFactor: node.name === 'KNOB' ? 0.4 : 0.65,
  } })
  for (const primitive of gltf.meshes[node.mesh].primitives) primitive.material = material
}
function glb(json) {
  const text = Buffer.from(JSON.stringify(json)); const padded = Buffer.alloc(Math.ceil(text.length / 4) * 4, 0x20);text.copy(padded)
  const header = Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4)
  header.writeUInt32LE(20 + padded.length + binaryChunk.length,8);header.writeUInt32LE(padded.length,12);header.writeUInt32LE(0x4e4f534a,16)
  return Buffer.concat([header,padded,binaryChunk])
}
const assembled = glb(gltf)
await writeFile(file, assembled)
const offsets = { BASE: -12, LID: 12, KNOB: 28, MAGNET_RING_REFERENCE: -18, CONTACT_FILM_REFERENCE: -22 }
const exploded = structuredClone(gltf)
for (const node of exploded.nodes) if (node.name in offsets) node.translation[1] += offsets[node.name]
await writeFile(`${directory}/turncount-exploded.glb`, glb(exploded))
execFileSync('bun', ['build', 'scripts/enclosure-viewer.mjs', '--target', 'browser', '--minify', '--outfile', `${directory}/viewer.js`])
const viewer = await readFile(`${directory}/viewer.js`, 'utf8')
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TurnCount — umbrella enclosure</title>
<style>*{box-sizing:border-box}body{margin:0;background:#101820;color:#edf2f6;font:15px system-ui,sans-serif}header{position:absolute;z-index:2;left:40px;top:30px;right:40px;display:flex;justify-content:space-between;align-items:center}header b{font-size:24px;letter-spacing:-1px}header span{color:#90a6b8;font-size:12px;letter-spacing:2px;text-transform:uppercase}canvas{display:block;width:100vw;height:100vh;background:radial-gradient(ellipse at 45% 40%,#26384a,#0d1722 70%)}aside{position:absolute;right:32px;top:100px;width:285px;border:1px solid #3c4d5e;background:#152331ed;border-radius:16px;padding:24px;backdrop-filter:blur(12px)}h1{font-size:23px;line-height:1.2;margin:0 0 12px;letter-spacing:-.7px}p{color:#9eb1c2;line-height:1.5;margin:0 0 18px;font-size:13px}.tag{color:#edbe83;font-size:11px;text-transform:uppercase;letter-spacing:1.4px;margin-bottom:14px}.tabs{display:flex;gap:6px;margin:22px 0 24px}button{background:#233545;border:1px solid #496074;color:#c7d5df;border-radius:8px;padding:10px 12px;cursor:pointer;font:inherit;font-size:12px}button.active{background:#e1ad70;color:#17212a;border-color:#e1ad70}label{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:#c7d5df;margin:18px 0 8px}input[type=range]{width:100%;accent-color:#e1ad70}input[type=checkbox]{accent-color:#e1ad70;width:16px;height:16px}.legend{border-top:1px solid #354858;margin-top:22px;padding-top:14px;display:grid;gap:9px;font-size:12px;color:#b6c8d7}.legend i{width:8px;height:8px;display:inline-block;border-radius:50%;margin-right:8px}.dimension{display:flex;gap:20px;margin:18px 0 0}.dimension strong{font-size:20px;color:#f0d2ad}.dimension small{display:block;font-size:10px;color:#91a9bc;margin-top:3px}.foot{position:absolute;left:40px;bottom:30px;right:40px;display:flex;justify-content:space-between;align-items:center;color:#96adbf;font-size:12px}.foot a{color:#e1ad70;text-decoration:none}.note{font-size:11px;line-height:1.5;margin-top:18px;margin-bottom:0;color:#8fa6b8}@media(max-width:760px){header{left:20px;top:20px;right:20px}header span{display:none}canvas{height:65vh}aside{position:relative;inset:auto;width:calc(100% - 32px);margin:-20px 16px 60px;padding:20px}.foot{position:fixed;left:20px;right:20px;bottom:12px;background:#101820;padding:10px;z-index:3}}
aside{scrollbar-color:#40576b #152331;scrollbar-width:thin}body{overflow:hidden}canvas{width:calc(100vw - 325px)}aside{right:24px;top:82px;width:280px;padding:18px;max-height:calc(100vh - 145px);overflow:auto}.tag{margin-bottom:8px}h1{font-size:21px;margin-bottom:8px}p{font-size:12px;margin-bottom:10px}.dimension{margin-top:10px}.dimension strong{font-size:18px}.tabs{margin:16px 0}.tabs button{padding:8px 9px}label{margin:12px 0 6px}.legend{margin-top:14px;padding-top:10px;gap:6px}.note{margin-top:12px;font-size:10px}.foot{bottom:18px}header{top:24px}@media(max-width:760px){body{overflow:auto}canvas{width:100vw;height:60vh}aside{max-height:none;overflow:visible;top:auto;right:auto;width:calc(100% - 32px);margin:-10px 16px 65px}}
</style><header><b>TurnCount<span style="color:#e1ad70;margin-left:6px">↻</span></b><span>Umbrella enclosure / Prototype 02</span></header><canvas></canvas>
<aside><div class="tag">Rotate. Press. Attach.</div><h1>A dial that covers<br>the whole board.</h1><p>Three printed parts, snapped together. The rotating cover reaches down around the entire enclosure.</p><div class="dimension"><div><strong>60 mm</strong><small>CANOPY DIAMETER</small></div><div><strong>20.7 mm</strong><small>OVERALL HEIGHT</small></div></div>
<div class="tabs"><button data-view="assembled" class="active">Assembled</button><button data-view="exploded">Exploded</button><button data-view="underside">Underside</button></div>
<label for="explode">Separate the parts</label><input id="explode" type="range" min="0" max="1" step="0.01" value="0">
<label for="rotation">Turn the knob <span id="degrees">0°</span></label><input id="rotation" type="range" min="0" max="360" value="0">
<label for="hide">Lift the canopy out of view<input id="hide" type="checkbox"></label><label for="press">Press the knob · 0.2 mm<input id="press" type="checkbox"></label>
<div class="legend"><div><i style="background:#d2985d"></i>Rotating umbrella knob</div><div><i style="background:#7494a7"></i>Snap-in lid</div><div><i style="background:#465b70"></i>Magnet-pocket base</div><div><i style="background:#bec7cf"></i>Purchased MagSafe accessory ring</div></div><p class="note">Fit-check prototype. Print a small tip-fit coupon first and confirm it on the actual encoder.</p></aside>
<div class="foot"><span id="status">Loading model…</span><a href="turncount-enclosure.zip" download>Download print files ↗</a></div>
<script>window.TURNCOUNT_GLB=${JSON.stringify(assembled.toString('base64'))}</script><script type="module">${viewer}</script></html>`
await writeFile(`${directory}/preview.html`, html)
console.log('Created colored assembled/exploded GLB models and a self-contained interactive preview.')
