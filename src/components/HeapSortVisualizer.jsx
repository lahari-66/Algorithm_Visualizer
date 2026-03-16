import { useMemo } from 'react'

export default function HeapSortVisualizer({ values, actionIndices = [], sortedIndices = [], activeRange = null, pointers = [], isDone = false }) {
  // heap size = activeRange[1]+1 or full array if no range
  const heapSize = activeRange ? activeRange[1] + 1 : values.length
  const heapValues = values.slice(0, heapSize)
  const sortedValues = values.slice(heapSize) // extracted elements

  const pointerMap = useMemo(() => {
    const m = new Map()
    pointers.forEach((p) => {
      if (p.index == null) return
      if (!m.has(p.index)) m.set(p.index, [])
      m.get(p.index).push(p.label)
    })
    return m
  }, [pointers])

  // Build tree nodes from heap array
  const nodes = heapValues.map((val, i) => {
    const level = Math.floor(Math.log2(i + 1))
    const levelStart = Math.pow(2, level) - 1
    const levelIdx = i - levelStart
    const nodesInLevel = Math.pow(2, level)
    const maxLevels = Math.floor(Math.log2(heapValues.length + 1)) + 1
    return {
      i, val, level,
      x: ((levelIdx + 0.5) / nodesInLevel) * 94 + 3,
      y: ((level + 0.6) / maxLevels) * 88 + 4,
    }
  })

  const edges = nodes.flatMap((n) => {
    const res = []
    const li = 2 * n.i + 1
    const ri = 2 * n.i + 2
    if (li < nodes.length) res.push([n, nodes[li]])
    if (ri < nodes.length) res.push([n, nodes[ri]])
    return res
  })

  const r = Math.max(3, Math.min(5.5, 44 / Math.max(heapValues.length, 1)))

  return (
    <div className="hsv-root">
      {/* Heap tree */}
      <div className="hsv-tree-wrap">
        <div className="hsv-section-label">Binary Heap Tree</div>
        {heapValues.length > 0 ? (
          <svg viewBox="0 0 100 96" className="hsv-svg" preserveAspectRatio="xMidYMid meet">
            {edges.map(([from, to]) => {
              const fromAct = actionIndices.includes(from.i)
              const toAct = actionIndices.includes(to.i)
              return (
                <line
                  key={`${from.i}-${to.i}`}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={fromAct && toAct ? 'rgba(251,191,36,0.7)' : 'rgba(148,163,184,0.25)'}
                  strokeWidth={fromAct && toAct ? '0.9' : '0.5'}
                />
              )
            })}
            {nodes.map((n) => {
              const isAct = actionIndices.includes(n.i)
              const isPtr = pointerMap.has(n.i)
              const labels = pointerMap.get(n.i) || []
              const fill = isAct ? '#d97706' : isPtr ? '#0891b2' : '#1e293b'
              const stroke = isAct ? '#fbbf24' : isPtr ? '#22d3ee' : '#334155'
              const textFill = isAct || isPtr ? '#fff' : '#cbd5e1'
              return (
                <g key={n.i}>
                  <circle
                    cx={n.x} cy={n.y} r={r}
                    fill={fill} stroke={stroke} strokeWidth="0.8"
                    style={isAct ? { filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.8))' } : isPtr ? { filter: 'drop-shadow(0 0 3px rgba(34,211,238,0.6))' } : undefined}
                  />
                  <text x={n.x} y={n.y + r * 0.4} textAnchor="middle"
                    fontSize={r * 0.82} fill={textFill}
                    fontFamily="'IBM Plex Mono',monospace" fontWeight={isAct ? '700' : '400'}
                  >{n.val}</text>
                  {labels.map((lbl, li) => (
                    <text key={lbl} x={n.x} y={n.y - r - 1.5 - li * 3.5}
                      textAnchor="middle" fontSize="2.8" fill="#67e8f9"
                      fontFamily="'IBM Plex Mono',monospace" fontWeight="700"
                    >{lbl}</text>
                  ))}
                </g>
              )
            })}
          </svg>
        ) : (
          <div className="hsv-empty">Heap is empty — all elements sorted.</div>
        )}
      </div>

      {/* Array representation below tree */}
      <div className="hsv-array-row">
        <div className="hsv-section-label">Heap Array</div>
        <div className="hsv-cells">
          {heapValues.map((v, i) => {
            const isAct = actionIndices.includes(i)
            const isPtr = pointerMap.has(i)
            return (
              <div key={i} className={`hsv-cell${isAct ? ' hsv-cell-act' : isPtr ? ' hsv-cell-ptr' : ''}`}>
                <span className="hsv-cell-val">{v}</span>
                <span className="hsv-cell-idx">{i}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sorted output area */}
      {(sortedValues.length > 0 || isDone) && (
        <div className="hsv-sorted-area">
          <div className="hsv-section-label">✓ Sorted Output</div>
          <div className="hsv-sorted-cells">
            {(isDone ? values : sortedValues).map((v, i) => (
              <div key={i} className="hsv-sorted-cell">
                <span className="hsv-cell-val">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
