import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import VisualizerCanvas from '../components/VisualizerCanvas.jsx'
import PlaybackControls from '../components/PlaybackControls.jsx'
import StatisticsPanel from '../components/StatisticsPanel.jsx'
import StepTutor from '../components/StepTutor.jsx'
import CompareView from '../components/CompareView.jsx'
import AllStepsModal from '../components/AllStepsModal.jsx'
import { ALGORITHM_CATEGORIES } from '../components/InputStage.jsx'
import { bubbleSortSteps }          from '../algorithms/bubbleSort.js'
import { selectionSortSteps }       from '../algorithms/selectionSort.js'
import { insertionSortSteps }       from '../algorithms/insertionSort.js'
import { mergeSortSteps }           from '../algorithms/mergeSort.js'
import { quickSortSteps }           from '../algorithms/quickSort.js'
import { heapSortSteps }            from '../algorithms/heapSort.js'
import { countingSortSteps }        from '../algorithms/countingSort.js'
import { linearSearchSteps }        from '../algorithms/linearSearch.js'
import { binarySearchSteps }        from '../algorithms/binarySearch.js'
import { bfsSteps }                 from '../algorithms/bfs.js'
import { dfsSteps }                 from '../algorithms/dfs.js'
import { dijkstraSteps }            from '../algorithms/dijkstra.js'
import { binaryTreeTraversalSteps } from '../algorithms/binaryTreeTraversal.js'
import { bstOperationsSteps }       from '../algorithms/bstOperations.js'
import { aStarSteps }               from '../algorithms/aStar.js'
import { mazeSolverSteps }          from '../algorithms/mazeSolver.js'
import { generateRandomArray, parseInputToArray } from '../utils/arrayGenerator.js'
import { createSoundEngine } from '../utils/soundEffects.js'
import { applyTheme } from '../theme.js'

const ALGO_MAP = {
  bubble:    { name: 'Bubble Sort',    viz: 'bar',   getSteps: (a)     => bubbleSortSteps(a) },
  selection: { name: 'Selection Sort', viz: 'bar',   getSteps: (a)     => selectionSortSteps(a) },
  insertion: { name: 'Insertion Sort', viz: 'bar',   getSteps: (a)     => insertionSortSteps(a) },
  merge:     { name: 'Merge Sort',     viz: 'merge', getSteps: (a)     => mergeSortSteps(a) },
  quick:     { name: 'Quick Sort',     viz: 'bar',   getSteps: (a)     => quickSortSteps(a) },
  heap:      { name: 'Heap Sort',      viz: 'heap',  getSteps: (a)     => heapSortSteps(a) },
  counting:  { name: 'Counting Sort',  viz: 'bar',   getSteps: (a)     => countingSortSteps(a) },
  linear:    { name: 'Linear Search',  viz: 'cell',  getSteps: (a, tv) => linearSearchSteps(a, tv) },
  binary:    { name: 'Binary Search',  viz: 'cell',  getSteps: (a, tv) => binarySearchSteps(a, tv) },
  bfs:       { name: 'BFS',            viz: 'graph', getSteps: ()      => bfsSteps() },
  dfs:       { name: 'DFS',            viz: 'graph', getSteps: ()      => dfsSteps() },
  dijkstra:  { name: "Dijkstra's",     viz: 'graph', getSteps: ()      => dijkstraSteps() },
  bttree:    { name: 'Tree Traversal', viz: 'tree',  getSteps: ()      => binaryTreeTraversalSteps() },
  bst:       { name: 'BST Operations', viz: 'tree',  getSteps: ()      => bstOperationsSteps() },
  astar:     { name: 'A* Algorithm',   viz: 'path',  getSteps: ()      => aStarSteps() },
  maze:      { name: 'Maze Solver',    viz: 'path',  getSteps: ()      => mazeSolverSteps() },
}

const ALL_ALGOS = ALGORITHM_CATEGORIES.flatMap((c) => c.algorithms)
const SPEED_MS  = [1400, 700, 300, 120]
const ACTION_TYPES = new Set(['COMPARE', 'SWAP', 'OVERWRITE'])

