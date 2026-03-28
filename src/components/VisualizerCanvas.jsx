import ArrayBarVisualizer from './ArrayBarVisualizer.jsx'
import ArrayCellVisualizer from './ArrayCellVisualizer.jsx'
import MergeSortVisualizer from './MergeSortVisualizer.jsx'
import HeapSortVisualizer from './HeapSortVisualizer.jsx'
import GraphVisualizer from './GraphVisualizer.jsx'
import TreeVisualizer from './TreeVisualizer.jsx'
import PathVisualizer from './PathVisualizer.jsx'

const BAR_ALGOS   = new Set(['bubble', 'quick', 'insertion', 'selection', 'counting', 'shell'])
const CELL_ALGOS  = new Set(['linear', 'binary'])
const MERGE_ALGOS = new Set(['merge'])
const HEAP_ALGOS  = new Set(['heap'])
const GRAPH_ALGOS = new Set(['bfs', 'dfs', 'dijkstra'])
const TREE_ALGOS  = new Set(['bttree', 'bst'])
const PATH_ALGOS  = new Set(['astar', 'maze'])

export default function VisualizerCanvas({ algorithmKey, baseArray, vizState, steps, stepIndex, algoMeta }) {
  const isNonArray = GRAPH_ALGOS.has(algorithmKey) || TREE_ALGOS.has(algorithmKey) || PATH_ALGOS.has(algorithmKey)

  if (!vizState && !baseArray?.length && !isNonArray) {
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

  if (GRAPH_ALGOS.has(algorithmKey)) {
    return <GraphVisualizer algoType={algorithmKey} step={steps?.[stepIndex] ?? null} graph={algoMeta?.graph} />
  }

  if (TREE_ALGOS.has(algorithmKey)) {
    return <TreeVisualizer algoType={algorithmKey} step={steps?.[stepIndex] ?? null} tree={algoMeta?.tree} />
  }

  if (PATH_ALGOS.has(algorithmKey)) {
    return <PathVisualizer algoType={algorithmKey} step={steps?.[stepIndex] ?? null} pathMeta={algoMeta} />
  }

  const values       = vizState?.values       ?? baseArray
  const actionIndices = vizState?.actionIndices ?? []
  const sortedIndices = vizState?.sortedIndices ?? []
  const foundIndex   = vizState?.foundIndex    ?? null
  const activeRange  = vizState?.activeRange   ?? null
  const pointers     = vizState?.pointers      ?? []
  const lastType     = vizState?.lastType      ?? null
  const isDone       = vizState?.isDone        ?? false

  if (MERGE_ALGOS.has(algorithmKey)) {
    return (
      <MergeSortVisualizer baseArray={baseArray} values={values} actionIndices={actionIndices}
        sortedIndices={sortedIndices} activeRange={activeRange} pointers={pointers}
        lastType={lastType} isDone={isDone} steps={steps} stepIndex={stepIndex} />
    )
  }
  if (HEAP_ALGOS.has(algorithmKey)) {
    return (
      <HeapSortVisualizer values={values} actionIndices={actionIndices} sortedIndices={sortedIndices}
        activeRange={activeRange} pointers={pointers} isDone={isDone} />
    )
  }
  if (CELL_ALGOS.has(algorithmKey)) {
    return (
      <ArrayCellVisualizer values={values} actionIndices={actionIndices} sortedIndices={sortedIndices}
        foundIndex={foundIndex} activeRange={activeRange} pointers={pointers}
        lastType={lastType} isDone={isDone} />
    )
  }
  return (
    <ArrayBarVisualizer values={values} actionIndices={actionIndices} sortedIndices={sortedIndices}
      foundIndex={foundIndex} activeRange={activeRange} pointers={pointers}
      lastType={lastType} isDone={isDone} />
  )
}
