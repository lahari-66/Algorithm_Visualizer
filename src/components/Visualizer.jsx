import MergeTree from './MergeTree.jsx'

function Visualizer({
  array,
  comparingIndices,
  swappingIndices,
  sortedIndices,
  foundIndex,
  activeRange,
  pivotIndex,
  mergeState,
  quickState,
  heapState,
  heapPath,
  bubbleState,
  algorithmKey,
  algorithmType,
  focusMode,
  showHeapDetails,
  isRunning,
}) {
  const isInActiveRange = (index) => {
    if (!activeRange) return true
    const [start, end] = activeRange
    return index >= start && index <= end
  }

  const isSearch = algorithmType === 'search'
  const quickPivotIndex = algorithmKey === 'quick' ? pivotIndex : null

  const getState = (index) => {
    if (foundIndex === index) return 'found'
    if (swappingIndices.includes(index)) return 'swap'
    if (comparingIndices.includes(index)) return 'compare'
    if (sortedIndices.includes(index)) return 'sorted'
    if (quickPivotIndex === index) return 'pivot'
    return 'default'
  }

  const leftPointer = activeRange ? activeRange[0] : null
  const rightPointer = activeRange ? activeRange[1] : null
  const midPointer = comparingIndices.length ? comparingIndices[0] : null
  const pivotPointer = quickPivotIndex

  const pointerLabels =
    algorithmKey === 'linear'
      ? { mid: 'I' }
      : { left: 'L', mid: 'M', right: 'R' }

  const hintText = getHintText({
    isSearch,
    comparingIndices,
    swappingIndices,
    foundIndex,
    algorithmKey,
    mergeState,
    quickState,
    heapState,
    bubbleState,
  })

  const isMerge = algorithmKey === 'merge'

  const getMergeCellState = (index) => {
    if (sortedIndices.includes(index)) return 'sorted'
    if (swappingIndices.includes(index)) return 'merge'
    if (comparingIndices.includes(index)) return 'compare'
    if (activeRange && index >= activeRange[0] && index <= activeRange[1]) {
      if (mergeState?.phase && mergeState.phase !== 'start') return 'merge'
      return 'divide'
    }
    return 'default'
  }

  return (
    <div className={`visualizer ${focusMode ? 'focus-mode' : ''}`}>
      <div className="visualizer-header">
        <div>
          <h2>Visualization</h2>
          <p>{isRunning ? 'Animating algorithm steps...' : 'Ready for action.'}</p>
        </div>
        <div className="legend">
          <span className="legend-item default">Default</span>
          <span className="legend-item compare">Compare</span>
          <span className="legend-item swap">Swap</span>
          <span className="legend-item sorted">Sorted</span>
          <span className="legend-item found">Found</span>
          {algorithmKey === 'quick' ? (
            <span className="legend-item pivot">Pivot</span>
          ) : null}
        </div>
      </div>

      <div className="array-strip">
        <div className="hint-banner">
          <span className="hint-dot" /> {hintText}
        </div>
        {comparingIndices.length ? (
          <div className="compare-row">
            {array.map((_, index) => (
              <div key={`cmp-${index}`} className="compare-slot">
                {comparingIndices.includes(index) ? (
                  <span className="compare-marker">⇄</span>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
        <div className="array-row">
          {array.map((value, index) => {
            const state = isMerge ? getMergeCellState(index) : getState(index)
            const dimClass = isInActiveRange(index) ? '' : 'dim'
            return (
              <div key={`cell-${value}-${index}`} className={`array-cell ${state} ${dimClass}`}>
                <span className="array-value">{value}</span>
                <span className="array-index">{index}</span>
              </div>
            )
          })}
        </div>
        {isSearch ? (
          <div className="pointer-row">
            {array.map((_, index) => (
              <div key={`ptr-${index}`} className="pointer-slot">
                {leftPointer === index && pointerLabels.left ? (
                  <span className="pointer-tag">{pointerLabels.left}</span>
                ) : null}
                {midPointer === index && pointerLabels.mid ? (
                  <span className="pointer-tag">{pointerLabels.mid}</span>
                ) : null}
                {rightPointer === index && pointerLabels.right ? (
                  <span className="pointer-tag">{pointerLabels.right}</span>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
        {algorithmKey === 'quick' && activeRange ? (
          <div className="range-row">
            {array.map((_, index) => (
              <div key={`range-${index}`} className="range-slot">
                {leftPointer === index ? <span className="range-tag">L</span> : null}
                {pivotPointer === index ? <span className="range-tag pivot">P</span> : null}
                {rightPointer === index ? <span className="range-tag">R</span> : null}
              </div>
            ))}
          </div>
        ) : null}
        {algorithmKey === 'bubble' && bubbleState ? (
          <div className="bubble-row">
            {array.map((_, index) => (
              <div key={`bubble-${index}`} className="bubble-slot">
                {bubbleState.passEnd === index ? (
                  <span className="bubble-tag">Pass End</span>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
        {algorithmKey === 'heap' && heapState ? (
          <div className="heap-row">
            {array.map((_, index) => (
              <div key={`heap-${index}`} className="heap-slot">
                {heapState.heapEnd === index ? <span className="heap-tag">Heap End</span> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {algorithmKey === 'quick' && quickState ? (
        <div className="quick-panel">
          <div className="quick-legend">
            <span className="quick-pill less">Less</span>
            <span className="quick-pill scan">Scanning</span>
            <span className="quick-pill unknown">Unknown</span>
            <span className="quick-pill pivot">Pivot</span>
          </div>
          <div className="quick-row">
            {array.map((value, index) => {
              const { low, high, i, j, pivotIndex: statePivot } = quickState
              let state = 'outside'
              if (index === statePivot) state = 'pivot'
              else if (index >= low && index <= high) {
                if (i !== null && index < i) state = 'less'
                else if (j !== null && index >= i && index < j) state = 'scan'
                else if (j !== null && index >= j && index < high) state = 'unknown'
                else state = 'unknown'
              }
              return (
                <div key={`quick-${index}`} className={`quick-cell ${state}`}>
                  {value}
                </div>
              )
            })}
          </div>
          <div className="quick-marker-row">
            {array.map((_, index) => (
              <div key={`quick-marker-${index}`} className="quick-marker-slot">
                {quickState.i === index ? <span className="quick-tag">I</span> : null}
                {quickState.j === index ? <span className="quick-tag">J</span> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {algorithmKey === 'merge' ? (
        <div className="merge-visual">
          <MergeTree values={array} activeRange={activeRange} mergeState={mergeState} />
          <div className="merge-legend">
            <span className="merge-legend-item divide">Dividing</span>
            <span className="merge-legend-item compare">Comparing</span>
            <span className="merge-legend-item merge">Merging</span>
            <span className="merge-legend-item sorted">Sorted</span>
          </div>
        </div>
      ) : null}

      {algorithmKey === 'heap' ? (
        <div className="heap-tree">
          <svg viewBox="0 0 100 60" className="heap-svg">
            {array.slice(0, getHeapVisibleCount(array.length, showHeapDetails)).map((value, index) => {
              const left = 2 * index + 1
              const right = 2 * index + 2
              const level = Math.floor(Math.log2(index + 1))
              const levelStart = Math.pow(2, level) - 1
              const levelIndex = index - levelStart
              const nodesInLevel = Math.pow(2, level)
              const x = (levelIndex + 0.5) / nodesInLevel
              const totalLevels = getHeapLevelCount(array.length, showHeapDetails)
              const y = (level + 0.5) / (totalLevels + 1)
              const links = []
              const visibleCount = getHeapVisibleCount(array.length, showHeapDetails)
              if (left < visibleCount) links.push([index, left])
              if (right < visibleCount) links.push([index, right])

              return (
                <g key={`node-${index}`}>
                  {links.map(([fromIndex, toIndex]) => {
                    const toLevel = Math.floor(Math.log2(toIndex + 1))
                    const toLevelStart = Math.pow(2, toLevel) - 1
                    const toLevelIndex = toIndex - toLevelStart
                    const toNodesInLevel = Math.pow(2, toLevel)
                    const toX = (toLevelIndex + 0.5) / toNodesInLevel
                    const toY = (toLevel + 0.5) / (totalLevels + 1)
                    return (
                      <line
                        key={`line-${fromIndex}-${toIndex}`}
                        x1={x * 100}
                        y1={y * 60}
                        x2={toX * 100}
                        y2={toY * 60}
                        className="heap-line"
                      />
                    )
                  })}
                  <circle
                    cx={x * 100}
                    cy={y * 60}
                    r={3.8}
                    className={`heap-node ${getState(index)} ${
                      heapPath.includes(index) ? 'path' : ''
                    }`}
                  />
                  <text
                    x={x * 100}
                    y={y * 60 + 1.6}
                    textAnchor="middle"
                    className="heap-value"
                  >
                    {value}
                  </text>
                </g>
              )
            })}
          </svg>
          {!showHeapDetails && array.length > getHeapVisibleCount(array.length, showHeapDetails) ? (
            <p className="heap-note">Showing the top levels. Toggle full heap to zoom out.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

const getHeapLevelCount = (length, showHeapDetails) => {
  if (!length) return 1
  const fullLevels = Math.floor(Math.log2(length)) + 1
  if (showHeapDetails) return fullLevels
  return Math.min(4, fullLevels)
}

const getHeapVisibleCount = (length, showHeapDetails) => {
  if (!length) return 0
  const levels = getHeapLevelCount(length, showHeapDetails)
  return Math.min(length, Math.pow(2, levels) - 1)
}

const getHintText = ({
  isSearch,
  comparingIndices,
  swappingIndices,
  foundIndex,
  algorithmKey,
  mergeState,
  quickState,
  heapState,
  bubbleState,
}) => {
  if (foundIndex !== null) return 'Match found. The search stops here.'
  if (swappingIndices.length) return 'Swapping two elements to move closer to the goal.'
  if (comparingIndices.length) {
    if (algorithmKey === 'quick') return 'Comparing elements to the pivot.'
    if (algorithmKey === 'merge') return 'Comparing the front of each half.'
    if (algorithmKey === 'heap') return 'Comparing child nodes to find the larger one.'
    return 'Comparing elements to decide their order.'
  }
  if (algorithmKey === 'merge' && mergeState) return 'Merging two sorted halves into one.'
  if (algorithmKey === 'quick' && quickState) return 'Partitioning around the pivot.'
  if (algorithmKey === 'heap' && heapState) return 'Sifting down to restore the heap.'
  if (algorithmKey === 'bubble' && bubbleState) return 'Bubbling the largest value to the end.'
  if (algorithmKey === 'binary') return 'Narrowing the search range around the target.'
  if (isSearch) return 'Scanning the array one step at a time.'
  return 'Watching the array reorganize itself.'
}

export default Visualizer