function deriveState(steps, array, idx) {
  const values = [...array]
  const sortedSet = new Set()
  let actionIndices = [], pointers = [], lastType = null
  let foundIndex = null, activeRange = null, comparisons = 0, swaps = 0

  for (let i = 0; i <= idx; i++) {
    const s = steps[i]; if (!s) break
    lastType = s.type
    pointers = Array.isArray(s.pointers) ? s.pointers : []
    if (s.activeRange) activeRange = s.activeRange
    else if (s.type === 'RANGE' && s.indices?.length === 2) activeRange = s.indices
    actionIndices = ACTION_TYPES.has(s.type) ? s.indices ?? [] : []
    if (s.type === 'COMPARE') comparisons++
    if (s.type === 'SWAP') {
      swaps++
      const [a, b] = s.indices
      const t = values[a]; values[a] = values[b]; values[b] = t
    }
    if (s.type === 'OVERWRITE') {
      swaps++
      const ix = s.indices?.[0]
      if (ix != null) values[ix] = s.value
    }
    if (s.type === 'SORTED') s.indices?.forEach((ix) => sortedSet.add(ix))
    if (s.type === 'FOUND') {
      const ix = s.indices?.[0]
      foundIndex = typeof ix === 'number' && ix >= 0 ? ix : null
    }
  }
  return { values, actionIndices, sortedIndices: Array.from(sortedSet), foundIndex, activeRange, pointers, lastType, comparisons, swaps, isDone: idx >= steps.length - 1 }
}

