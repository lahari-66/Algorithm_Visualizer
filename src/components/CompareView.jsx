import { useEffect, useMemo, useRef, useState } from 'react'
import { bubbleSortSteps }    from '../algorithms/bubbleSort.js'
import { selectionSortSteps } from '../algorithms/selectionSort.js'
import { insertionSortSteps } from '../algorithms/insertionSort.js'
import { mergeSortSteps }     from '../algorithms/mergeSort.js'
import { quickSortSteps }     from '../algorithms/quickSort.js'
import { heapSortSteps }      from '../algorithms/heapSort.js'
import { countingSortSteps }  from '../algorithms/countingSort.js'
import ArrayBarVisualizer     from './ArrayBarVisualizer.jsx'
import { generateRandomArray, parseInputToArray } from '../utils/arrayGenerator.js'

const ALGO_REGISTRY = [
  { key: 'bubble',    label: 'Bubble Sort',    emoji: '🫧', complexity: 'O(n²)',      color: '#fb7185' },
  { key: 'selection', label: 'Selection Sort', emoji: '🎯', complexity: 'O(n²)',      color: '#fb923c' },
  { key: 'insertion', label: 'Insertion Sort', emoji: '📥', complexity: 'O(n²)',      color: '#fbbf24' },
  { key: 'merge',     label: 'Merge Sort',     emoji: '🔀', complexity: 'O(n log n)', color: '#34d399' },
  { key: 'quick',     label: 'Quick Sort',     emoji: '⚡', complexity: 'O(n log n)', color: '#38bdf8' },
  { key: 'heap',      label: 'Heap Sort',      emoji: '🌲', complexity: 'O(n log n)', color: '#a78bfa' },
  { key: 'counting',  label: 'Counting Sort',  emoji: '🔢', complexity: 'O(n+k)',     color: '#f472b6' },
]

const STEP_FNS = {
  bubble: bubbleSortSteps, selection: selectionSortSteps, insertion: insertionSortSteps,
  merge: mergeSortSteps, quick: quickSortSteps, heap: heapSortSteps, counting: countingSortSteps,
}

const ALGO_MAP = Object.fromEntries(ALGO_REGISTRY.map((a) => [a.key, { ...a, getSteps: STEP_FNS[a.key] }]))
const SPEED_MS = [1200, 600, 280, 100]
const ACTION_TYPES = new Set(['COMPARE', 'SWAP', 'OVERWRITE'])
const MEDALS = ['🥇', '🥈', '🥉', '4️⃣']
const MEDAL_COLORS = ['#fbbf24', '#94a3b8', '#fb923c', '#64748b']

function deriveState(steps, array, idx) {
  const values = [...array]
  const sortedSet = new Set()
  let actionIndices = [], pointers = [], lastType = null, comparisons = 0, swaps = 0
  for (let i = 0; i <= idx; i++) {
    const s = steps[i]; if (!s) break
    lastType = s.type
    pointers = Array.isArray(s.pointers) ? s.pointers : []
    actionIndices = ACTION_TYPES.has(s.type) ? s.indices ?? [] : []
    if (s.type === 'COMPARE') comparisons++
    if (s.type === 'SWAP') { swaps++; const [a,b]=s.indices; const t=values[a]; values[a]=values[b]; values[b]=t }
    if (s.type === 'OVERWRITE') { swaps++; const ix=s.indices?.[0]; if(ix!=null) values[ix]=s.value }
    if (s.type === 'SORTED') s.indices?.forEach((ix) => sortedSet.add(ix))
  }
  return { values, actionIndices, sortedIndices: Array.from(sortedSet), pointers, lastType, comparisons, swaps }
}

