import ArrayBar from './ArrayBar.jsx'

function Visualizer({
  array,
  maxValue,
  comparingIndices,
  swappingIndices,
  sortedIndices,
  foundIndex,
  activeRange,
  algorithmKey,
  algorithmType,
  isRunning,
}) {
  const isInActiveRange = (index) => {
    if (!activeRange) return true
    const [start, end] = activeRange
    return index >= start && index <= end
  }

  const isSearch = algorithmType === 'search'
  const pivotIndex =
    algorithmKey === 'quick' && comparingIndices.length === 2
      ? comparingIndices[1]
      : null

  const getState = (index) => {
    if (foundIndex === index) return 'found'
    if (swappingIndices.includes(index)) return 'swap'
    if (comparingIndices.includes(index)) return 'compare'
    if (sortedIndices.includes(index)) return 'sorted'
    if (pivotIndex === index) return 'pivot'
    return 'default'
  }

  const leftPointer = activeRange ? activeRange[0] : null
  const rightPointer = activeRange ? activeRange[1] : null
  const midPointer = comparingIndices.length ? comparingIndices[0] : null

  const hintText = getHintText({
    isSearch,
    comparingIndices,
    swappingIndices,
    foundIndex,
    algorithmKey,
  })

  return (
    <div className="visualizer">
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
            const state = getState(index)
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
                {leftPointer === index ? <span className="pointer-tag">L</span> : null}
                {midPointer === index ? <span className="pointer-tag">M</span> : null}
                {rightPointer === index ? <span className="pointer-tag">R</span> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {!isSearch ? (
        <div className={`bar-stage ${algorithmKey === 'merge' ? 'merge-stage' : ''}`}>
          {array.map((value, index) => {
            const state = getState(index)
            return (
              <ArrayBar
                key={`${value}-${index}`}
                value={value}
                maxValue={maxValue}
                state={state}
                isInRange={isInActiveRange(index)}
              />
            )
          })}
        </div>
      ) : null}

      {algorithmKey === 'merge' ? (
        <div className="merge-tree">
          {array.map((value, index) => (
            <div key={`merge-leaf-${index}`} className="merge-leaf">
              {value}
            </div>
          ))}
        </div>
      ) : null}

      {algorithmKey === 'heap' ? (
        <div className="heap-tree">
          <svg viewBox="0 0 100 60" className="heap-svg">
            {array.map((value, index) => {
              const left = 2 * index + 1
              const right = 2 * index + 2
              const level = Math.floor(Math.log2(index + 1))
              const levelStart = Math.pow(2, level) - 1
              const levelIndex = index - levelStart
              const nodesInLevel = Math.pow(2, level)
              const x = (levelIndex + 0.5) / nodesInLevel
              const y = (level + 0.5) / (Math.log2(array.length + 1) + 1)
              const links = []
              if (left < array.length) links.push([index, left])
              if (right < array.length) links.push([index, right])

              return (
                <g key={`node-${index}`}>
                  {links.map(([fromIndex, toIndex]) => {
                    const toLevel = Math.floor(Math.log2(toIndex + 1))
                    const toLevelStart = Math.pow(2, toLevel) - 1
                    const toLevelIndex = toIndex - toLevelStart
                    const toNodesInLevel = Math.pow(2, toLevel)
                    const toX = (toLevelIndex + 0.5) / toNodesInLevel
                    const toY = (toLevel + 0.5) / (Math.log2(array.length + 1) + 1)
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
                    className={`heap-node ${getState(index)}`}
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
        </div>
      ) : null}
    </div>
  )
}

const getHintText = ({ isSearch, comparingIndices, swappingIndices, foundIndex, algorithmKey }) => {
  if (foundIndex !== null) return 'Match found. The search stops here.'
  if (swappingIndices.length) return 'Swapping two elements to move closer to the goal.'
  if (comparingIndices.length) {
    if (algorithmKey === 'quick') return 'Comparing elements to the pivot.'
    return 'Comparing elements to decide their order.'
  }
  if (isSearch) return 'Scanning the array one step at a time.'
  return 'Watching the array reorganize itself.'
}

export default Visualizer
