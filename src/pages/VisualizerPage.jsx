import { useCallback, useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import InputStage from '../components/InputStage.jsx'
import VisualizerCanvas from '../components/VisualizerCanvas.jsx'
import PlaybackControls from '../components/PlaybackControls.jsx'
import StepsPanel from '../components/StepsPanel.jsx'
import StatisticsPanel from '../components/StatisticsPanel.jsx'
import StepTutor from '../components/StepTutor.jsx'
import CompareView from '../components/CompareView.jsx'
import { bubbleSortSteps } from '../algorithms/bubbleSort.js'
import { mergeSortSteps } from '../algorithms/mergeSort.js'
import { quickSortSteps } from '../algorithms/quickSort.js'
import { heapSortSteps } from '../algorithms/heapSort.js'
import { linearSearchSteps } from '../algorithms/linearSearch.js'
import { binarySearchSteps } from '../algorithms/binarySearch.js'
import { applyTheme } from '../theme.js'

const ALGO_MAP = {
  bubble: { name: 'Bubble Sort',   type: 'sort',   viz: 'bar',   getSteps: bubbleSortSteps },
  merge:  { name: 'Merge Sort',    type: 'sort',   viz: 'merge', getSteps: mergeSortSteps },
  quick:  { name: 'Quick Sort',    type: 'sort',   viz: 'bar',   getSteps: quickSortSteps },
  heap:   { name: 'Heap Sort',     type: 'sort',   viz: 'heap',  getSteps: heapSortSteps },
  linear: { name: 'Linear Search', type: 'search', viz: 'cell',  getSteps: linearSearchSteps },
  binary: { name: 'Binary Search', type: 'search', viz: 'cell',  getSteps: binarySearchSteps },
}

const SPEED_MS = [1400, 700, 300, 120]
const ACTION_TYPES = new Set(['COMPARE', 'SWAP', 'OVERWRITE'])

function deriveState(steps, array, targetIndex) {
  const values = [...array]
  const sortedSet = new Set()
  let actionIndices = [], pointers = [], lastType = null
  let foundIndex = null, activeRange = null
  let comparisons = 0, swaps = 0

  for (let i = 0; i <= targetIndex; i++) {
    const step = steps[i]; if (!step) break
    lastType = step.type
    pointers = Array.isArray(step.pointers) ? step.pointers : []
    if (step.activeRange) activeRange = step.activeRange
    else if (step.type === 'RANGE') activeRange = step.indices
    actionIndices = ACTION_TYPES.has(step.type) ? step.indices ?? [] : []
    if (step.type === 'COMPARE') comparisons++
    if (step.type === 'SWAP') {
      swaps++
      const [a, b] = step.indices
      const t = values[a]; values[a] = values[b]; values[b] = t
    }
    if (step.type === 'OVERWRITE') {
      swaps++
      const idx = step.indices?.[0]
      if (idx != null) values[idx] = step.value
    }
    if (step.type === 'SORTED') step.indices?.forEach((idx) => sortedSet.add(idx))
    if (step.type === 'FOUND') {
      const idx = step.indices?.[0]
      foundIndex = typeof idx === 'number' && idx >= 0 ? idx : null
    }
  }

  const sortedIndices = Array.from(sortedSet)
  const isDone = targetIndex >= steps.length - 1
  return { values, actionIndices, sortedIndices, foundIndex, activeRange, pointers, lastType, comparisons, swaps, isDone }
}

export default function VisualizerPage() {
  const [theme, setTheme] = useState('dark')
  const [compareMode, setCompareMode] = useState(false)
  const [stage, setStage] = useState('input')

  const [algorithmKey, setAlgorithmKey] = useState('bubble')
  const [baseArray, setBaseArray] = useState([])
  const [speedLevel, setSpeedLevel] = useState(1)
  const [steps, setSteps] = useState([])
  const [elapsedMs, setElapsedMs] = useState(0)
  const [stepIndex, setStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const [vizState, setVizState] = useState(null)

  const playIntervalRef = useRef(null)

  useEffect(() => { applyTheme(theme) }, [theme])

  const seekTo = useCallback((idx) => {
    if (!steps.length) return
    const clamped = Math.max(0, Math.min(idx, steps.length - 1))
    setStepIndex(clamped)
    setVizState(deriveState(steps, baseArray, clamped))
  }, [steps, baseArray])

  useEffect(() => {
    if (!isPlaying) { clearInterval(playIntervalRef.current); return }
    const ms = SPEED_MS[speedLevel] ?? 700
    playIntervalRef.current = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1
        if (next >= steps.length) { setIsPlaying(false); return prev }
        setVizState(deriveState(steps, baseArray, next))
        return next
      })
    }, ms)
    return () => clearInterval(playIntervalRef.current)
  }, [isPlaying, speedLevel, steps, baseArray])

  const handleStart = ({ algorithmKey: key, array: arr, speedLevel: spd, targetValue: tv }) => {
    let workingArray = [...arr]
    if (key === 'binary') workingArray = [...arr].sort((a, b) => a - b)
    const t0 = performance.now()
    const { steps: nextSteps } = ALGO_MAP[key].getSteps(workingArray, tv)
    const elapsed = Math.round(performance.now() - t0)
    setAlgorithmKey(key)
    setBaseArray(workingArray)
    setSpeedLevel(spd)
    setSteps(nextSteps)
    setElapsedMs(elapsed)
    setStepIndex(-1)
    setVizState(null)
    setIsPlaying(false)
    setStage('playback')
    setShowSteps(false)
  }

  const handlePlay    = () => { if (stepIndex >= steps.length - 1) seekTo(0); setIsPlaying(true) }
  const handlePause   = () => setIsPlaying(false)
  const handlePrev    = () => { setIsPlaying(false); seekTo(Math.max(0, stepIndex - 1)) }
  const handleNext    = () => { setIsPlaying(false); seekTo(Math.min(steps.length - 1, stepIndex + 1)) }
  const handleRewind  = () => { setIsPlaying(false); seekTo(0) }
  const handleForward = () => { setIsPlaying(false); seekTo(steps.length - 1) }
  const handleScrub   = (v) => { setIsPlaying(false); seekTo(v) }
  const handleReset   = () => { setIsPlaying(false); setStage('input'); setSteps([]); setStepIndex(-1); setVizState(null) }

  const algoInfo = ALGO_MAP[algorithmKey]
  const activeStep = steps[stepIndex] ?? null
  const comparisons = vizState?.comparisons ?? 0
  const swaps = vizState?.swaps ?? 0

  return (
    <div className="app-shell">
      <Navbar
        theme={theme}
        onThemeChange={setTheme}
        onHome={handleReset}
        compareMode={compareMode}
        onToggleCompare={() => setCompareMode((p) => !p)}
      />

      {compareMode ? (
        <div className="compare-mode-wrap">
          <CompareView array={baseArray.length ? baseArray : [8,3,5,1,9,2,7,4]} speed={speedLevel} />
        </div>
      ) : stage === 'input' ? (
        <InputStage onStart={handleStart} />
      ) : (
        <div className="execution-layout">
          <aside className="sidebar-left">
            <StatisticsPanel
              algorithmKey={algorithmKey}
              comparisons={comparisons}
              swaps={swaps}
              currentStep={stepIndex}
              totalSteps={steps.length}
              elapsedMs={elapsedMs}
            />
            <StepTutor step={activeStep} stepIndex={stepIndex} />
          </aside>

          <main className="viz-main">
            <div className="viz-topbar">
              <button type="button" className="btn-ghost btn-sm" onClick={handleReset}>← New Input</button>
              <span className="viz-algo-label">{algoInfo?.name}</span>
              <button
                type="button"
                className={`btn-ghost btn-sm${showSteps ? ' active' : ''}`}
                onClick={() => setShowSteps((p) => !p)}
              >📋 Steps</button>
            </div>

            <VisualizerCanvas
              algorithmKey={algorithmKey}
              baseArray={baseArray}
              vizState={vizState}
              steps={steps}
              stepIndex={stepIndex}
            />

            <PlaybackControls
              stepIndex={stepIndex < 0 ? 0 : stepIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onPrev={handlePrev}
              onNext={handleNext}
              onRewind={handleRewind}
              onForward={handleForward}
              onScrub={handleScrub}
              speed={speedLevel}
              onSpeedChange={(v) => { setSpeedLevel(v); setIsPlaying(false) }}
            />

            {activeStep && (
              <div className="current-step-banner">
                <span className={`step-type-badge step-type-${activeStep.type?.toLowerCase()}`}>{activeStep.type}</span>
                <span className="current-step-text">{activeStep.description}</span>
              </div>
            )}
          </main>

          {showSteps && (
            <aside className="sidebar-right">
              <StepsPanel
                steps={steps}
                currentIndex={stepIndex}
                onSelectStep={(idx) => { setIsPlaying(false); seekTo(idx) }}
                onClose={() => setShowSteps(false)}
              />
            </aside>
          )}
        </div>
      )}
    </div>
  )
}
