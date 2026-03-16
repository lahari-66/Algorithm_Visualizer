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

const ALGO_NAMES = {
  bubble: 'Bubble Sort', selection: 'Selection Sort', insertion: 'Insertion Sort',
  merge: 'Merge Sort', quick: 'Quick Sort', heap: 'Heap Sort', counting: 'Counting Sort',
  linear: 'Linear Search', binary: 'Binary Search',
  bfs: 'BFS', dfs: 'DFS', dijkstra: "Dijkstra's",
  bttree: 'Tree Traversal', bst: 'BST Operations',
  astar: 'A* Algorithm', maze: 'Maze Solver',
}

export default function StatisticsPanel({ algorithmKey, comparisons, swaps, currentStep, totalSteps, elapsedMs }) {
  const cx = COMPLEXITY[algorithmKey] ?? {}
  const name = ALGO_NAMES[algorithmKey] ?? algorithmKey

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
    </div>
  )
}
