import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { bubbleSortSteps } from '../algorithms/bubbleSort.js'
import { mergeSortSteps } from '../algorithms/mergeSort.js'
import { quickSortSteps } from '../algorithms/quickSort.js'
import { heapSortSteps } from '../algorithms/heapSort.js'
import { sleep } from '../utils/animationHelper.js'
import ArrayBarVisualizer from './ArrayBarVisualizer.jsx'

const ALGO_MAP = {
  bubble: { label: 'Bubble Sort', getSteps: bubbleSortSteps },
  merge:  { label: 'Merge Sort',  getSteps: mergeSortSteps },
  quick:  { label: 'Quick Sort',  getSteps: quickSortSteps },
  heap:   { label: 'Heap Sort',   getSteps: heapSortSteps },
}

const SPEED_MS = [1200, 600, 280, 120]
const ACTION_TYPES = new Set(['COMPARE', 'SWAP', 'OVERWRITE'])

function deriveCompareState(steps, array, idx) {
  const values = [...array]
  const sortedSet = new Set()
  let actionIndices = [], pointers = [], lastType = null
  let comparisons = 0, swaps = 0
  for (let i = 0; i <= idx; i++) {
    const s = steps[i]; if (!s) break
    lastType = s.type
    pointers = Array.isArray(s.pointers) ? s.pointers : []
    actionIndices = ACTION_TYPES.has(s.type) ? s.indices ?? [] : []
    if (s.type === 'COMPARE') comparisons++
    if (s.type === 'SWAP') { swaps++; const [a,b]=s.indices; const t=values[a]; values[a]=values[b]; values[b]=t }
    if (s.type === 'OVERWRITE') { swaps++; const i2=s.indices?.[0]; if(i2!=null) values[i2]=s.value }
    if (s.type === 'SORTED') s.indices?.forEach(i2=>sortedSet.add(i2))
  }
  return { values, actionIndices, sortedIndices: Array.from(sortedSet), pointers, lastType, comparisons, swaps }
}

function AlgoPanel({ algoKey, array, speed, runSignal }) {
  const [state, setState] = useState(null)
  const [stepIdx, setStepIdx] = useState(-1)
  const [done, setDone] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const runIdRef = useRef(0)

  const steps = useMemo(() => {
    const { steps: s } = ALGO_MAP[algoKey]?.getSteps([...array]) ?? { steps: [] }
    return s
  }, [algoKey, array])

  useEffect(() => {
    setState(null); setStepIdx(-1); setDone(false); setElapsedMs(0)
  }, [array, algoKey])

  useEffect(() => {
    if (!runSignal) return
    const runId = runIdRef.current + 1
    runIdRef.current = runId
    setState(null); setStepIdx(-1); setDone(false)
    const t0 = performance.now()

    ;(async () => {
      for (let i = 0; i < steps.length; i++) {
        if (runIdRef.current !== runId) return
        const s = deriveCompareState(steps, array, i)
        setState(s); setStepIdx(i)
        await sleep(SPEED_MS[speed] ?? 600)
      }
      if (runIdRef.current !== runId) return
      setElapsedMs(Math.round(performance.now() - t0))
      setDone(true)
    })()

    return () => { runIdRef.current++ }
  }, [runSignal])

  const info = ALGO_MAP[algoKey]
  const curStep = steps[stepIdx]

  return (
    <div className={`compare-panel${done ? ' compare-done' : ''}`}>
      <div className="compare-panel-header">
        <span className="compare-algo-name">{info?.label}</span>
        {done && <span className="compare-done-badge">✓ Done</span>}
      </div>

      <ArrayBarVisualizer
        values={state?.values ?? array}
        actionIndices={state?.actionIndices ?? []}
        sortedIndices={state?.sortedIndices ?? []}
        activeRange={null}
        pointers={state?.pointers ?? []}
        lastType={state?.lastType ?? null}
        isDone={done}
      />

      <div className="compare-stats">
        <div className="cstat"><span>Comparisons</span><strong className="compare-color">{state?.comparisons ?? 0}</strong></div>
        <div className="cstat"><span>Swaps/Writes</span><strong className="swap-color">{state?.swaps ?? 0}</strong></div>
        <div className="cstat"><span>Steps</span><strong>{stepIdx + 1} / {steps.length}</strong></div>
        {elapsedMs > 0 && <div className="cstat"><span>Time</span><strong>{elapsedMs} ms</strong></div>}
      </div>

      {curStep && <div className="compare-step-desc">{curStep.description}</div>}
    </div>
  )
}

export default function CompareView({ array, speed }) {
  const [leftAlgo, setLeftAlgo] = useState('bubble')
  const [rightAlgo, setRightAlgo] = useState('merge')
  const [running, setRunning] = useState(false)
  const [runSignal, setRunSignal] = useState(0)

  const handleRun = () => {
    setRunning(true)
    setRunSignal((p) => p + 1)
    // reset running flag after a generous timeout
    setTimeout(() => setRunning(false), 30000)
  }

  const algoOptions = Object.entries(ALGO_MAP)

  return (
    <div className="compare-view">
      <div className="compare-toolbar">
        <div className="compare-selects">
          <div className="compare-select-group">
            <label>Left</label>
            <select value={leftAlgo} onChange={(e) => setLeftAlgo(e.target.value)} disabled={running}>
              {algoOptions.map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <span className="compare-vs">vs</span>
          <div className="compare-select-group">
            <label>Right</label>
            <select value={rightAlgo} onChange={(e) => setRightAlgo(e.target.value)} disabled={running}>
              {algoOptions.map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
        <button type="button" className="btn-primary" onClick={handleRun} disabled={running}>
          {running ? '⏳ Running…' : '▶ Run Both'}
        </button>
      </div>

      <div className="compare-panels">
        <AlgoPanel key={`L-${leftAlgo}`} algoKey={leftAlgo} array={array} speed={speed} runSignal={runSignal} />
        <AlgoPanel key={`R-${rightAlgo}`} algoKey={rightAlgo} array={array} speed={speed} runSignal={runSignal} />
      </div>
    </div>
  )
}
