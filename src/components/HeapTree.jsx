function HeapTree({ values, highlightIndices = [] }) {
  const nodes = values.map((value, index) => {
    const level = Math.floor(Math.log2(index + 1))
    const levelStart = Math.pow(2, level) - 1
    const levelIndex = index - levelStart
    const nodesInLevel = Math.pow(2, level)
    const x = (levelIndex + 0.5) / nodesInLevel
    const y = (level + 0.5) / (Math.log2(values.length + 1) + 1)
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

  return (
    <div className="w-full rounded-2xl border border-emerald-400/20 bg-emerald-500/5 px-3 py-4">
      <h4 className="text-xs uppercase tracking-[0.3em] text-emerald-200">Heap Tree</h4>
      <svg viewBox="0 0 100 60" className="mt-3 h-44 w-full">
        {lines.map(([from, to]) => (
          <line
            key={`${from.index}-${to.index}`}
            x1={from.x * 100}
            y1={from.y * 60}
            x2={to.x * 100}
            y2={to.y * 60}
            stroke="rgba(148,163,184,0.3)"
            strokeWidth="0.6"
          />
        ))}
        {nodes.map((node) => {
          const isActive = highlightIndices.includes(node.index)
          return (
            <g key={node.index}>
              <circle
                cx={node.x * 100}
                cy={node.y * 60}
                r={3.8}
                fill={isActive ? '#34d399' : '#0f172a'}
                stroke={isActive ? '#6ee7b7' : '#1f2937'}
                strokeWidth="0.6"
              />
              <text
                x={node.x * 100}
                y={node.y * 60 + 1.6}
                textAnchor="middle"
                fontSize="3.2"
                fill={isActive ? '#052e1f' : '#e2e8f0'}
                fontFamily="'IBM Plex Mono', monospace"
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
