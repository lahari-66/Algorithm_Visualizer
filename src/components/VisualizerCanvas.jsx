import ArrayBarVisualizer from './ArrayBarVisualizer.jsx'
import ArrayCellVisualizer from './ArrayCellVisualizer.jsx'
import MergeSortVisualizer from './MergeSortVisualizer.jsx'
import HeapSortVisualizer from './HeapSortVisualizer.jsx'

// Algorithms that use bar chart
const BAR_ALGOS = new Set(['bubble', 'quick', 'insertion', 'selection'])
// Algorithms that use cell/box array
const CELL_ALGOS = new Set(['linear', 'binary'])
// Special visualizers
const MERGE_ALGOS = new Set(['merge'])
const HEAP_ALGOS = new Set(['heap'])

export default function VisualizerCanvas({ algorithmKey, baseArray, vizState, steps, stepIndex }) {
  if (!vizState && !baseArray.length) {
    return (
      <div className="vc-empty">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 9h18M9 21V9" />
        </svg>
        <p>Run an algorithm to see the visualization.</p>
      </div>
    )
  }

  const values = vizState?.values ?? baseArray
  const actionIndices = vizState?.actionIndices ?? []
  const sortedIndices = vizState?.sortedIndices ?? []
  const foundIndex = vizState?.foundIndex ?? null
  const activeRange = vizState?.activeRange ?? null
  const pointers = vizState?.pointers ?? []
  const lastType = vizState?.lastType ?? null
  const isDone = vizState?.isDone ?? false

  if (MERGE_ALGOS.has(algorithmKey)) {
    return (
      <MergeSortVisualizer
        baseArray={baseArray}
        values={values}
        actionIndices={actionIndices}
        sortedIndices={sortedIndices}
        activeRange={activeRange}
        pointers={pointers}
        lastType={lastType}
        isDone={isDone}
        steps={steps}
        stepIndex={stepIndex}
      />
    )
  }

  if (HEAP_ALGOS.has(algorithmKey)) {
    return (
      <HeapSortVisualizer
        values={values}
        actionIndices={actionIndices}
        sortedIndices={sortedIndices}
        activeRange={activeRange}
        pointers={pointers}
        isDone={isDone}
      />
    )
  }

  if (CELL_ALGOS.has(algorithmKey)) {
    return (
      <ArrayCellVisualizer
        values={values}
        actionIndices={actionIndices}
        sortedIndices={sortedIndices}
        foundIndex={foundIndex}
        activeRange={activeRange}
        pointers={pointers}
        lastType={lastType}
        isDone={isDone}
      />
    )
  }

  // Default: bar chart for sorting algorithms
  return (
    <ArrayBarVisualizer
      values={values}
      actionIndices={actionIndices}
      sortedIndices={sortedIndices}
      foundIndex={foundIndex}
      activeRange={activeRange}
      pointers={pointers}
      lastType={lastType}
      isDone={isDone}
    />
  )
}