// ── Compact top-bar input controls ──────────────────────────────
function TopBar({ algorithmKey, onAlgoChange, array, onArrayChange, arraySize, onSizeChange,
                  customInput, onCustomInput, onApplyCustom, targetValue, onTargetChange,
                  speedLevel, onSpeedChange, onStart, onReset, onOpenStepGuide, hasSteps, isRunning, error }) {
  const algo = ALL_ALGOS.find((a) => a.key === algorithmKey)
  const isSearch = algo?.type === 'search'
  const isArray  = algo?.type === 'sort' || algo?.type === 'search'
  const [sizeInput, setSizeInput] = useState(String(arraySize))

  useEffect(() => {
    setSizeInput(String(arraySize))
  }, [arraySize])

  const handleApplySize = () => {
    const parsed = Number(sizeInput)
    if (Number.isNaN(parsed)) {
      setSizeInput(String(arraySize))
      return
    }
    onSizeChange(parsed)
  }

  return (
    <div className="topbar">
      {/* Algorithm selector */}
      <div className="topbar-group topbar-algo">
        <label className="topbar-label">Algorithm</label>
        <select className="topbar-select" value={algorithmKey}
          onChange={(e) => onAlgoChange(e.target.value)} disabled={isRunning}>
          {ALGORITHM_CATEGORIES.map((cat) => (
            <optgroup key={cat.key} label={cat.label}>
              {cat.algorithms.map((a) => (
                <option key={a.key} value={a.key}>{a.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Array input — only for sort/search */}
      {isArray && (
        <>
          <div className="topbar-divider" />
          <div className="topbar-group">
            <label className="topbar-label">Array Size (4-50)</label>
            <input
              type="number"
              min="4"
              max="50"
              className="topbar-text topbar-size-input"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onBlur={handleApplySize}
              onKeyDown={(e) => e.key === 'Enter' && handleApplySize()}
              disabled={isRunning}
            />
          </div>
          <div className="topbar-group topbar-custom">
            <label className="topbar-label">Custom</label>
            <div className="topbar-input-row">
              <input type="text" className="topbar-text" placeholder="5,3,8,1…"
                value={customInput} onChange={(e) => onCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onApplyCustom()}
                disabled={isRunning} />
              <button type="button" className="topbar-apply" onClick={onApplyCustom} disabled={isRunning}>✓</button>
            </div>
          </div>
          {isSearch && (
            <div className="topbar-group">
              <label className="topbar-label">Target</label>
              <input type="number" className="topbar-text topbar-target" placeholder="value"
                value={targetValue} onChange={(e) => onTargetChange(e.target.value)}
                disabled={isRunning} />
            </div>
          )}
        </>
      )}

      <div className="topbar-divider" />

      {/* Speed */}
      <div className="topbar-group">
        <label className="topbar-label">Speed</label>
        <div className="topbar-speed-chips">
          {['Slow','Med','Fast','⚡'].map((lbl, i) => (
            <button key={i} type="button"
              className={`topbar-speed-chip${speedLevel === i ? ' active' : ''}`}
              onClick={() => onSpeedChange(i)} disabled={isRunning}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div className="topbar-divider" />

      {/* Actions */}
      <div className="topbar-actions">
        <button
          type="button"
          className="topbar-btn topbar-btn-ghost"
          onClick={onOpenStepGuide}
          disabled={!hasSteps}
          title={hasSteps ? 'Open full-screen step notes' : 'Run Start to generate step notes'}
        >
          📝 Notes
        </button>
        {isArray && (
          <button type="button" className="topbar-btn topbar-btn-ghost"
            onClick={onArrayChange}
            disabled={isRunning} title="Random array">
            🎲
          </button>
        )}
        <button type="button" className="topbar-btn topbar-btn-primary" onClick={onStart} disabled={isRunning}>
          ▶ Start
        </button>
        <button type="button" className="topbar-btn topbar-btn-ghost" onClick={onReset} title="Reset">
          ↺ Reset
        </button>
      </div>

      {error && <span className="topbar-error">{error}</span>}
    </div>
  )
}

// ── Array preview strip ──────────────────────────────────────────
function ArrayStrip({ array }) {
  if (!array?.length) return null
  return (
    <div className="array-strip">
      {array.map((v, i) => <span key={i} className="array-strip-chip">{v}</span>)}
    </div>
  )
}

export default function VisualizerPage() {
  const [theme, setTheme] = useState('dark')
  const [compareMode, setCompareMode] = useState(false)

  // Input state
  const [algorithmKey, setAlgorithmKey] = useState('bubble')
  const [arraySize, setArraySize] = useState(16)
  const [customInput, setCustomInput] = useState('')
  const [targetValue, setTargetValue] = useState('')
  const [speedLevel, setSpeedLevel] = useState(1)
  const [array, setArray] = useState(() => generateRandomArray(16, 8, 100))
  const [inputError, setInputError] = useState('')

  // Playback state
  const [steps, setSteps] = useState([])
  const [stepIndex, setStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [vizState, setVizState] = useState(null)
  const [algoMeta, setAlgoMeta] = useState(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [baseArray, setBaseArray] = useState([])
  const [showAllSteps, setShowAllSteps] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [soundVolume, setSoundVolume] = useState(0.35)

  const playRef = useRef(null)
  const soundRef = useRef(null)
  const prevStepRef = useRef(-1)

  const clearRunStateForNewInput = useCallback(() => {
    setIsPlaying(false)
    setSteps([])
    setStepIndex(-1)
    setVizState(null)
    setAlgoMeta(null)
    setElapsedMs(0)
    setBaseArray([])
    setShowAllSteps(false)
    setHasRun(false)
  }, [])

  useEffect(() => { applyTheme(theme) }, [theme])

  useEffect(() => {
    soundRef.current = createSoundEngine()
    return () => soundRef.current?.dispose()
  }, [])

  useEffect(() => {
    soundRef.current?.setVolume(soundEnabled ? soundVolume : 0)
  }, [soundEnabled, soundVolume])

  useEffect(() => {
    if (!soundEnabled || stepIndex < 0 || !steps.length) return
    const prev = prevStepRef.current
    prevStepRef.current = stepIndex
    if (prev === stepIndex) return

    const active = steps[stepIndex]
    if (!active) return
    soundRef.current?.playStepSound(active.type, { emphasis: isPlaying ? 0.9 : 1.1 })
  }, [stepIndex, steps, soundEnabled, isPlaying])

  useEffect(() => {
    if (stepIndex < 0) prevStepRef.current = -1
  }, [stepIndex])

  const seekTo = useCallback((idx) => {
    if (!steps.length) return
    const c = Math.max(0, Math.min(idx, steps.length - 1))
    setStepIndex(c)
    // Only derive array state for array-based algos
    const algo = ALGO_MAP[algorithmKey]
    if (['bar','cell','merge','heap'].includes(algo?.viz)) {
      setVizState(deriveState(steps, baseArray, c))
    }
  }, [steps, baseArray, algorithmKey])

  useEffect(() => {
    if (!isPlaying) { clearInterval(playRef.current); return }
    const ms = SPEED_MS[speedLevel] ?? 700
    playRef.current = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1
        if (next >= steps.length) { setIsPlaying(false); return prev }
        const algo = ALGO_MAP[algorithmKey]
        if (['bar','cell','merge','heap'].includes(algo?.viz)) {
          setVizState(deriveState(steps, baseArray, next))
        }
        return next
      })
    }, ms)
    return () => clearInterval(playRef.current)
  }, [isPlaying, speedLevel, steps, baseArray, algorithmKey])

  const handleSizeChange = (n) => {
    if (!Number.isFinite(n)) return
    const clamped = Math.max(4, Math.min(50, n))
    setArraySize(clamped)
    setArray(generateRandomArray(clamped, 8, 100))
    setCustomInput('')
    setInputError('')
    clearRunStateForNewInput()
  }

  const handleApplyCustom = () => {
    const { array: parsed, error: err } = parseInputToArray(customInput, 50)
    if (err) { setInputError(err); return }
    if (parsed.length < 2) { setInputError('Enter at least 2 numbers.'); return }
    setArray(parsed)
    setArraySize(parsed.length)
    setInputError('')
    clearRunStateForNewInput()
  }

  const handleRandomArray = () => {
    setArray(generateRandomArray(arraySize, 8, 100))
    setCustomInput('')
    setInputError('')
    clearRunStateForNewInput()
  }

  const handleStart = () => {
    const algo = ALL_ALGOS.find((a) => a.key === algorithmKey)
    const isSearch = algo?.type === 'search'
    if (isSearch && targetValue.trim() === '') { setInputError('Enter a target value.'); return }
    if (isSearch && Number.isNaN(Number(targetValue))) { setInputError('Target must be a number.'); return }
    setInputError('')

    let workingArray = [...array]
    if (algorithmKey === 'binary') workingArray = [...array].sort((a, b) => a - b)

    const t0 = performance.now()
    const result = ALGO_MAP[algorithmKey].getSteps(workingArray, Number(targetValue))
    const elapsed = Math.round(performance.now() - t0)

    const { steps: nextSteps, ...meta } = result
    const hasSteps = Array.isArray(nextSteps) && nextSteps.length > 0
    setBaseArray(workingArray)
    setSteps(nextSteps)
    setElapsedMs(elapsed)
    setAlgoMeta(meta)
    setStepIndex(hasSteps ? 0 : -1)
    setVizState(hasSteps && ['bar','cell','merge','heap'].includes(ALGO_MAP[algorithmKey]?.viz)
      ? deriveState(nextSteps, workingArray, 0)
      : null)
    setIsPlaying(false)
    setHasRun(true)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setSteps([])
    setStepIndex(-1)
    setVizState(null)
    setAlgoMeta(null)
    setHasRun(false)
    setShowAllSteps(false)
    setInputError('')
  }

  const stepSnapshots = useMemo(() => {
    if (!showAllSteps || !steps.length || !baseArray.length) return []
    const vizKind = ALGO_MAP[algorithmKey]?.viz
    if (!['bar', 'cell', 'merge', 'heap'].includes(vizKind)) return []
    return steps.map((_, i) => deriveState(steps, baseArray, i))
  }, [showAllSteps, steps, baseArray, algorithmKey])

  const handlePlay = () => {
    if (stepIndex >= steps.length - 1) seekTo(0)
    setIsPlaying(true)
    if (soundEnabled) soundRef.current?.playUiSound('play')
  }
  const handlePause = () => {
    setIsPlaying(false)
    if (soundEnabled) soundRef.current?.playUiSound('pause')
  }
  const handlePrev = () => {
    setIsPlaying(false)
    seekTo(Math.max(0, stepIndex - 1))
    if (soundEnabled) soundRef.current?.playUiSound('click')
  }
  const handleNext = () => {
    setIsPlaying(false)
    seekTo(Math.min(steps.length - 1, stepIndex + 1))
    if (soundEnabled) soundRef.current?.playUiSound('click')
  }
  const handleRewind = () => {
    setIsPlaying(false)
    seekTo(0)
    if (soundEnabled) soundRef.current?.playUiSound('click')
  }
  const handleForward = () => {
    setIsPlaying(false)
    seekTo(steps.length - 1)
    if (soundEnabled) soundRef.current?.playUiSound('click')
  }
  const handleScrub = (v) => {
    setIsPlaying(false)
    seekTo(v)
  }

  const algoInfo   = ALGO_MAP[algorithmKey]
  const activeStep = steps[stepIndex] ?? null
  const comparisons = vizState?.comparisons ?? 0
  const swaps       = vizState?.swaps ?? 0
  const algo        = ALL_ALGOS.find((a) => a.key === algorithmKey)
  const isArray     = algo?.type === 'sort' || algo?.type === 'search'

  return (
    <div className="app-shell">
      <Navbar theme={theme} onThemeChange={setTheme} onHome={handleReset}
        compareMode={compareMode} onToggleCompare={() => setCompareMode((p) => !p)} />

      {compareMode ? (
        <div className="compare-mode-wrap">
          <CompareView array={baseArray.length ? baseArray : [8,3,5,1,9,2,7,4]} speed={speedLevel} />
        </div>
      ) : (
        <div className="viz-page">
          {/* ── Top control bar ── */}
          <TopBar
            algorithmKey={algorithmKey}
            onAlgoChange={(k) => { setAlgorithmKey(k); handleReset() }}
            array={array}
            onArrayChange={handleRandomArray}
            arraySize={arraySize}
            onSizeChange={handleSizeChange}
            customInput={customInput}
            onCustomInput={setCustomInput}
            onApplyCustom={handleApplyCustom}
            targetValue={targetValue}
            onTargetChange={setTargetValue}
            speedLevel={speedLevel}
            onSpeedChange={setSpeedLevel}
            onStart={handleStart}
            onReset={handleReset}
            onOpenStepGuide={() => setShowAllSteps(true)}
            hasSteps={steps.length > 0}
            isRunning={isPlaying}
            error={inputError}
          />

          {/* Array preview strip — only for array algos before running */}
          {isArray && !hasRun && <ArrayStrip array={array} />}

          {/* ── Main content ── */}
          <div className="viz-layout">
            {/* Left sidebar — stats */}
            <aside className="viz-sidebar-left">
              <StatisticsPanel algorithmKey={algorithmKey} comparisons={comparisons}
                swaps={swaps} currentStep={stepIndex} totalSteps={steps.length} elapsedMs={elapsedMs} />
              <StepTutor step={activeStep} stepIndex={stepIndex} />
            </aside>

            {/* Center — visualization + playback */}
            <main className="viz-center">
              <div className="viz-center-header">
                <span className="viz-algo-name">{algoInfo?.name}</span>
              </div>

              {/* Visualization canvas */}
              <div className="viz-canvas-wrap">
                <VisualizerCanvas algorithmKey={algorithmKey} baseArray={baseArray}
                  vizState={vizState} steps={steps} stepIndex={stepIndex} algoMeta={algoMeta} />
              </div>

              {/* Step description banner */}
              {activeStep && (
                <div className="step-banner">
                  <span className={`step-type-badge step-type-${activeStep.type?.toLowerCase()}`}>
                    {activeStep.type}
                  </span>
                  <span className="step-banner-text">{activeStep.description}</span>
                </div>
              )}

              {/* Playback controls */}
              <PlaybackControls
                stepIndex={stepIndex < 0 ? 0 : stepIndex}
                totalSteps={steps.length}
                isPlaying={isPlaying}
                onPlay={handlePlay} onPause={handlePause}
                onPrev={handlePrev} onNext={handleNext}
                onRewind={handleRewind} onForward={handleForward}
                onScrub={handleScrub}
                speed={speedLevel} onSpeedChange={(v) => { setSpeedLevel(v); setIsPlaying(false) }}
                soundEnabled={soundEnabled}
                onToggleSound={() => {
                  setSoundEnabled((prev) => {
                    const next = !prev
                    if (next) soundRef.current?.playUiSound('click')
                    return next
                  })
                }}
                soundVolume={soundVolume}
                onSoundVolumeChange={setSoundVolume}
              />
            </main>

          </div>
        </div>
      )}

      {/* All Steps Modal — rendered outside the layout so it overlays everything */}
      {showAllSteps && (
        <AllStepsModal
          steps={steps}
          algoName={algoInfo?.name ?? algorithmKey}
          algoViz={algoInfo?.viz}
          stepSnapshots={stepSnapshots}
          currentIndex={stepIndex}
          onJumpTo={(i) => { setIsPlaying(false); seekTo(i); setShowAllSteps(false) }}
          onClose={() => setShowAllSteps(false)}
        />
      )}
    </div>
  )
}
