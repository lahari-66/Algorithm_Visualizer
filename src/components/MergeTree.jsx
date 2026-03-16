function MergeTree({ values, activeRange, mergeState }) {
  if (!values.length) return null

  const nodes = []
  const maxDepth = Math.ceil(Math.log2(values.length + 1))

  const build = (start, end, depth) => {
    const mid = Math.floor((start + end) / 2)
    nodes.push({ start, end, mid, depth })
    if (start >= end) return
    build(start, mid, depth + 1)
    build(mid + 1, end, depth + 1)
  }
  build(0, values.length - 1, 0)

  const getPos = (node) => ({
    x: ((node.start + node.end + 1) / 2 / values.length) * 96 + 2,
    y: ((node.depth + 0.6) / (maxDepth + 1)) * 88 + 4,
  })

  const isActive = (node) =>
    activeRange ? node.start >= activeRange[0] && node.end <= activeRange[1] : false

  const getPhaseClass = (node) => {
    if (!isActive(node)) return ''
    if (mergeState?.phase && mergeState.phase !== 'start') return 'merge'
    if (node.start === node.end) return 'sort'
    return 'split'
  }

  const phaseLabel = mergeState?.phase && mergeState.phase !== 'start'
    ? 'Merging'
    : activeRange && activeRange[0] === activeRange[1]
      ? 'Base case'
      : activeRange
        ? 'Splitting'
        : ''

  const phaseClass = mergeState?.phase && mergeState.phase !== 'start'
    ? 'merge'
    : activeRange && activeRange[0] === activeRange[1]
      ? 'sort'
      : 'split'

  // cell sizing
  const cellW = Math.max(2.5, Math.min(5.5, 80 / values.length))
  const cellH = 6
  const gap = 0.5

  return (
    <div className="merge-tree">
      <div className="merge-header">
        <h4 className="merge-title">Merge Split Tree</h4>
        {phaseLabel ? <span className={`merge-phase ${phaseClass}`}>{phaseLabel}</span> : null}
      </div>
      <div className="merge-body">
        <div className="merge-rail">
          <div className="merge-rail-block divide">Divide</div>
          <div className="merge-rail-block merge">Merge</div>
        </div>
        <svg viewBox="0 0 100 96" className="merge-svg" preserveAspectRatio="xMidYMid meet">
          {/* connector lines */}
          {nodes.map((node) => {
            if (node.start >= node.end) return null
            const parentPos = getPos(node)
            const left = { start: node.start, end: node.mid, depth: node.depth + 1 }
            const right = { start: node.mid + 1, end: node.end, depth: node.depth + 1 }
            const leftPos = getPos(left)
            const rightPos = getPos(right)
            const active = isActive(node)
            return (
              <g key={`line-${node.start}-${node.end}`}>
                <line
                  x1={parentPos.x} y1={parentPos.y + cellH / 2}
                  x2={leftPos.x} y2={leftPos.y - cellH / 2}
                  stroke={active ? 'rgba(56,189,248,0.5)' : 'rgba(148,163,184,0.2)'}
                  strokeWidth={active ? '0.7' : '0.4'}
                />
                <line
                  x1={parentPos.x} y1={parentPos.y + cellH / 2}
                  x2={rightPos.x} y2={rightPos.y - cellH / 2}
                  stroke={active ? 'rgba(56,189,248,0.5)' : 'rgba(148,163,184,0.2)'}
                  strokeWidth={active ? '0.7' : '0.4'}
                />
              </g>
            )
          })}

          {/* node cells */}
          {nodes.map((node) => {
            const pos = getPos(node)
            const nodeValues = values.slice(node.start, node.end + 1)
            const totalW = cellW * nodeValues.length + gap * (nodeValues.length - 1)
            const startX = pos.x - totalW / 2
            const phase = getPhaseClass(node)
            const active = isActive(node)

            return (
              <g key={`node-${node.start}-${node.end}`}>
                {nodeValues.map((val, idx) => {
                  const x = startX + idx * (cellW + gap)
                  let fill = 'rgba(15,23,42,0.9)'
                  let stroke = 'rgba(56,189,248,0.25)'
                  if (active) {
                    if (phase === 'merge') { fill = 'rgba(251,146,60,0.25)'; stroke = 'rgba(251,146,60,0.8)' }
                    else if (phase === 'sort') { fill = 'rgba(34,197,94,0.25)'; stroke = 'rgba(34,197,94,0.8)' }
                    else { fill = 'rgba(250,204,21,0.2)'; stroke = 'rgba(250,204,21,0.8)' }
                  }
                  return (
                    <g key={`cell-${node.start}-${node.end}-${idx}`}>
                      <rect
                        x={x} y={pos.y - cellH / 2}
                        width={cellW} height={cellH}
                        rx={1.2}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth="0.5"
                        style={active ? { filter: 'drop-shadow(0 0 2px rgba(56,189,248,0.4))' } : undefined}
                      />
                      <text
                        x={x + cellW / 2}
                        y={pos.y + 1.6}
                        textAnchor="middle"
                        fontSize={Math.min(3.2, cellW * 0.7)}
                        fill={active ? '#f1f5f9' : '#64748b'}
                        fontFamily="'IBM Plex Mono', monospace"
                        fontWeight={active ? '600' : '400'}
                      >
                        {val}
                      </text>
                    </g>
                  )
                })}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export default MergeTree
