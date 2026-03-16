const COMPLEXITY = {
  bubble: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  merge:  { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  quick:  { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
  heap:   { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
  linear: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  binary: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
}

const ALGO_NAMES = {
  bubble: 'Bubble Sort', merge: 'Merge Sort', quick: 'Quick Sort',
  heap: 'Heap Sort', linear: 'Linear Search', binary: 'Binary Search',
}

function StatisticsPanel({ algorithmKey, comparisons, swaps, currentStep, totalSteps, elapsedMs }) {
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
        <div className="stat-card">
          <span className="stat-label">Algorithm</span>
          <span className="stat-value stat-name">{name}</span>
        </div>
        <div className="stat-card compare-card">
          <span className="stat-label">Comparisons</span>
          <span className="stat-value">{comparisons}</span>
        </div>
        <div className="stat-card swap-card">
          <span className="stat-label">Swaps / Writes</span>
          <span className="stat-value">{swaps}</span>
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
        <div className="complexity-row">
          <span className="cx-label">Best</span>
          <span className="cx-val cx-best">{cx.best}</span>
        </div>
        <div className="complexity-row">
          <span className="cx-label">Average</span>
          <span className="cx-val cx-avg">{cx.average}</span>
        </div>
        <div className="complexity-row">
          <span className="cx-label">Worst</span>
          <span className="cx-val cx-worst">{cx.worst}</span>
        </div>
        <div className="complexity-row">
          <span className="cx-label">Space</span>
          <span className="cx-val cx-space">{cx.space}</span>
        </div>
      </div>
    </div>
  )
}

export default StatisticsPanel
