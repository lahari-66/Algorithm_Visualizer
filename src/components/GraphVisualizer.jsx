import { useMemo } from 'react'

// Fixed node positions for the default 7-node graph (0..6)
const NODE_POSITIONS_7 = [
  { x: 50, y: 12 },  // 0 — root
  { x: 25, y: 38 },  // 1
  { x: 75, y: 38 },  // 2
  { x: 12, y: 65 },  // 3
  { x: 38, y: 65 },  // 4
  { x: 62, y: 65 },  // 5
  { x: 88, y: 65 },  // 6
]

// Fixed positions for Dijkstra's 6-node graph (0..5)
const NODE_POSITIONS_6 = [
  { x: 20, y: 20 },  // 0
  { x: 60, y: 15 },  // 1
  { x: 20, y: 55 },  // 2
  { x: 60, y: 50 },  // 3
  { x: 85, y: 32 },  // 4
  { x: 85, y: 70 },  // 5
]

function getPositions(n) {
  if (n === 7) return NODE_POSITIONS_7
  if (n === 6) return NODE_POSITIONS_6
  // Generic circle layout
  return Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2
    return { x: 50 + 38 * Math.cos(angle), y: 50 + 38 * Math.sin(angle) }
  })
}

function nodeColor(i, step, algoType) {
  if (!step) return { fill: '#1e293b', stroke: '#334155', text: '#94a3b8' }
  const visited = step.visited ?? []
  const curr = step.node
  const queue = step.queue ?? []
  const stack = step.stack ?? []

  if (i === curr) return { fill: '#1d4ed8', stroke: '#60a5fa', text: '#fff', glow: true }
  if (visited[i]) return { fill: '#065f46', stroke: '#34d399', text: '#6ee7b7' }
  if (algoType === 'bfs' && queue.includes(i)) return { fill: '#92400e', stroke: '#fb923c', text: '#fed7aa' }
  if (algoType === 'dfs' && stack.includes(i)) return { fill: '#78350f', stroke: '#fbbf24', text: '#fde68a' }
  return { fill: '#1e293b', stroke: '#334155', text: '#94a3b8' }
}

function edgeColor(u, v, step) {
  if (!step) return 'rgba(148,163,184,0.2)'
  const visited = step.visited ?? []
  if (visited[u] && visited[v]) return 'rgba(52,211,153,0.5)'
  if (step.node === u || step.node === v) return 'rgba(96,165,250,0.6)'
  return 'rgba(148,163,184,0.2)'
}

// Queue display for BFS
function QueueDisplay({ queue }) {
  return (
    <div className="gv-aux-panel">
      <div className="gv-aux-label">Queue</div>
      <div className="gv-aux-cells">
        {queue.length === 0
          ? <span className="gv-aux-empty">empty</span>
          : queue.map((n, i) => <span key={i} className="gv-aux-cell gv-queue-cell">{n}</span>)
        }
      </div>
    </div>
  )
}

// Stack display for DFS
function StackDisplay({ stack }) {
  return (
    <div className="gv-aux-panel">
      <div className="gv-aux-label">Stack</div>
      <div className="gv-aux-cells">
        {stack.length === 0
          ? <span className="gv-aux-empty">empty</span>
          : [...stack].reverse().map((n, i) => <span key={i} className="gv-aux-cell gv-stack-cell">{n}</span>)
        }
      </div>
    </div>
  )
}

