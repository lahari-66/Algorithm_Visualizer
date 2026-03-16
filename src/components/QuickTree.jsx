function QuickTree({ values, steps, currentIndex, activeRange, pivotIndex }) {
  if (!values.length) return null

  const nodes = []
  const nodeMap = new Map()
  const stack = []

  const maxIndex = Math.min(currentIndex ?? -1, steps.length - 1)
  for (let i = 0; i <= maxIndex; i += 1) {
    const step = steps[i]
    if (!step || step.type !== 'RANGE') continue
    const [start, end] = step.indices
    while (
      stack.length &&
      !(start >= stack[stack.length - 1].start && end <= stack[stack.length - 1].end)
    ) {
      stack.pop()
    }
    const depth = stack.length
    const key = `${start}-${end}`
    if (!nodeMap.has(key)) {
      const node = { start, end, depth }
      nodeMap.set(key, node)
      nodes.push(node)
      stack.push(node)
    }
  }

  if (!nodes.length) return null

  const maxDepth = Math.max(...nodes.map((n) => n.depth), 0)

  const getPos = (node) => ({
    x: ((node.start + node.end + 1) / 2 / values.length) * 94 + 3,
    y: ((node.depth + 0.6) / (maxDepth + 2)) * 84 + 6,
  })

  const getWidth = (node) =>
    Math.max(5, ((node.end - node.start + 1) / values.length) * 80)

  const isActive = (node) =>
    activeRange ? node.start === activeRange[0] && node.end === activeRange[1] : false

  return (
    <div className="quick-tree">
      <div className="quick-tree-header">
        <h4 className="quick-tree-title">Quick Sort Partition Tree</h4>
        {activeRange ? (
          <span className="quick-tree-range">
            Range [{activeRange[0] + 1}–{activeRange[1] + 1}]
          </span>
        ) : null}
      </div>
      <svg viewBox="0 0 100 96" className="quick-tree-svg" preserveAspectRatio="xMidYMid meet">
        {/* connector lines */}
        {nodes.map((node) => {
          if (node.start >= node.end) return null
          const parentPos = getPos(node)
          const mid = Math.floor((node.start + node.end) / 2)
          const left = { start: node.start, end: mid, depth: node.depth + 1 }
          const right = { start: mid + 1, end: node.end, depth: node.depth + 1 }
          const leftPos = getPos(left)
          const rightPos = getPos(right)
          const active = isActive(node)
          return (
            <g key={`line-${node.start}-${node.end}`}>
              <line
                x1={parentPos.x} y1={parentPos.y + 4}
                x2={leftPos.x} y2={leftPos.y - 4}
                stroke={active ? 'rgba(244,114,182,0.6)' : 'rgba(148,163,184,0.2)'}
                strokeWidth={active ? '0.8' : '0.4'}
              />
              <line
                x1={parentPos.x} y1={parentPos.y + 4}
                x2={rightPos.x} y2={rightPos.y - 4}
                stroke={active ? 'rgba(244,114,182,0.6)' : 'rgba(148,163,184,0.2)'}
                strokeWidth={active ? '0.8' : '0.4'}
              />
            </g>
          )
        })}

        {/* pivot vertical guide */}
        {pivotIndex !== null && pivotIndex !== undefined ? (
          <line
            x1={((pivotIndex + 0.5) / values.length) * 94 + 3}
            y1={2}
            x2={((pivotIndex + 0.5) / values.length) * 94 + 3}
            y2={94}
            stroke="rgba(244,114,182,0.35)"
            strokeWidth="0.6"
            strokeDasharray="2,2"
          />
        ) : null}

        {/* nodes */}
        {nodes.map((node) => {
          const pos = getPos(node)
          const w = getWidth(node)
          const active = isActive(node)
          const fill = active ? 'rgba(244,114,182,0.25)' : 'rgba(15,23,42,0.85)'
          const stroke = active ? 'rgba(244,114,182,0.9)' : 'rgba(148,163,184,0.3)'
          const textFill = active ? '#fce7f3' : '#64748b'
          return (
            <g key={`node-${node.start}-${node.end}`}>
              <rect
                x={pos.x - w / 2}
                y={pos.y - 4}
                width={w}
                height={8}
                rx={2}
                fill={fill}
                stroke={stroke}
                strokeWidth="0.6"
                style={active ? { filter: 'drop-shadow(0 0 3px rgba(244,114,182,0.5))' } : undefined}
              />
              <text
                x={pos.x}
                y={pos.y + 1.8}
                textAnchor="middle"
                fontSize={Math.min(3.5, w * 0.28)}
                fill={textFill}
                fontFamily="'IBM Plex Mono', monospace"
                fontWeight={active ? '700' : '400'}
              >
                {node.start + 1}–{node.end + 1}
              </text>
            </g>
          )
        })}

        {/* pivot marker dot */}
        {pivotIndex !== null && pivotIndex !== undefined ? (
          <circle
            cx={((pivotIndex + 0.5) / values.length) * 94 + 3}
            cy={4}
            r={2.5}
            fill="#f472b6"
            stroke="#fce7f3"
            strokeWidth="0.5"
          />
        ) : null}
      </svg>
    </div>
  )
}

export default QuickTree
