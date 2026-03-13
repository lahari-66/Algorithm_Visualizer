import ArrayBar from './ArrayBar.jsx'

function Visualizer({
  array,
  maxValue,
  comparingIndices,
  swappingIndices,
  sortedIndices,
  foundIndex,
  activeRange,
  isRunning,
}) {
  const isInActiveRange = (index) => {
    if (!activeRange) return true
    const [start, end] = activeRange
    return index >= start && index <= end
  }

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
        </div>
      </div>

      <div className="bar-stage">
        {array.map((value, index) => {
          let state = 'default'
          if (sortedIndices.includes(index)) state = 'sorted'
          if (comparingIndices.includes(index)) state = 'compare'
          if (swappingIndices.includes(index)) state = 'swap'
          if (foundIndex === index) state = 'found'

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
    </div>
  )
}

export default Visualizer