function AlgoPanel({ runner, tick, rank, accentColor }) {
  const { steps, inputArray } = runner
  const hasSteps = steps.length > 0
  const ct = hasSteps ? Math.max(-1, Math.min(tick, steps.length - 1)) : -1
  const state = ct >= 0 ? deriveState(steps, inputArray, ct)
    : { values: inputArray, actionIndices: [], sortedIndices: [], pointers: [], lastType: null, comparisons: 0, swaps: 0 }
  const done = hasSteps && ct >= steps.length - 1
  const progress = hasSteps ? Math.round(((ct + 1) / steps.length) * 100) : 0
  const curStep = ct >= 0 ? steps[ct] : null
  const meta = ALGO_MAP[runner.algoKey]

  return (
    <div className={`cv-panel${done ? ' cv-panel-done' : ''}`} style={{ '--panel-accent': accentColor }}>
      <div className="cv-panel-head">
        <div className="cv-panel-title">
          <span className="cv-panel-emoji">{meta?.emoji}</span>
          <div>
            <div className="cv-panel-name">{runner.label}</div>
            <div className="cv-panel-complexity">{meta?.complexity}</div>
          </div>
        </div>
        <div className="cv-panel-badges">
          {rank != null
            ? <span className="cv-rank-badge" style={{ color: MEDAL_COLORS[rank-1] }}>{MEDALS[rank-1]} #{rank}</span>
            : done ? <span className="cv-done-badge">✓ Done</span> : null}
        </div>
      </div>

      <div className="cv-progress-track">
        <div className="cv-progress-fill" style={{ width: `${progress}%`, background: accentColor }} />
      </div>

      <div className="cv-viz-wrap">
        <ArrayBarVisualizer values={state.values} actionIndices={state.actionIndices}
          sortedIndices={state.sortedIndices} activeRange={null} pointers={state.pointers}
          lastType={state.lastType} isDone={done} />
      </div>

      <div className="cv-stats-row">
        <div className="cv-stat"><span className="cv-stat-val" style={{color:'#fbbf24'}}>{state.comparisons}</span><span className="cv-stat-lbl">Compares</span></div>
        <div className="cv-stat"><span className="cv-stat-val" style={{color:'#fb7185'}}>{state.swaps}</span><span className="cv-stat-lbl">Swaps</span></div>
        <div className="cv-stat"><span className="cv-stat-val">{Math.max(0,ct+1)}</span><span className="cv-stat-lbl">Step</span></div>
        <div className="cv-stat"><span className="cv-stat-val">{steps.length}</span><span className="cv-stat-lbl">Total</span></div>
      </div>

      {curStep && (
        <div className="cv-step-desc">
          <span className={`step-type-badge step-type-${curStep.type?.toLowerCase()}`}>{curStep.type}</span>
          <span>{curStep.description}</span>
        </div>
      )}
    </div>
  )
}

function AlgoPickerCard({ algo, selected, disabled, onClick }) {
  return (
    <button type="button"
      className={`cv-picker-card${selected ? ' selected' : ''}${disabled ? ' cv-picker-disabled' : ''}`}
      style={selected ? { borderColor: algo.color, background: `${algo.color}18` } : {}}
      onClick={onClick} disabled={disabled}>
      <span className="cv-picker-emoji">{algo.emoji}</span>
      <span className="cv-picker-label">{algo.label}</span>
      <span className="cv-picker-cx">{algo.complexity}</span>
      {selected && <span className="cv-picker-check" style={{ color: algo.color }}>✓</span>}
    </button>
  )
}

