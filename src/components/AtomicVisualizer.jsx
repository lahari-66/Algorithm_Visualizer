import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import HeapTree from './HeapTree.jsx'
import MergeTree from './MergeTree.jsx'
import QuickTree from './QuickTree.jsx'
import { sleep } from '../utils/animationHelper.js'

const ACTION_TYPES = new Set(['COMPARE', 'SWAP', 'OVERWRITE'])

const buildPointerMap = (pointers) => {
  const map = new Map()
  pointers.forEach((pointer) => {
    if (pointer.index === null || pointer.index === undefined) return
    if (!map.has(pointer.index)) map.set(pointer.index, [])
    map.get(pointer.index).push(pointer.label)
  })
  return map
}

const normalizePointers = (pointers) => {
  if (!pointers) return []
  if (Array.isArray(pointers)) return pointers
  return Object.entries(pointers).map(([label, index]) => ({ label, index }))
}

function AtomicVisualizer({
  algorithmKey,
  algorithmType,
  array,
  steps,
  speed,
  isRunning,
  isPaused,
  startIndex = 0,
  seekIndex,
  currentIndex,
  onStepChange,
  onComplete,
}) {
  const [items, setItems] = useState([])
  const [actionIndices, setActionIndices] = useState([])
  const [sortedIndices, setSortedIndices] = useState([])
  const [foundIndex, setFoundIndex] = useState(null)
  const [activeRange, setActiveRange] = useState(null)
  const [pointers, setPointers] = useState([])
  const [lastStepType, setLastStepType] = useState(null)
  const [compareCount, setCompareCount] = useState(0)
  const [swapCount, setSwapCount] = useState(0)
  const [isDone, setIsDone] = useState(false)

  const runIdRef = useRef(0)
  const pausedRef = useRef(false)

  const maxValue = useMemo(() => (array.length ? Math.max(...array, 1) : 1), [array])

  useEffect(() => {
    const runId = runIdRef.current + 1
    runIdRef.current = runId
    setItems(array.map((value, index) => ({ id: `${runId}-${index}`, value })))
    setActionIndices([])
    setSortedIndices([])
    setFoundIndex(null)
    setActiveRange(null)
    setPointers([])
    setLastStepType(null)
    setCompareCount(0)
    setSwapCount(0)
    setIsDone(false)
  }, [array])

  useEffect(() => {
    pausedRef.current = isPaused
  }, [isPaused])

  const applyStep = (step) => {
    const nextPointers = normalizePointers(step.pointers)
    setPointers(nextPointers)

    if (step.activeRange) {
      setActiveRange(step.activeRange)
    } else if (step.type === 'RANGE') {
      setActiveRange(step.indices)
    }

    if (ACTION_TYPES.has(step.type)) {
      setActionIndices(step.indices ?? [])
    } else {
      setActionIndices([])
    }

    if (step.type === 'COMPARE') {
      setCompareCount((prev) => prev + 1)
    }

    if (step.type === 'SWAP') {
      setSwapCount((prev) => prev + 1)
      setItems((prev) => {
        const next = [...prev]
        const [first, second] = step.indices
        const temp = next[first]
        next[first] = next[second]
        next[second] = temp
        return next
      })
    }

    if (step.type === 'OVERWRITE') {
      setItems((prev) => {
        const next = [...prev]
        const index = step.indices?.[0]
        if (index === null || index === undefined) return next
        next[index] = { ...next[index], value: step.value }
        return next
      })
    }

    if (step.type === 'SORTED') {
      setSortedIndices((prev) => {
        const merged = new Set(prev)
        step.indices?.forEach((index) => merged.add(index))
        return Array.from(merged)
      })
    }

    if (step.type === 'FOUND') {
      const nextIndex = step.indices?.[0]
      setFoundIndex(typeof nextIndex === 'number' && nextIndex >= 0 ? nextIndex : null)
    }
    setLastStepType(step.type)
  }

  const deriveStateAtIndex = (targetIndex) => {
    const values = [...array]
    const sortedSet = new Set()
    let nextPointers = []
    let nextActiveRange = null
    let nextActionIndices = []
    let nextFoundIndex = null
    let nextLastStepType = null
    let nextCompareCount = 0
    let nextSwapCount = 0

    for (let i = 0; i <= targetIndex; i += 1) {
      const step = steps[i]
      if (!step) break
      nextPointers = normalizePointers(step.pointers)
      if (step.activeRange) {
        nextActiveRange = step.activeRange
      } else if (step.type === 'RANGE') {
        nextActiveRange = step.indices
      }
      nextActionIndices = ACTION_TYPES.has(step.type) ? step.indices ?? [] : []

      if (step.type === 'COMPARE') nextCompareCount += 1

      if (step.type === 'SWAP') {
        nextSwapCount += 1
        const [first, second] = step.indices
        const temp = values[first]
        values[first] = values[second]
        values[second] = temp
      }

      if (step.type === 'OVERWRITE') {
        const index = step.indices?.[0]
        if (index !== null && index !== undefined) {
          values[index] = step.value
        }
      }

      if (step.type === 'SORTED') {
        step.indices?.forEach((index) => sortedSet.add(index))
      }

      if (step.type === 'FOUND') {
        const index = step.indices?.[0]
        nextFoundIndex = typeof index === 'number' && index >= 0 ? index : null
      }
      nextLastStepType = step.type
    }

    return {
      values,
      sortedIndices: Array.from(sortedSet),
      pointers: nextPointers,
      activeRange: nextActiveRange,
      actionIndices: nextActionIndices,
      foundIndex: nextFoundIndex,
      lastStepType: nextLastStepType,
      compareCount: nextCompareCount,
      swapCount: nextSwapCount,
    }
  }

  const syncStateFromSnapshot = (snapshot) => {
    setItems((prev) =>
      snapshot.values.map((value, index) => ({
        id: prev[index]?.id ?? `${runIdRef.current}-${index}`,
        value,
      }))
    )
    setSortedIndices(snapshot.sortedIndices)
    setPointers(snapshot.pointers)
    setActiveRange(snapshot.activeRange)
    setActionIndices(snapshot.actionIndices)
    setFoundIndex(snapshot.foundIndex)
    setLastStepType(snapshot.lastStepType ?? null)
    setCompareCount(snapshot.compareCount ?? 0)
    setSwapCount(snapshot.swapCount ?? 0)
  }

  const pauseIfNeeded = async (runId) => {
    while (pausedRef.current) {
      if (runIdRef.current !== runId) return false
      await sleep(60)
    }
    return runIdRef.current === runId
  }

  useEffect(() => {
    if (seekIndex === null || seekIndex === undefined) return
    if (!steps.length) return

    const clamped = Math.max(0, Math.min(seekIndex, steps.length - 1))
    const snapshot = deriveStateAtIndex(clamped)
    syncStateFromSnapshot(snapshot)
    if (onStepChange) onStepChange(clamped, steps[clamped])
  }, [seekIndex, steps, array, onStepChange])

  useEffect(() => {
    if (!isRunning || !steps.length) return

    const runId = runIdRef.current + 1
    runIdRef.current = runId
    const startAt = Math.max(0, Math.min(startIndex, steps.length))

    if (startAt > 0) {
      const snapshot = deriveStateAtIndex(startAt - 1)
      syncStateFromSnapshot(snapshot)
      if (onStepChange) onStepChange(startAt - 1, steps[startAt - 1])
    }

    const run = async () => {
      for (let i = startAt; i < steps.length; i += 1) {
        if (runIdRef.current !== runId) return
        const canContinue = await pauseIfNeeded(runId)
        if (!canContinue) return

        const step = steps[i]
        applyStep(step)
        if (onStepChange) onStepChange(i, step)
        await sleep(speed)
      }

      if (runIdRef.current !== runId) return
      setIsDone(true)
      if (onComplete) onComplete()
    }

    run()

    return () => {
      runIdRef.current += 1
    }
  }, [isRunning, steps, speed, onStepChange, onComplete, startIndex])

  const pointerMap = useMemo(() => buildPointerMap(pointers), [pointers])
  const pointerIndices = useMemo(() => Array.from(pointerMap.keys()), [pointerMap])
  const pointerByLabel = useMemo(() => {
    const map = new Map()
    pointers.forEach((pointer) => {
      if (pointer.label && pointer.index !== null && pointer.index !== undefined) {
        map.set(pointer.label, pointer.index)
      }
    })
    return map
  }, [pointers])

  const rangeStyle = useMemo(() => {
    if (!activeRange || !items.length) return null
    const [start, end] = activeRange
    const safeStart = Math.max(0, Math.min(start, items.length - 1))
    const safeEnd = Math.max(safeStart, Math.min(end, items.length - 1))
    const left = (safeStart / items.length) * 100
    const width = ((safeEnd - safeStart + 1) / items.length) * 100
    return { left: `${left}%`, width: `${width}%` }
  }, [activeRange, items.length])

  const moveDuration = Math.max(0.18, Math.min(0.65, speed / 1100))
  const pointerLegend = getPointerLegend(algorithmKey)
  const isTreeView = ['merge', 'quick', 'heap'].includes(algorithmKey)
  const heapBoundaryIndex = algorithmKey === 'heap' && activeRange ? activeRange[1] : null
  const heapParent = pointerByLabel.get('P')
  const heapLeft = pointerByLabel.get('L')
  const heapRight = pointerByLabel.get('R')
  const quickPivot = algorithmKey === 'quick' ? pointerByLabel.get('P') : null
  const mergeState =
    algorithmKey === 'merge' && activeRange
      ? {
          phase: ['COMPARE', 'OVERWRITE'].includes(lastStepType) ? 'merge' : 'start',
        }
      : null

  // progress 0-100
  const stepProgress = steps.length > 0 ? Math.round(((currentIndex ?? 0) / (steps.length - 1)) * 100) : 0
  const showStats = steps.length > 0
  const isSwapStep = lastStepType === 'SWAP'
  const isCompareStep = lastStepType === 'COMPARE'

  return (
    <div className="viz-root">
      {/* Header row: title + legend pills */}
      <div className="viz-header">
        <div>
          <h2 className="viz-title">Visualization</h2>
          <p className="viz-subtitle">Follow every micro-step as the algorithm moves data.</p>
        </div>
        <div className="viz-legend">
          <span className="viz-pill default">Default</span>
          <span className="viz-pill pointer">Pointer</span>
          <span className={`viz-pill action${isCompareStep ? ' pulse' : ''}`}>Compare</span>
          <span className={`viz-pill swap${isSwapStep ? ' pulse' : ''}`}>Swap</span>
          <span className="viz-pill sorted">Sorted</span>
          {algorithmType === 'search' ? <span className="viz-pill found">Found</span> : null}
        </div>
      </div>

      {/* Stats bar */}
      {showStats ? (
        <div className="viz-stats">
          <div className="viz-stat">
            <span className="viz-stat-label">Comparisons</span>
            <span className="viz-stat-value compare-color">{compareCount}</span>
          </div>
          {algorithmType === 'sort' ? (
            <div className="viz-stat">
              <span className="viz-stat-label">Swaps</span>
              <span className="viz-stat-value swap-color">{swapCount}</span>
            </div>
          ) : null}
          <div className="viz-stat viz-stat-progress">
            <span className="viz-stat-label">Progress</span>
            <div className="viz-progress-track">
              <motion.div
                className="viz-progress-fill"
                animate={{ width: `${stepProgress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <span className="viz-stat-value">{stepProgress}%</span>
          </div>
          {isDone ? (
            <motion.div
              className="viz-done-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {algorithmType === 'search' && foundIndex !== null ? '✓ Found' : algorithmType === 'search' ? '✗ Not Found' : '✓ Sorted'}
            </motion.div>
          ) : null}
        </div>
      ) : null}

      {/* Main visualization area */}
      {isTreeView ? (
        <div className="viz-tree-container">
          {algorithmKey === 'merge' ? (
            <MergeTree
              values={items.map((item) => item.value)}
              activeRange={activeRange}
              mergeState={mergeState}
            />
          ) : null}
          {algorithmKey === 'quick' ? (
            <QuickTree
              values={items.map((item) => item.value)}
              steps={steps}
              currentIndex={currentIndex}
              activeRange={activeRange}
              pivotIndex={quickPivot}
            />
          ) : null}
          {algorithmKey === 'heap' ? (
            <HeapTree
              values={items.map((item) => item.value)}
              highlightIndices={[...new Set([...actionIndices, ...pointerIndices])]}
              activeRange={activeRange}
            />
          ) : null}
        </div>
      ) : null}

      {/* Bar chart — always shown, even for tree views as secondary */}
      <div className={`viz-bar-stage${isDone ? ' viz-done' : ''}`}>
        {rangeStyle ? (
          <div className="viz-range-highlight" style={rangeStyle} />
        ) : null}
        {items.map((item, index) => {
          const isAction = actionIndices.includes(index)
          const isSorted = sortedIndices.includes(index)
          const isPointer = pointerMap.has(index)
          const isFound = foundIndex === index
          const isDimmed = activeRange && (index < activeRange[0] || index > activeRange[1])
          const isSwap = isAction && lastStepType === 'SWAP'
          const isCompare = isAction && lastStepType === 'COMPARE'

          const height = Math.max((item.value / maxValue) * 100, 4)
          const lift = isSwap ? -20 : isCompare ? -14 : isPointer ? -8 : 0

          let barClass = 'viz-bar'
          if (isDone && algorithmType === 'sort') barClass += ' viz-bar-done'
          else if (isSwap) barClass += ' viz-bar-swap'
          else if (isCompare) barClass += ' viz-bar-compare'
          else if (isFound) barClass += ' viz-bar-found'
          else if (isSorted) barClass += ' viz-bar-sorted'
          else if (isPointer) barClass += ' viz-bar-pointer'
          else barClass += ' viz-bar-default'

          if (isDimmed && !isDone) barClass += ' viz-bar-dim'

          // show value label when few bars or on action
          const showLabel = items.length <= 30 || isAction || isFound

          return (
            <motion.div
              key={item.id}
              layout
              className={barClass}
              style={{ height: `${height}%` }}
              animate={{ y: lift }}
              transition={{
                layout: { duration: moveDuration, ease: 'easeInOut' },
                y: { duration: Math.max(0.14, moveDuration * 0.65), ease: 'easeOut' },
              }}
            >
              {showLabel ? (
                <span className="viz-bar-label">{item.value}</span>
              ) : null}
              {isSwap ? <span className="viz-swap-icon">⇅</span> : null}
            </motion.div>
          )
        })}
      </div>

      {/* Index row */}
      {items.length <= 40 ? (
        <div className="viz-index-row">
          {items.map((item, index) => (
            <div key={`idx-${item.id}`} className="viz-index-cell">
              {index}
            </div>
          ))}
        </div>
      ) : null}

      {/* Pointer tags row */}
      <div className="viz-pointer-row">
        {items.map((item, index) => {
          const labels = pointerMap.get(index) || []
          return (
            <div key={`ptr-${item.id}`} className="viz-pointer-cell">
              {labels.map((label) => (
                <motion.span
                  key={label}
                  className="viz-pointer-tag"
                  initial={{ y: -4, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  ▲ {label}
                </motion.span>
              ))}
            </div>
          )
        })}
      </div>

      {/* Pointer legend */}
      {pointerLegend.length ? (
        <div className="viz-pointer-legend">
          {pointerLegend.map((item) => (
            <div key={item.label} className="viz-legend-item">
              <span className="viz-legend-tag">{item.label}</span>
              <span className="viz-legend-desc">{item.description}</span>
            </div>
          ))}
        </div>
      ) : null}

      {/* Heap cues */}
      {algorithmKey === 'heap' ? (
        <div className="viz-heap-cues">
          <div className="viz-heap-cues-label">Heap Cues</div>
          <div className="viz-heap-cues-grid">
            <div className="heap-cue">
              <span>P</span>
              <strong>{heapParent !== undefined ? items[heapParent]?.value ?? '–' : '–'}</strong>
              <small>Parent</small>
            </div>
            <div className="heap-cue">
              <span>L</span>
              <strong>{heapLeft !== undefined ? items[heapLeft]?.value ?? '–' : '–'}</strong>
              <small>Left child</small>
            </div>
            <div className="heap-cue">
              <span>R</span>
              <strong>{heapRight !== undefined ? items[heapRight]?.value ?? '–' : '–'}</strong>
              <small>Right child</small>
            </div>
          </div>
          {heapBoundaryIndex !== null ? (
            <div className="viz-heap-boundary">Heap boundary at position {heapBoundaryIndex + 1}</div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

const getPointerLegend = (algorithmKey) => {
  switch (algorithmKey) {
    case 'bubble':
      return [
        { label: 'I', description: 'Current pass number.' },
        { label: 'J', description: 'Scanning index.' },
        { label: 'J+1', description: 'Neighbor being compared.' },
        { label: 'END', description: 'Last unsorted position.' },
      ]
    case 'merge':
      return [
        { label: 'L', description: 'Left half pointer.' },
        { label: 'R', description: 'Right half pointer.' },
        { label: 'W', description: 'Write position.' },
        { label: 'MID', description: 'Split midpoint.' },
        { label: 'S', description: 'Range start.' },
        { label: 'E', description: 'Range end.' },
      ]
    case 'quick':
      return [
        { label: 'P', description: 'Pivot position.' },
        { label: 'I', description: 'Boundary for smaller items.' },
        { label: 'J', description: 'Scanning index.' },
        { label: 'L', description: 'Range start.' },
        { label: 'R', description: 'Range end.' },
      ]
    case 'heap':
      return [
        { label: 'P', description: 'Current parent.' },
        { label: 'L', description: 'Left child.' },
        { label: 'R', description: 'Right child.' },
        { label: 'E', description: 'Heap boundary.' },
      ]
    case 'linear':
      return [{ label: 'I', description: 'Current index.' }]
    case 'binary':
      return [
        { label: 'L', description: 'Left boundary.' },
        { label: 'M', description: 'Middle index.' },
        { label: 'R', description: 'Right boundary.' },
      ]
    default:
      return []
  }
}

export default AtomicVisualizer
