import { readFile, writeFile, mkdir } from 'node:fs/promises'
const circuit = JSON.parse(await readFile('dist/index/circuit.json', 'utf8'))
const components = new Map(circuit.filter(e => e.type === 'source_component').map(e => [e.source_component_id, e]))
const ports = circuit.filter(e => e.type === 'source_port')
const pcbPorts = circuit.filter(e => e.type === 'pcb_port')
const parent = new Map()
function root(id) {
 if(!parent.has(id))parent.set(id,id)
 if(parent.get(id)!==id)parent.set(id,root(parent.get(id)))
 return parent.get(id)
}
for(const trace of circuit.filter(e=>e.type==='source_trace')) {
 const ids=[...(trace.connected_source_port_ids??[]),...(trace.connected_source_net_ids??[])]
 for(const id of ids.slice(1))parent.set(root(id),root(ids[0]))
}
const ground = circuit.find(e=>e.type==='source_net'&&e.name==='GND')
const requirements = [
  ['C1','VDD1',1e-7], ['C2','VDD2',1e-7], ['C15','VDD3',1e-7],
  ['C8','DEC1',1e-7], ['C9','DEC2',1e-10], ['C10','DEC3',1e-7], ['C11','DEC4',1e-6],
]
const key = p => `${p.x.toFixed(4)},${p.y.toFixed(4)}`
const graphs = new Map()
const pcbPortById = new Map(pcbPorts.map(port => [port.pcb_port_id, port]))
function edge(graph,a,b) {
  const ka=key(a),kb=key(b),length=Math.hypot(a.x-b.x,a.y-b.y)
  for(const [from,to] of [[ka,kb],[kb,ka]]) {
    if(!graph.has(from)) graph.set(from,[])
    graph.get(from).push([to,length])
  }
}
// The local bypass must have a continuous top-layer copper path, without vias.
for(const trace of circuit.filter(e => e.type === 'pcb_trace')) {
  const sourcePortId = (trace.connectsTo ?? []).map(id => pcbPortById.get(id)?.source_port_id).find(Boolean)
  if (!sourcePortId) throw new Error(`Cannot identify the net for ${trace.pcb_trace_id}`)
  const net = root(sourcePortId)
  if (!graphs.has(net)) graphs.set(net, new Map())
  const graph = graphs.get(net)
  for(let i=1;i<trace.route.length;i++) {
    const a=trace.route[i-1],b=trace.route[i]
    if(a.route_type==='wire'&&b.route_type==='wire'&&a.layer==='top'&&b.layer==='top') edge(graph,a,b)
  }
}
function getPort(name,hint) {
  const source=ports.find(p=>components.get(p.source_component_id)?.name===name && p.port_hints.includes(hint))
  if(!source) throw new Error(`Missing ${name}.${hint}`)
  return pcbPorts.find(p=>p.source_port_id===source.source_port_id)
}
function shortest(start,end) {
 const graph = graphs.get(root(start.source_port_id)) ?? new Map()
 const target=key(end),distances=new Map([[key(start),0]]),pending=new Set([key(start)])
 while(pending.size) {
  const current=[...pending].sort((a,b)=>distances.get(a)-distances.get(b))[0];pending.delete(current)
  if(current===target)return distances.get(current)
  for(const [next,length] of graph.get(current)??[]) {
   const distance=distances.get(current)+length
   if(distance<(distances.get(next)??Infinity)){distances.set(next,distance);pending.add(next)}
  }
 }
 return Infinity
}
const results = requirements.map(([name,pin,capacitance]) => {
 const component=[...components.values()].find(c=>c.name===name)
 const length=shortest(getPort(name,'pin1'),getPort('U1',pin))
 const returnPort=getPort(name,'pin2')
 const grounded=ground&&root(returnPort.source_port_id)===root(ground.source_net_id)
 return {capacitor:name,pin:`U1.${pin}`,capacitance:component?.capacitance,topLayerLengthMm:Number.isFinite(length)?length:null,maximumLengthMm:3,grounded,passed:grounded&&Math.abs(component?.capacitance-capacitance)<capacitance*1e-6&&length<=3}
})
await mkdir('dist/checks',{recursive:true})
await writeFile('dist/checks/decoupling.json',JSON.stringify(results,null,2)+'\n')
for(const result of results)console.log(`${result.passed?'PASS':'FAIL'} ${result.capacitor} → ${result.pin}: ${result.topLayerLengthMm?.toFixed(3)??'no continuous top route'} mm`)
if(results.some(r=>!r.passed))process.exitCode=1
