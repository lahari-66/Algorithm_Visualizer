function ControlPanel({
  algorithms,
  algorithmKey,
  setAlgorithmKey,
  arraySize,
  setArraySize,
  onGenerate,
  onReset,
  onStart,
  onPause,
  isRunning,
  isPaused,
  speedLevel,
  setSpeedLevel,
  speedLabel,
  customInput,
  setCustomInput,
  onApplyInput,
  targetValue,
  setTargetValue,
  algorithmInfo,
  notice,
}) {
  const isSearch = algorithmInfo.type === 'search'

  return (
    <div className="control-panel">
      <div className="panel-header">
        <h2>Control Panel</h2>
        <p>Set the data, pick an algorithm, and hit play.</p>
      </div>

      <div className="control-group">
        <label htmlFor="algorithm">Algorithm</label>
        <select
          id="algorithm"
          value={algorithmKey}
          onChange={(event) => setAlgorithmKey(event.target.value)}
          disabled={isRunning}
        >
          <optgroup label="Sorting">
            <option value="bubble">Bubble Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
            <option value="heap">Heap Sort</option>
          </optgroup>
          <optgroup label="Searching">
            <option value="linear">Linear Search</option>
            <option value="binary">Binary Search</option>
          </optgroup>
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="size">Array Size: {arraySize}</label>
        <input
          id="size"
          type="range"
          min="8"
          max="60"
          value={arraySize}
          onChange={(event) => setArraySize(Number(event.target.value))}
          disabled={isRunning}
        />
      </div>

      <div className="control-group">
        <label htmlFor="speed">Speed: {speedLabel}</label>
        <input
          id="speed"
          type="range"
          min="0"
          max="3"
          value={speedLevel}
          onChange={(event) => setSpeedLevel(Number(event.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="custom">Custom Input</label>
        <textarea
          id="custom"
          rows="3"
          placeholder="e.g. 12, 4, 19, 2, 7"
          value={customInput}
          onChange={(event) => setCustomInput(event.target.value)}
          disabled={isRunning}
        />
        <button className="button ghost" onClick={onApplyInput} disabled={isRunning}>
          Apply Input
        </button>
      </div>

      {isSearch ? (
        <div className="control-group">
          <label htmlFor="target">Search Target</label>
          <input
            id="target"
            type="number"
            value={targetValue}
            onChange={(event) => setTargetValue(event.target.value)}
            placeholder="Enter a value"
            disabled={isRunning}
          />
        </div>
      ) : null}

      {notice ? <p className="notice">{notice}</p> : null}

      <div className="button-row">
        <button className="button primary" onClick={onStart} disabled={isRunning}>
          Start Algorithm
        </button>
        <button className="button" onClick={onPause} disabled={!isRunning}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button className="button" onClick={onGenerate} disabled={isRunning}>
          Generate
        </button>
        <button className="button ghost" onClick={onReset}>
          Reset
        </button>
      </div>

      <div className="divider" />

      <div className="complexity">
        <h3>{algorithmInfo.name} Complexity</h3>
        <div className="complexity-grid">
          <div>
            <span>Best</span>
            <strong>{algorithmInfo.complexity.best}</strong>
          </div>
          <div>
            <span>Average</span>
            <strong>{algorithmInfo.complexity.average}</strong>
          </div>
          <div>
            <span>Worst</span>
            <strong>{algorithmInfo.complexity.worst}</strong>
          </div>
          <div>
            <span>Space</span>
            <strong>{algorithmInfo.complexity.space}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
