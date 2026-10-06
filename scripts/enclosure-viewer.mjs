import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const canvas = document.querySelector('canvas')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 1000)
camera.position.set(82, 72, 88)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.set(0, 1, 0)
scene.add(new THREE.HemisphereLight(0xdfefff, 0x45505b, 1.5))
for (const [position, intensity] of [[[60, 90, 40], 2.5], [[-50, 25, -50], 1.5]]) {
  const light = new THREE.DirectionalLight(0xffffff, intensity)
  light.position.set(...position)
  scene.add(light)
}
const floor = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), new THREE.MeshStandardMaterial({ color: 0x111b26, roughness: 1 }))
floor.rotation.x = -Math.PI / 2
floor.position.y = -40
// Keep the backdrop clear so every assembly layer is visible.
const loader = new GLTFLoader()
const binary = Uint8Array.from(atob(window.TURNCOUNT_GLB), character => character.charCodeAt(0)).buffer
const gltf = await loader.parseAsync(binary, '')
scene.add(gltf.scene)
const offsets = { BASE: -12, LID: 12, KNOB: 28, MAGNET_RING_REFERENCE: -18, CONTACT_FILM_REFERENCE: -22 }
const nodes = Object.fromEntries(Object.keys(offsets).map(name => [name, gltf.scene.getObjectByName(name)]))
for (const node of Object.values(nodes)) node.userData.originalY = node.position.y
let explode = 0, pressed = false
function update() {
  for (const [name, node] of Object.entries(nodes)) {
    node.position.y = node.userData.originalY + offsets[name] * explode - (pressed && ['KNOB'].includes(name) ? 0.2 : 0)
  }
  const angle = Number(document.querySelector('#rotation').value)
  nodes.KNOB.rotation.y = angle * Math.PI / 180
  document.querySelector('#degrees').textContent = `${angle}°`
}
document.querySelector('#rotation').addEventListener('input', update)
document.querySelector('#hide').addEventListener('change', event => { nodes.KNOB.visible = !event.target.checked })
document.querySelector('#explode').addEventListener('input', event => { explode = Number(event.target.value); update() })
document.querySelector('#press').addEventListener('change', event => { pressed = event.target.checked; update() })
for (const button of document.querySelectorAll('[data-view]')) button.addEventListener('click', () => {
  document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b === button))
  if (button.dataset.view === 'assembled') {
    explode = 0; camera.position.set(82, 72, 88); controls.target.set(0, 1, 0)
  } else if (button.dataset.view === 'exploded') {
    explode = 1; camera.position.set(106, 75, 115); controls.target.set(0, 6, 0)
  } else {
    explode = 0; camera.position.set(50, -85, 55); controls.target.set(0, -3, 0)
  }
  nodes.CONTACT_FILM_REFERENCE.visible = button.dataset.view !== 'underside'
  document.querySelector('#status').textContent = button.dataset.view === 'underside' ? 'Contact film lifted · Drag to orbit' : 'Drag to orbit · Scroll to zoom'
  document.querySelector('#explode').value = explode
  update()
})
document.querySelector('#status').textContent = 'Drag to orbit · Scroll to zoom'
function render() {
  const rect = canvas.getBoundingClientRect()
  if (canvas.width !== Math.round(rect.width * renderer.getPixelRatio()) || canvas.height !== Math.round(rect.height * renderer.getPixelRatio())) {
    renderer.setSize(rect.width, rect.height, false); camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix()
  }
  controls.update(); renderer.render(scene, camera); requestAnimationFrame(render)
}
window.turncountViewer = { scene, camera, renderer, nodes }
update(); render()
