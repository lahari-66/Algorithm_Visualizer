import { useState } from 'react'
import { generateRandomArray, parseInputToArray } from '../utils/arrayGenerator.js'

const ALGORITHMS = [
  { key: 'bubble', label: 'Bubble Sort', type: 'sort' },
  { key: 'merge', label: 'Merge Sort', type: 'sort' },
  { key: 'quick', label: 'Quick Sort', type: 'sort' },
  { key: 'heap', label: 'Heap Sort', type: 'sort' },
  { key: 'linear', label: 'Linear Search', type: 'search' },
  { key: 'binary', label: 'Binary Search', type: 'search' },
]

const SPEEDS = [
  { label: 'Slow', value: 0 },
  { label: 'Medium', value: 1 },
  { label: 'Fast', value: 2 },
  { label: 'Blaze', value: 3 },
]

function InputStage({ onStart }) {
  const [algorithmKey, setAlgorithmKey] = useState('bubble')
  const [arraySize, setArraySize] = useState(16)
  const [customInput, setCustomInput] = useState('')
  const [targetValue, setTargetValue] = useState('')
  const [speedLevel, setSpeedLevel] = useState(1)
  const [error, setError] = useState('')
  const [array, setArray] = useState(() => generateRandomArray(16, 8, 100))

  const algo = ALGORITHMS.find((a) => a.key === algorithmKey)
  const isSearch = algo?.type === 'search'

  const handleGenerate = () => {
    const next = generateRandomArray(arraySize, 8, 100)
    setArray(next)
    setCustomInput('')
    setError('')
  }

  const handleSizeChange = (val) => {
    const n = Math.max(4, Math.min(50, Number(val)))
    setArraySize(n)
    const next = generateRandomArray(n, 8, 100)
    setArray(next)
    setCustomInput('')
    setError('')
  }

  const handleApplyCustom = () => {
    const { array: parsed, error: err } = parseInputToArray(customInput, 50)
    if (err) { setError(err); return }
    if (parsed.length < 2) { setError('Enter at least 2 numbers.'); return }
    setArray(parsed)
    setArraySize(parsed.length)
    setError('')
  }

  const handleStart = () => {
    if (isSearch && targetValue.trim() === '') {
      setError('Enter a target value to search for.')
      return
    }
    if (isSearch && Number.isNaN(Number(targetValue))) {
      setError('Target must be a number.')
      return
    }
    setError('')
    onStart({ algorithmKey, array, speedLevel, targetValue: Number(targetValue) })
  }

  return (
    <div className="input-stage">
      <div className="input-stage-inner">
        <div className="input-section">
          <h2 className="input-heading">Select Algorithm</h2>
          <div className="algo-grid">
            {['sort', 'search'].map((type) => (
              <div key={type} className="algo-group">
                <div className="algo-group-label">{type === 'sort' ? 'Sorting' : 'Searching'}</div>
                {ALGORITHMS.filter((a) => a.type === type).map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    className={`algo-select-btn${algorithmKey === a.key ? ' active' : ''}`}
                    onClick={() => { setAlgorithmKey(a.key); setError('') }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="input-section">
          <h2 className="input-heading">Configure Input</h2>

          <div className="input-field-group">
            <label className="input-label">Array Size: <strong>{arraySize}</strong></label>
            <input
              type="range" min="4" max="50" value={arraySize}
              onChange={(e) => handleSizeChange(e.target.value)}
              className="range-slider"
            />
            <div className="range-hints"><span>4</span><span>50</span></div>
          </div>

          <div className="input-field-group">
            <label className="input-label">Custom Array (comma separated)</label>
            <div className="custom-input-row">
              <input
                type="text"
                className="text-input"
                placeholder="e.g. 5, 3, 8, 1, 2"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCustom()}
              />
              <button type="button" className="btn-ghost" onClick={handleApplyCustom}>Apply</button>
            </div>
          </div>

          {isSearch && (
            <div className="input-field-group">
              <label className="input-label">Search Target</label>
              <input
                type="number"
                className="text-input"
                placeholder="Value to find"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
              />
            </div>
          )}

          <div className="array-preview">
            {array.map((v, i) => (
              <span key={i} className="array-preview-chip">{v}</span>
            ))}
          </div>

          {error && <p className="input-error">{error}</p>}
        </div>

        <div className="input-section">
          <h2 className="input-heading">Speed</h2>
          <div className="speed-row">
            {SPEEDS.map((s) => (
              <button
                key={s.value}
                type="button"
                className={`speed-chip${speedLevel === s.value ? ' active' : ''}`}
                onClick={() => setSpeedLevel(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="input-actions">
          <button type="button" className="btn-secondary" onClick={handleGenerate}>
            🎲 Random Array
          </button>
          <button type="button" className="btn-primary" onClick={handleStart}>
            ▶ Start Algorithm
          </button>
        </div>
      </div>
    </div>
  )
}

export default InputStage
