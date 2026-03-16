import { useState } from 'react'
import { generateRandomArray, parseInputToArray } from '../utils/arrayGenerator.js'

export const ALGORITHM_CATEGORIES = [
  {
    key: 'sorting',
    label: 'Sorting',
    icon: '↕',
    algorithms: [
      { key: 'bubble',    label: 'Bubble Sort',    complexity: 'O(n²)',       difficulty: 'Beginner',     type: 'sort' },
      { key: 'selection', label: 'Selection Sort',  complexity: 'O(n²)',       difficulty: 'Beginner',     type: 'sort' },
      { key: 'insertion', label: 'Insertion Sort',  complexity: 'O(n²)',       difficulty: 'Beginner',     type: 'sort' },
      { key: 'merge',     label: 'Merge Sort',      complexity: 'O(n log n)',  difficulty: 'Intermediate', type: 'sort' },
      { key: 'quick',     label: 'Quick Sort',      complexity: 'O(n log n)',  difficulty: 'Intermediate', type: 'sort' },
      { key: 'heap',      label: 'Heap Sort',       complexity: 'O(n log n)',  difficulty: 'Intermediate', type: 'sort' },
      { key: 'counting',  label: 'Counting Sort',   complexity: 'O(n + k)',    difficulty: 'Intermediate', type: 'sort' },
    ],
  },
  {
    key: 'searching',
    label: 'Searching',
    icon: '🔍',
    algorithms: [
      { key: 'linear', label: 'Linear Search', complexity: 'O(n)',     difficulty: 'Beginner', type: 'search' },
      { key: 'binary', label: 'Binary Search', complexity: 'O(log n)', difficulty: 'Beginner', type: 'search' },
    ],
  },
  {
    key: 'graph',
    label: 'Graph',
    icon: '⬡',
    algorithms: [
      { key: 'bfs',      label: 'BFS',               complexity: 'O(V+E)', difficulty: 'Intermediate', type: 'graph' },
      { key: 'dfs',      label: 'DFS',               complexity: 'O(V+E)', difficulty: 'Intermediate', type: 'graph' },
      { key: 'dijkstra', label: "Dijkstra's",         complexity: 'O(V²)',  difficulty: 'Advanced',     type: 'graph' },
    ],
  },
  {
    key: 'tree',
    label: 'Trees',
    icon: '🌲',
    algorithms: [
      { key: 'bttree', label: 'Tree Traversal', complexity: 'O(n)', difficulty: 'Intermediate', type: 'tree' },
      { key: 'bst',    label: 'BST Operations', complexity: 'O(log n)', difficulty: 'Intermediate', type: 'tree' },
    ],
  },
  {
    key: 'pathfinding',
    label: 'Pathfinding',
    icon: '🗺',
    algorithms: [
      { key: 'astar', label: 'A* Algorithm', complexity: 'O(E log V)', difficulty: 'Advanced', type: 'path' },
      { key: 'maze',  label: 'Maze Solver',  complexity: 'O(V+E)',     difficulty: 'Advanced',  type: 'path' },
    ],
  },
]

const ALL_ALGOS = ALGORITHM_CATEGORIES.flatMap((c) => c.algorithms)

const SPEEDS = [
  { label: 'Slow', value: 0 },
  { label: 'Medium', value: 1 },
  { label: 'Fast', value: 2 },
  { label: 'Blaze', value: 3 },
]

