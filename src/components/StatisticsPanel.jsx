const COMPLEXITY = {
  bubble:    { best: 'O(n)',       average: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)' },
  selection: { best: 'O(n²)',      average: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)' },
  insertion: { best: 'O(n)',       average: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)' },
  merge:     { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  quick:     { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)',      space: 'O(log n)' },
  heap:      { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
  counting:  { best: 'O(n+k)',     average: 'O(n+k)',     worst: 'O(n+k)',     space: 'O(k)' },
  linear:    { best: 'O(1)',       average: 'O(n)',        worst: 'O(n)',       space: 'O(1)' },
  binary:    { best: 'O(1)',       average: 'O(log n)',    worst: 'O(log n)',   space: 'O(1)' },
  bfs:       { best: 'O(V+E)',     average: 'O(V+E)',      worst: 'O(V+E)',     space: 'O(V)' },
  dfs:       { best: 'O(V+E)',     average: 'O(V+E)',      worst: 'O(V+E)',     space: 'O(V)' },
  dijkstra:  { best: 'O(V²)',      average: 'O(V²)',       worst: 'O(V²)',      space: 'O(V)' },
  bttree:    { best: 'O(n)',       average: 'O(n)',         worst: 'O(n)',       space: 'O(h)' },
  bst:       { best: 'O(log n)',   average: 'O(log n)',    worst: 'O(n)',       space: 'O(n)' },
  astar:     { best: 'O(E)',       average: 'O(E log V)',  worst: 'O(E log V)', space: 'O(V)' },
  maze:      { best: 'O(V+E)',     average: 'O(V+E)',      worst: 'O(V+E)',     space: 'O(V)' },
}

const GRAPH_SUPPORTED = new Set(['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap', 'counting', 'shell', 'linear', 'binary'])

const ALGO_NAMES = {
  bubble: 'Bubble Sort', selection: 'Selection Sort', insertion: 'Insertion Sort',
  merge: 'Merge Sort', quick: 'Quick Sort', heap: 'Heap Sort', counting: 'Counting Sort',
  linear: 'Linear Search', binary: 'Binary Search',
  bfs: 'BFS', dfs: 'DFS', dijkstra: "Dijkstra's",
  bttree: 'Tree Traversal', bst: 'BST Operations',
  astar: 'A* Algorithm', maze: 'Maze Solver',
}

function curveValue(complexity, n) {
  const label = String(complexity ?? '').toLowerCase()
  const safeN = Math.max(1, n)

  if (label.includes('n²') || label.includes('n^2') || label.includes('v²') || label.includes('v^2')) {
    return safeN * safeN
  }
  if (label.includes('n log n') || label.includes('e log v')) {
    return safeN * Math.log2(Math.max(2, safeN))
  }
  if (label.includes('log n')) {
    return Math.log2(Math.max(2, safeN))
  }
  if (label.includes('n+k') || label.includes('v+e') || label.includes('o(n)') || label.includes('o(e)')) {
    return safeN
  }
  if (label.includes('o(1)')) {
    return 1
  }
  return safeN
}

function ComplexityTrendGraph({ samples, expectedComplexity }) {
  if (!samples.length) {
    return <p className="cx-graph-empty">Run the algorithm with different input sizes to plot a complexity trend.</p>
  }

  const sorted = [...samples].sort((a, b) => a.n - b.n)
  const width = 260
  const height = 140
  const pad = 24
  const nMin = Math.min(...sorted.map((s) => s.n))
  const nMax = Math.max(...sorted.map((s) => s.n))
  const measuredMax = Math.max(...sorted.map((s) => s.operations), 1)
  const expectedRaw = sorted.map((s) => curveValue(expectedComplexity, s.n))
  const expectedMax = Math.max(...expectedRaw, 1)
  const expectedScale = measuredMax / expectedMax

  const xAt = (n) => {
    if (nMax === nMin) return width / 2
    return pad + ((n - nMin) / (nMax - nMin)) * (width - pad * 2)
  }

  const yAt = (v) => {
    const clamped = Math.max(0, v)
    return height - pad - (clamped / measuredMax) * (height - pad * 2)
  }

  const measuredPoints = sorted.map((s) => `${xAt(s.n)},${yAt(s.operations)}`).join(' ')
  const expectedPoints = sorted
    .map((s, i) => `${xAt(s.n)},${yAt(expectedRaw[i] * expectedScale)}`)
    .join(' ')

  return (
    <div className="cx-graph-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="cx-graph" role="img" aria-label="Complexity trend graph">
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} className="cx-axis" />
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} className="cx-axis" />
        <polyline points={expectedPoints} className="cx-line-expected" />
        <polyline points={measuredPoints} className="cx-line-measured" />
        {sorted.map((sample) => (
          <circle
            key={`${sample.n}-${sample.timestamp ?? sample.operations}`}
            cx={xAt(sample.n)}
            cy={yAt(sample.operations)}
            r={sample.live ? 4 : 3}
            className={sample.live ? 'cx-dot-live' : 'cx-dot'}
          />
        ))}
      </svg>
      <div className="cx-graph-legend">
        <span><i className="cx-mark measured" />Measured ops</span>
        <span><i className="cx-mark expected" />Expected {expectedComplexity}</span>
      </div>
      <div className="cx-graph-scale">
        <span>n: {nMin} - {nMax}</span>
        <span>ops max: {measuredMax}</span>
      </div>
    </div>
  )
}