// Distance table for Dijkstra
function DistTable({ dist, visited, n }) {
  return (
    <div className="gv-aux-panel">
      <div className="gv-aux-label">Distances</div>
      <table className="gv-dist-table">
        <thead>
          <tr><th>Node</th><th>Dist</th><th>Status</th></tr>
        </thead>
        <tbody>
          {Array.from({ length: n }, (_, i) => (
            <tr key={i} className={visited?.[i] ? 'gv-dist-visited' : ''}>
              <td>{i}</td>
              <td className="gv-dist-val">{dist?.[i] === Infinity ? '∞' : dist?.[i] ?? '∞'}</td>
              <td>{visited?.[i] ? <span className="gv-dist-done">✓</span> : <span className="gv-dist-pend">–</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function GraphVisualizer({ algoType, step, graph }) {
  const { n = 7, edges = [] } = graph ?? {}
  const positions = useMemo(() => getPositions(n), [n])

  const isDijkstra = algoType === 'dijkstra'

  // Build edge weight map for Dijkstra
  const weightMap = useMemo(() => {
    const m = new Map()
    if (isDijkstra) {
      edges.forEach(([u, v, w]) => {
        m.set(`${u}-${v}`, w)
        m.set(`${v}-${u}`, w)
      })
    }
    return m
  }, [edges, isDijkstra])

  const r = n <= 7 ? 5.5 : 4.5

  return (
    <div className="gv-root">
      {/* Legend */}
      <div className="gv-legend">
        <span className="gv-pill gv-pill-current">Current</span>
        {algoType === 'bfs' && <span className="gv-pill gv-pill-queued">In Queue</span>}
        {algoType === 'dfs' && <span className="gv-pill gv-pill-stacked">In Stack</span>}
        <span className="gv-pill gv-pill-visited">Visited</span>
        <span className="gv-pill gv-pill-unvisited">Unvisited</span>
      </div>

      <div className="gv-body">
        {/* SVG graph */}
        <div className="gv-svg-wrap">
          <svg viewBox="0 0 100 82" className="gv-svg" preserveAspectRatio="xMidYMid meet">
            {/* Edges */}
            {edges.map(([u, v, w], ei) => {
              const pu = positions[u], pv = positions[v]
              if (!pu || !pv) return null
              const mx = (pu.x + pv.x) / 2
              const my = (pu.y + pv.y) / 2
              const col = edgeColor(u, v, step)
              return (
                <g key={ei}>
                  <line x1={pu.x} y1={pu.y} x2={pv.x} y2={pv.y}
                    stroke={col} strokeWidth={col.includes('0.2') ? '0.5' : '1'} />
                  {isDijkstra && w != null && (
                    <text x={mx} y={my - 1.5} textAnchor="middle"
                      fontSize="3.2" fill="#fbbf24" fontFamily="'IBM Plex Mono',monospace" fontWeight="700">
                      {w}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Nodes */}
            {positions.slice(0, n).map((pos, i) => {
              const c = nodeColor(i, step, algoType)
              return (
                <g key={i}>
                  {c.glow && (
                    <circle cx={pos.x} cy={pos.y} r={r + 2.5}
                      fill="rgba(96,165,250,0.18)" stroke="none" />
                  )}
                  <circle cx={pos.x} cy={pos.y} r={r}
                    fill={c.fill} stroke={c.stroke} strokeWidth="0.9" />
                  <text x={pos.x} y={pos.y + r * 0.38} textAnchor="middle"
                    fontSize={r * 0.85} fill={c.text}
                    fontFamily="'IBM Plex Mono',monospace" fontWeight="700">
                    {i}
                  </text>
                  {/* Distance label above node for Dijkstra */}
                  {isDijkstra && step?.dist && (
                    <text x={pos.x} y={pos.y - r - 1.5} textAnchor="middle"
                      fontSize="2.8" fill="#38bdf8"
                      fontFamily="'IBM Plex Mono',monospace">
                      {step.dist[i] === Infinity ? '∞' : step.dist[i]}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Auxiliary panel */}
        <div className="gv-aux">
          {algoType === 'bfs' && <QueueDisplay queue={step?.queue ?? []} />}
          {algoType === 'dfs' && <StackDisplay stack={step?.stack ?? []} />}
          {isDijkstra && <DistTable dist={step?.dist} visited={step?.visited} n={n} />}

          {/* Visited order */}
          <div className="gv-aux-panel">
            <div className="gv-aux-label">Visited Order</div>
            <div className="gv-aux-cells">
              {(step?.visited ?? []).map((v, i) => v ? i : null).filter(x => x !== null).length === 0
                ? <span className="gv-aux-empty">none yet</span>
                : (step?.visited ?? []).map((v, i) => v
                    ? <span key={i} className="gv-aux-cell gv-visited-cell">{i}</span>
                    : null
                  )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
