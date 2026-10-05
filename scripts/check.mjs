import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdir, writeFile, readFile } from 'node:fs/promises'

const execute = promisify(execFile)
const logDirectory = 'dist/checks'
await mkdir(logDirectory, { recursive: true })
const results = []

async function check(name, args, command = 'npx') {
  let output = ''
  try {
    const result = await execute(command, args, { maxBuffer: 16 * 1024 * 1024 })
    output = result.stdout + result.stderr
    if (name === 'schematic-placement' && output.includes('<SchematicPlacementIssues>')) {
      throw new Error('Schematic placement issues remain')
    }
    if (/^Errors:\s*[1-9]/m.test(output)) throw new Error('Circuit errors remain')
    results.push({ name, passed: true })
    console.log(`PASS ${name}`)
  } catch (error) {
    output ||= `${error.stdout ?? ''}${error.stderr ?? ''}${error.message}`
    results.push({ name, passed: false })
    console.error(`FAIL ${name}: see ${logDirectory}/${name}.log`)
    throw error
  } finally {
    await writeFile(`${logDirectory}/${name}.log`, output)
  }
}

try {
  await check('netlist', ['tsci', 'check', 'netlist'])
  for (const batch of [
    ['source', 'pin_specification', 'schematic-placement'],
    ['placement', 'routing-difficulty'],
  ]) {
    const checked = await Promise.allSettled(batch.map(name => check(name, ['tsci', 'check', name])))
    if (checked.some(result => result.status === 'rejected')) throw new Error('Circuit checks failed')
  }
  await check('typecheck', ['run', 'typecheck'], 'npm')
  await check('build', ['tsci', 'build', '--pcb-png', '--schematic-png'])
  await check('shorts', ['tsci', 'check', 'shorts', 'dist/index/circuit.json'])
  for (const targets of [['U1.XC1', 'U1.XC2', 'U1.ANT'], ['net.VBAT', 'net.GND']]) {
    const checked = await Promise.allSettled(targets.map(target => check(
      `trace-length-${target.replaceAll('.', '-')}`,
      ['tsci', 'check', 'trace-length', target, 'dist/index/circuit.json'],
    )))
    if (checked.some(result => result.status === 'rejected')) throw new Error('Trace length analysis failed')
  }
  const circuit = JSON.parse(await readFile('dist/index/circuit.json', 'utf8'))
  const vias = circuit.filter(element => element.type === 'pcb_via')
  if (!vias.length || vias.some(via => via.hole_diameter < 0.3 - 1e-6 || via.outer_diameter < 0.6 - 1e-6)) {
    throw new Error('Via sizes violate the standard JLCPCB profile')
  }
  const wires = circuit.filter(element => element.type === 'pcb_trace').flatMap(trace => trace.route).filter(point => point.route_type === 'wire')
  if (!wires.length || wires.some(wire => wire.width < 0.15 - 1e-6)) throw new Error('Trace widths violate the manufacturing profile')
  const holes = circuit.filter(element => element.type === 'pcb_hole')
  if (holes.some(hole => hole.hole_diameter < 0.5 - 1e-6)) throw new Error('Non-plated holes are below the JLCPCB minimum')
  const board = circuit.find(element => element.type === 'pcb_board')
  if (board.num_layers !== 2 || board.thickness !== 1.6) throw new Error('Board stackup differs from the standard two-layer profile')
  results.push({ name: 'manufacturing-dimensions', passed: true, viaCount: vias.length, viaHoleDiameter: 0.3, viaPadDiameter: 0.6, minimumTraceWidth: 0.15 })
  console.log(`PASS manufacturing-dimensions (${vias.length} standard vias)`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  await writeFile(`${logDirectory}/summary.json`, JSON.stringify(results, null, 2) + '\n')
}