export default function StatisticsPanel({ algorithmKey, comparisons, swaps, currentStep, totalSteps, elapsedMs, complexitySamples = [], currentInputSize = 0 }) {
  const cx = COMPLEXITY[algorithmKey] ?? {}
  const name = ALGO_NAMES[algorithmKey] ?? algorithmKey
  const liveOps = comparisons + swaps
  const samplesForGraph = (() => {
    const base = Array.isArray(complexitySamples) ? complexitySamples : []
    if (!GRAPH_SUPPORTED.has(algorithmKey)) return []
    if (currentInputSize > 0 && liveOps > 0) {
      return [...base, { n: currentInputSize, operations: liveOps, live: true, timestamp: 'live' }]
    }
    return base
  })()

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
        Statistics
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
          <span className="stat-label">Algorithm</span>
          <span className="stat-value stat-name">{name}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Comparisons</span>
          <span className="stat-value compare-color">{comparisons}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Swaps / Writes</span>
          <span className="stat-value swap-color">{swaps}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Step</span>
          <span className="stat-value">{currentStep < 0 ? '–' : `${currentStep + 1} / ${totalSteps}`}</span>
        </div>
        {elapsedMs > 0 && (
          <div className="stat-card">
            <span className="stat-label">Exec Time</span>
            <span className="stat-value">{elapsedMs} ms</span>
          </div>
        )}
      </div>

      <div className="complexity-block">
        <div className="complexity-title">Time Complexity</div>
        <div className="complexity-row"><span className="cx-label">Best</span><span className="cx-val cx-best">{cx.best}</span></div>
        <div className="complexity-row"><span className="cx-label">Average</span><span className="cx-val cx-avg">{cx.average}</span></div>
        <div className="complexity-row"><span className="cx-label">Worst</span><span className="cx-val cx-worst">{cx.worst}</span></div>
        <div className="complexity-row"><span className="cx-label">Space</span><span className="cx-val cx-space">{cx.space}</span></div>
      </div>

      <div className="complexity-block">
        <div className="complexity-title">Complexity Trend</div>
        {GRAPH_SUPPORTED.has(algorithmKey) ? (
          <ComplexityTrendGraph samples={samplesForGraph} expectedComplexity={cx.average ?? 'O(n)'} />
        ) : (
          <p className="cx-graph-empty">Trend graph is available for array sorting and searching algorithms.</p>
        )}
      </div>
    </div>
  )
}
