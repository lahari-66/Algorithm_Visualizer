import { useMemo } from 'react'

// Compute SVG positions for a binary tree stored as 1-indexed array
function computePositions(n) {
  const positions = {}
  for (let i = 1; i <= n; i++) {
    const level = Math.floor(Math.log2(i))
    const levelStart = Math.pow(2, level)
    const levelIdx = i - levelStart
    const nodesInLevel = Math.pow(2, level)
    const maxLevel = Math.floor(Math.log2(n)) + 1
    positions[i] = {
      x: ((levelIdx + 0.5) / nodesInLevel) * 90 + 5,
      y: ((level + 0.5) / maxLevel) * 88 + 4,
    }
  }
  return positions
}

function nodeColor(nodeIdx, step) {
  if (!step) return { fill: '#1e293b', stroke: '#334155', text: '#94a3b8' }
  const curr = step.node
  const from = step.from

  if (nodeIdx === curr) {
    if (step.type === 'VISIT') return { fill: '#065f46', stroke: '#34d399', text: '#6ee7b7', glow: true }
    if (step.type === 'BACKTRACK') return { fill: '#7c3aed', stroke: '#a78bfa', text: '#ddd6fe', glow: true }
    return { fill: '#1d4ed8', stroke: '#60a5fa', text: '#fff', glow: true }
  }
  if (nodeIdx === from) return { fill: '#92400e', stroke: '#fb923c', text: '#fed7aa' }
  return { fill: '#1e293b', stroke: '#334155', text: '#94a3b8' }
}

export default function TreeVisualizer({ step, tree }) {
  const values = tree?.values ?? [4, 2, 6, 1, 3, 5, 7]
  const n = values.length
  const positions = useMemo(() => computePositions(n), [n])

  const r = Math.max(3.5, Math.min(5.5, 40 / Math.max(n, 1)))

  // Build traversal path from visited steps
  const visitedNodes = useMemo(() => {
    if (!step) return []
    // We don't have full history here, just show current node highlighted
    return []
  }, [step])

  return (
    <div className="tv-root">
      <div className="tv-legend">
        <span className="tv-pill tv-pill-visit">Visiting</span>
        <span className="tv-pill tv-pill-from">Parent</span>
        <span className="tv-pill tv-pill-back">Backtrack</span>
        <span className="tv-pill tv-pill-default">Unvisited</span>
      </div>

      <div className="tv-body">
        <div className="tv-svg-wrap">
          <svg viewBox="0 0 100 96" className="tv-svg" preserveAspectRatio="xMidYMid meet">
            {/* Edges */}
            {Array.from({ length: n }, (_, i) => {
              const nodeIdx = i + 1
              const parentIdx = Math.floor(nodeIdx / 2)
              if (parentIdx < 1) return null
              const p = positions[parentIdx], c = positions[nodeIdx]
              if (!p || !c) return null
              return (
                <line key={nodeIdx}
                  x1={p.x} y1={p.y} x2={c.x} y2={c.y}
                  stroke="rgba(148,163,184,0.2)" strokeWidth="0.5" />
              )
            })}

            {/* Nodes */}
            {Array.from({ length: n }, (_, i) => {
              const nodeIdx = i + 1
              const pos = positions[nodeIdx]
              if (!pos) return null
              const c = nodeColor(nodeIdx, step)
              return (
                <g key={nodeIdx}>
                  {c.glow && (
                    <circle cx={pos.x} cy={pos.y} r={r + 2.5}
                      fill={c.fill + '33'} stroke="none" />
                  )}
                  <circle cx={pos.x} cy={pos.y} r={r}
                    fill={c.fill} stroke={c.stroke} strokeWidth="0.9" />
                  <text x={pos.x} y={pos.y + r * 0.38} textAnchor="middle"
                    fontSize={r * 0.85} fill={c.text}
                    fontFamily="'IBM Plex Mono',monospace" fontWeight="700">
                    {values[i]}
                  </text>
                  {/* Node index label */}
                  <text x={pos.x + r + 1} y={pos.y - r + 1} textAnchor="start"
                    fontSize="2.4" fill="rgba(148,163,184,0.5)"
                    fontFamily="'IBM Plex Mono',monospace">
                    [{nodeIdx}]
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Step info panel */}
        <div className="tv-info">
          {step && (
            <>
              <div className="tv-info-row">
                <span className="tv-info-label">Action</span>
                <span className={`tv-info-badge tv-badge-${step.type?.toLowerCase()}`}>{step.type}</span>
              </div>
              {step.node != null && (
                <div className="tv-info-row">
                  <span className="tv-info-label">Node</span>
                  <span className="tv-info-val">{step.node} = {values[step.node - 1]}</span>
                </div>
              )}
              {step.depth != null && (
                <div className="tv-info-row">
                  <span className="tv-info-label">Depth</span>
                  <span className="tv-info-val">{step.depth}</span>
                </div>
              )}
              {step.direction && (
                <div className="tv-info-row">
                  <span className="tv-info-label">Direction</span>
                  <span className="tv-info-val">{step.direction}</span>
                </div>
              )}
            </>
          )}

          {/* Array representation */}
          <div className="tv-array-label">Array Representation</div>
          <div className="tv-array-row">
            {values.map((v, i) => {
              const nodeIdx = i + 1
              const isActive = step?.node === nodeIdx
              return (
                <div key={i} className={`tv-array-cell${isActive ? ' tv-array-active' : ''}`}>
                  <span className="tv-array-val">{v}</span>
                  <span className="tv-array-idx">{nodeIdx}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
