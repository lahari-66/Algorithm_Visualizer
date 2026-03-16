function HeapTree({ values, highlightIndices = [], activeRange }) {
  if (!values.length) return null

  const nodes = values.map((value, index) => {
    const level = Math.floor(Math.log2(index + 1))
    const levelStart = Math.pow(2, level) - 1
    const levelIndex = index - levelStart
    const nodesInLevel = Math.pow(2, level)
    const x = ((levelIndex + 0.5) / nodesInLevel) * 96 + 2
    const maxLevels = Math.floor(Math.log2(values.length + 1)) + 1
    const y = ((level + 0.5) / maxLevels) * 88 + 4
    return { index, value, x, y, level }
  })

  const lines = nodes.flatMap((node) => {
    const left = 2 * node.index + 1
    const right = 2 * node.index + 2
    const connections = []
    if (left < nodes.length) connections.push([node, nodes[left]])
    if (right < nodes.length) connections.push([node, nodes[right]])
    return connections
  })

  const r = Math.max(2.8, Math.min(4.5, 40 / Math.max(values.length, 1)))

  return (
    <div className="heap-tree-wrap">
      <div className="tree-header">
        <h4 className="tree-title">Heap Tree</h4>
        {activeRange ? (
          <span className="tree-badge">Heap size: {activeRange[1] + 1}</span>
        ) : null}
      </div>
      <svg viewBox="0 0 100 96" className="tree-svg" preserveAspectRatio="xMidYMid meet">
        {lines.map(([from, to]) => {
          const fromActive = highlightIndices.includes(from.index)
          const toActive = highlightIndices.includes(to.index)
          return (
            <line
              key={`${from.index}-${to.index}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={fromActive && toActive ? 'rgba(52,211,153,0.6)' : 'rgba(148,163,184,0.25)'}
              strokeWidth={fromActive && toActive ? '0.8' : '0.5'}
            />
          )
        })}
        {nodes.map((node) => {
          const isActive = highlightIndices.includes(node.index)
          const isDimmed = activeRange && (node.index < activeRange[0] || node.index > activeRange[1])
          const fill = isActive ? '#059669' : isDimmed ? '#0f172a' : '#1e293b'
          const stroke = isActive ? '#34d399' : isDimmed ? '#1f2937' : '#334155'
          const textFill = isActive ? '#ecfdf5' : isDimmed ? '#475569' : '#cbd5e1'
          return (
            <g key={node.index} opacity={isDimmed ? 0.3 : 1}>
              <circle
                cx={node.x}
                cy={node.y}
                r={r}
                fill={fill}
                stroke={stroke}
                strokeWidth="0.7"
                style={isActive ? { filter: 'drop-shadow(0 0 3px rgba(52,211,153,0.7))' } : undefined}
              />
              <text
                x={node.x}
                y={node.y + r * 0.42}
                textAnchor="middle"
                fontSize={r * 0.85}
                fill={textFill}
                fontFamily="'IBM Plex Mono', monospace"
                fontWeight={isActive ? '700' : '400'}
              >
                {node.value}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default HeapTree