export default function CompareView({ array, speed }) {
  const incoming = useMemo(
    () => (Array.isArray(array) && array.length >= 2 ? array : generateRandomArray(16, 8, 100)),
    [array],
  )

  const [raceArray, setRaceArray]         = useState(incoming)
  const [arraySize, setArraySize]         = useState(Math.max(4, Math.min(50, incoming.length || 16)))
  const [customInput, setCustomInput]     = useState('')
  const [error, setError]                 = useState('')
  const [selectedAlgos, setSelectedAlgos] = useState(['bubble', 'merge', 'quick'])
  const [speedLevel, setSpeedLevel]       = useState(speed ?? 1)
  const [tick, setTick]                   = useState(-1)
  const [isPlaying, setIsPlaying]         = useState(false)
  const [finishOrder, setFinishOrder]     = useState([])
  const [showPicker, setShowPicker]       = useState(false)

  const raceStartRef = useRef(null)
  const prevTickRef  = useRef(-1)

  useEffect(() => { setSpeedLevel(speed ?? 1) }, [speed])

  useEffect(() => {
    const next = Array.isArray(array) && array.length >= 2 ? array : null
    if (!next) return
    setRaceArray(next); setArraySize(Math.max(4, Math.min(50, next.length)))
    setCustomInput(''); setError(''); setTick(-1); setIsPlaying(false); setFinishOrder([])
    prevTickRef.current = -1; raceStartRef.current = null
  }, [array])

  const runners = useMemo(() => selectedAlgos.map((key) => {
    const cfg = ALGO_MAP[key]
    const result = cfg?.getSteps([...raceArray]) ?? { steps: [] }
    return { algoKey: key, label: cfg?.label ?? key, steps: Array.isArray(result.steps) ? result.steps : [], inputArray: [...raceArray] }
  }), [selectedAlgos, raceArray])

  const maxSteps = useMemo(() => runners.reduce((mx, r) => Math.max(mx, r.steps.length), 0), [runners])

  useEffect(() => {
    if (!isPlaying) return
    if (maxSteps <= 0) { setIsPlaying(false); return }
    const timer = setInterval(() => {
      setTick((prev) => { const next = Math.min(prev + 1, maxSteps - 1); if (next >= maxSteps - 1) setIsPlaying(false); return next })
    }, SPEED_MS[speedLevel] ?? 600)
    return () => clearInterval(timer)
  }, [isPlaying, speedLevel, maxSteps])

  useEffect(() => {
    const prevTick = prevTickRef.current
    if (tick < 0 || tick === prevTick) return
    const now = performance.now()
    const newlyDone = runners
      .filter((r) => r.steps.length > 0 && tick >= r.steps.length - 1 && prevTick < r.steps.length - 1)
      .map((r) => ({ algoKey: r.algoKey, label: r.label, finishTick: r.steps.length - 1, elapsedMs: raceStartRef.current ? Math.round(now - raceStartRef.current) : 0 }))
    if (newlyDone.length) setFinishOrder((prev) => { const ex = new Set(prev.map((x) => x.algoKey)); return [...prev, ...newlyDone.filter((x) => !ex.has(x.algoKey))] })
    prevTickRef.current = tick
  }, [tick, runners])

  const handleReset = () => { setIsPlaying(false); setTick(-1); setFinishOrder([]); prevTickRef.current = -1; raceStartRef.current = null }

  const handleToggleAlgo = (key) => {
    setSelectedAlgos((prev) => {
      if (prev.includes(key)) return prev.length <= 2 ? prev : prev.filter((k) => k !== key)
      return prev.length >= 4 ? prev : [...prev, key]
    })
    handleReset()
  }

  const handlePlay = () => {
    if (maxSteps <= 0) return
    if (tick >= maxSteps - 1) { setTick(-1); prevTickRef.current = -1; setFinishOrder([]) }
    if (raceStartRef.current == null || tick < 0) raceStartRef.current = performance.now()
    setIsPlaying(true)
  }

  const handleRandomArray = () => { setRaceArray(generateRandomArray(arraySize, 8, 100)); setCustomInput(''); setError(''); handleReset() }

  const handleApplyCustom = () => {
    const { array: parsed, error: pe } = parseInputToArray(customInput, 50)
    if (pe) { setError(pe); return }
    if (parsed.length < 2) { setError('Enter at least 2 numbers.'); return }
    setRaceArray(parsed); setArraySize(Math.max(4, Math.min(50, parsed.length))); setError(''); handleReset()
  }

  const finishRankMap = useMemo(() => { const m = new Map(); finishOrder.forEach((e,i) => m.set(e.algoKey, i+1)); return m }, [finishOrder])
  const progress = maxSteps > 0 ? Math.round(((tick + 1) / maxSteps) * 100) : 0

  return (
    <div className="cv-root">

      {/* Hero */}
      <div className="cv-hero">
        <div className="cv-hero-left">
          <span className="cv-hero-icon">⚔️</span>
          <div>
            <h2 className="cv-hero-title">Algorithm Race Arena</h2>
            <p className="cv-hero-sub">Run 2–4 sorting algorithms on the same array and compare their performance live.</p>
          </div>
        </div>
        <div className="cv-hero-chips">
          <span className="cv-hero-chip">{selectedAlgos.length} algorithms</span>
          <span className="cv-hero-chip">{raceArray.length} elements</span>
          <span className="cv-hero-chip">{maxSteps} max steps</span>
        </div>
      </div>

      {/* Controls */}
      <div className="cv-controls">
        {/* Array input */}
        <div className="cv-ctrl-group">
          <span className="cv-ctrl-label">Array</span>
          <div className="cv-ctrl-row">
            <div className="cv-input-wrap">
              <label className="cv-input-label">Size</label>
              <input type="number" min="4" max="50" className="cv-input cv-input-sm"
                value={arraySize}
                onChange={(e) => { const n=Math.max(4,Math.min(50,Number(e.target.value))); setArraySize(n); setRaceArray(generateRandomArray(n,8,100)); setCustomInput(''); setError(''); handleReset() }}
                disabled={isPlaying} />
            </div>
            <div className="cv-input-wrap cv-input-grow">
              <label className="cv-input-label">Custom</label>
              <div className="cv-input-row">
                <input type="text" className="cv-input" placeholder="8, 3, 5, 1, 9…"
                  value={customInput} onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCustom()} disabled={isPlaying} />
                <button type="button" className="cv-btn cv-btn-ghost" onClick={handleApplyCustom} disabled={isPlaying}>Apply</button>
              </div>
            </div>
            <button type="button" className="cv-btn cv-btn-ghost" onClick={handleRandomArray} disabled={isPlaying}>🎲 Random</button>
          </div>
          {error && <p className="cv-error">{error}</p>}
        </div>

        <div className="cv-ctrl-divider" />

        {/* Algorithm picker toggle */}
        <div className="cv-ctrl-group">
          <span className="cv-ctrl-label">Algorithms ({selectedAlgos.length}/4)</span>
          <button type="button"
            className={`cv-btn cv-btn-ghost cv-picker-toggle${showPicker ? ' active' : ''}`}
            onClick={() => setShowPicker((p) => !p)} disabled={isPlaying}>
            <span>{selectedAlgos.map((k) => ALGO_MAP[k]?.emoji).join(' ')}</span>
            <span>{showPicker ? '▲' : '▼'} Choose</span>
          </button>
        </div>

        <div className="cv-ctrl-divider" />

        {/* Speed */}
        <div className="cv-ctrl-group">
          <span className="cv-ctrl-label">Speed</span>
          <div className="cv-speed-chips">
            {['Slow','Med','Fast','⚡'].map((lbl, i) => (
              <button key={i} type="button"
                className={`cv-speed-chip${speedLevel === i ? ' active' : ''}`}
                onClick={() => { setSpeedLevel(i); setIsPlaying(false) }}>{lbl}</button>
            ))}
          </div>
        </div>

        <div className="cv-ctrl-divider" />

        {/* Playback */}
        <div className="cv-ctrl-group cv-ctrl-playback">
          <span className="cv-ctrl-label">Playback</span>
          <div className="cv-pb-row">
            <button type="button" className="cv-pb-btn" title="Prev"
              onClick={() => { setIsPlaying(false); setTick((p) => Math.max(-1, p-1)) }}
              disabled={maxSteps <= 0 || tick < 0}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
            </button>
            <button type="button" className={`cv-pb-btn cv-pb-play${isPlaying ? ' playing' : ''}`}
              onClick={isPlaying ? () => setIsPlaying(false) : handlePlay} disabled={maxSteps <= 0}>
              {isPlaying
                ? <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                : <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
            </button>
            <button type="button" className="cv-pb-btn" title="Next"
              onClick={() => { setIsPlaying(false); setTick((p) => Math.min(p+1, maxSteps-1)) }}
              disabled={maxSteps <= 0 || tick >= maxSteps - 1}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 3.9V8.1zM16 6h2v12h-2z"/></svg>
            </button>
            <button type="button" className="cv-btn cv-btn-ghost cv-btn-sm" onClick={handleReset}>↺</button>
          </div>
        </div>
      </div>

      {/* Algorithm picker drawer */}
      {showPicker && (
        <div className="cv-picker-drawer">
          <p className="cv-picker-hint">Select 2–4 algorithms · min 2, max 4 · click to toggle</p>
          <div className="cv-picker-grid">
            {ALGO_REGISTRY.map((algo) => {
              const sel = selectedAlgos.includes(algo.key)
              return (
                <AlgoPickerCard key={algo.key} algo={algo} selected={sel}
                  disabled={((!sel && selectedAlgos.length >= 4) || (sel && selectedAlgos.length <= 2)) || isPlaying}
                  onClick={() => handleToggleAlgo(algo.key)} />
              )
            })}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="cv-timeline">
        <span className="cv-tl-num">{Math.max(0, tick+1)}</span>
        <div className="cv-tl-track">
          <div className="cv-tl-fill" style={{ width: `${progress}%` }} />
          <input type="range" className="cv-tl-input" min="0" max={Math.max(0, maxSteps)}
            value={Math.max(0, tick+1)}
            onChange={(e) => { setIsPlaying(false); setTick(Number(e.target.value)-1); if(raceStartRef.current==null && Number(e.target.value)>0) raceStartRef.current=performance.now() }}
            disabled={maxSteps <= 0} />
        </div>
        <span className="cv-tl-num">{maxSteps}</span>
        <span className="cv-tl-pct">{progress}%</span>
      </div>

      {/* Podium */}
      {finishOrder.length > 0 && (
        <div className="cv-podium">
          <div className="cv-podium-header">
            <span className="cv-podium-title">🏁 Race Results</span>
            <span className="cv-podium-sub">{finishOrder.length}/{runners.length} finished</span>
          </div>
          <div className="cv-podium-rows">
            {finishOrder.map((entry, i) => {
              const color = ALGO_MAP[entry.algoKey]?.color ?? '#94a3b8'
              const pct = Math.round(((entry.finishTick+1) / maxSteps) * 100)
              return (
                <div key={entry.algoKey} className="cv-podium-row">
                  <span className="cv-podium-medal">{MEDALS[i]}</span>
                  <span className="cv-podium-emoji">{ALGO_MAP[entry.algoKey]?.emoji}</span>
                  <span className="cv-podium-name">{entry.label}</span>
                  <div className="cv-podium-bar-wrap">
                    <div className="cv-podium-bar" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <span className="cv-podium-steps">{entry.finishTick+1} steps</span>
                  <span className="cv-podium-time">{entry.elapsedMs} ms</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Panels */}
      <div className={`cv-panels cv-panels-${Math.min(runners.length, 4)}`}>
        {runners.map((runner) => (
          <AlgoPanel key={runner.algoKey} runner={runner} tick={tick}
            rank={finishRankMap.get(runner.algoKey) ?? null}
            accentColor={ALGO_MAP[runner.algoKey]?.color ?? '#38bdf8'} />
        ))}
      </div>

    </div>
  )
}