const DIFFICULTY_COLORS = {
  Beginner:     { bg: 'rgba(52,211,153,0.15)',  color: '#34d399', border: 'rgba(52,211,153,0.4)' },
  Intermediate: { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24', border: 'rgba(251,191,36,0.4)' },
  Advanced:     { bg: 'rgba(251,113,133,0.15)', color: '#fb7185', border: 'rgba(251,113,133,0.4)' },
}

function AlgorithmBadge({ label, color, bg, border }) {
  return (
    <span className="algo-badge" style={{ background: bg, color, border: `1px solid ${border}` }}>
      {label}
    </span>
  )
}

function AlgorithmCard({ algo, selected, onClick }) {
  const diff = DIFFICULTY_COLORS[algo.difficulty]
  return (
    <button
      type="button"
      className={`algo-card${selected ? ' active' : ''}`}
      onClick={onClick}
    >
      <span className="algo-card-name">{algo.label}</span>
      <div className="algo-card-badges">
        <span className="algo-badge algo-badge-complexity">{algo.complexity}</span>
        <AlgorithmBadge label={algo.difficulty} {...diff} />
      </div>
    </button>
  )
}

function InputStage({ onStart }) {
  const [algorithmKey, setAlgorithmKey] = useState('bubble')
  const [arraySize, setArraySize] = useState(16)
  const [customInput, setCustomInput] = useState('')
  const [targetValue, setTargetValue] = useState('')
  const [speedLevel, setSpeedLevel] = useState(1)
  const [error, setError] = useState('')
  const [array, setArray] = useState(() => generateRandomArray(16, 8, 100))

  const algo = ALL_ALGOS.find((a) => a.key === algorithmKey)
  const isSearch = algo?.type === 'search'
  const isArray = algo?.type === 'sort' || algo?.type === 'search'

  const handleGenerate = () => {
    const next = generateRandomArray(arraySize, 8, 100)
    setArray(next)
    setCustomInput('')
    setError('')
  }

  const handleSizeChange = (val) => {
    const n = Math.max(4, Math.min(50, Number(val)))
    setArraySize(n)
    setArray(generateRandomArray(n, 8, 100))
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
    if (isSearch && targetValue.trim() === '') { setError('Enter a target value to search for.'); return }
    if (isSearch && Number.isNaN(Number(targetValue))) { setError('Target must be a number.'); return }
    setError('')
    onStart({ algorithmKey, array, speedLevel, targetValue: Number(targetValue) })
  }

  return (
    <div className="input-stage">
      <div className="input-stage-inner">

        {/* Algorithm selector */}
        <div className="input-section">
          <h2 className="input-heading">Select Algorithm</h2>
          <div className="algo-categories">
            {ALGORITHM_CATEGORIES.map((cat) => (
              <div key={cat.key} className="algo-category">
                <div className="algo-category-header">
                  <span className="algo-category-icon">{cat.icon}</span>
                  <span className="algo-category-label">{cat.label}</span>
                </div>
                <div className="algo-category-grid">
                  {cat.algorithms.map((a) => (
                    <AlgorithmCard
                      key={a.key}
                      algo={a}
                      selected={algorithmKey === a.key}
                      onClick={() => { setAlgorithmKey(a.key); setError('') }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Array config — only for sort/search */}
        {isArray && (
          <div className="input-section">
            <h2 className="input-heading">Configure Input</h2>

            <div className="input-field-group">
              <label className="input-label">Array Size: <strong>{arraySize}</strong></label>
              <input type="range" min="4" max="50" value={arraySize}
                onChange={(e) => handleSizeChange(e.target.value)} className="range-slider" />
              <div className="range-hints"><span>4</span><span>50</span></div>
            </div>

            <div className="input-field-group">
              <label className="input-label">Custom Array (comma separated)</label>
              <div className="custom-input-row">
                <input type="text" className="text-input" placeholder="e.g. 5, 3, 8, 1, 2"
                  value={customInput} onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCustom()} />
                <button type="button" className="btn-ghost" onClick={handleApplyCustom}>Apply</button>
              </div>
            </div>

            {isSearch && (
              <div className="input-field-group">
                <label className="input-label">Search Target</label>
                <input type="number" className="text-input" placeholder="Value to find"
                  value={targetValue} onChange={(e) => setTargetValue(e.target.value)} />
              </div>
            )}

            <div className="array-preview">
              {array.map((v, i) => <span key={i} className="array-preview-chip">{v}</span>)}
            </div>
          </div>
        )}

        {/* Non-array algorithms info */}
        {!isArray && (
          <div className="input-section">
            <h2 className="input-heading">Algorithm Info</h2>
            <p className="algo-info-text">
              {algo?.type === 'graph' && 'This algorithm runs on a pre-built graph. Click Start to visualize the traversal step by step.'}
              {algo?.type === 'tree' && 'This algorithm runs on a pre-built binary tree. Click Start to visualize the traversal.'}
              {algo?.type === 'path' && 'This algorithm finds a path through a grid maze. Click Start to watch it explore.'}
            </p>
          </div>
        )}

        {error && <p className="input-error">{error}</p>}

        {/* Speed */}
        <div className="input-section">
          <h2 className="input-heading">Speed</h2>
          <div className="speed-row">
            {SPEEDS.map((s) => (
              <button key={s.value} type="button"
                className={`speed-chip${speedLevel === s.value ? ' active' : ''}`}
                onClick={() => setSpeedLevel(s.value)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="input-actions">
          {isArray && (
            <button type="button" className="btn-secondary" onClick={handleGenerate}>
              🎲 Random Array
            </button>
          )}
          <button type="button" className="btn-primary" onClick={handleStart}>
            ▶ Start Algorithm
          </button>
        </div>

      </div>
    </div>
  )
}

export default InputStage
