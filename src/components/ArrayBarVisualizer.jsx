import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

// Bar chart visualizer — used for Bubble, Insertion, Selection, Quick Sort
export default function ArrayBarVisualizer({ values, actionIndices = [], sortedIndices = [], foundIndex = null, activeRange = null, pointers = [], lastType = null, isDone = false }) {
  const maxVal = useMemo(() => Math.max(...values, 1), [values])

  const pointerMap = useMemo(() => {
    const m = new Map()
    pointers.forEach((p) => {
      if (p.index == null) return
      if (!m.has(p.index)) m.set(p.index, [])
      m.get(p.index).push(p.label)
    })
    return m
  }, [pointers])

  const rangeStyle = useMemo(() => {
    if (!activeRange || !values.length) return null
    const [s, e] = activeRange
    const left = (Math.max(0, s) / values.length) * 100
    const width = ((Math.min(e, values.length - 1) - Math.max(0, s) + 1) / values.length) * 100
    return { left: `${left}%`, width: `${width}%` }
  }, [activeRange, values.length])

  return (
    <div className="abv-root">
      {/* Legend */}
      <div className="abv-legend">
        <span className="abv-pill abv-default">Default</span>
        <span className="abv-pill abv-compare">Compare</span>
        <span className="abv-pill abv-swap">Swap</span>
        <span className="abv-pill abv-sorted">Sorted</span>
        {foundIndex !== null && <span className="abv-pill abv-found">Found</span>}
      </div>

      {/* Bar stage */}
      <div className={`abv-stage${isDone ? ' abv-done' : ''}`}>
        {rangeStyle && <div className="abv-range" style={rangeStyle} />}
        {values.map((val, i) => {
          const isAction = actionIndices.includes(i)
          const isSorted = sortedIndices.includes(i)
          const isFound = foundIndex === i
          const isPointer = pointerMap.has(i)
          const isDimmed = activeRange && (i < activeRange[0] || i > activeRange[1])
          const isSwap = isAction && lastType === 'SWAP'
          const isCompare = isAction && lastType === 'COMPARE'

          const h = Math.max((val / maxVal) * 100, 3)
          const lift = isSwap ? -22 : isCompare ? -14 : isPointer ? -8 : 0

          let cls = 'abv-bar'
          if (isDone) cls += ' abv-bar-sorted'
          else if (isSwap) cls += ' abv-bar-swap'
          else if (isCompare) cls += ' abv-bar-compare'
          else if (isFound) cls += ' abv-bar-found'
          else if (isSorted) cls += ' abv-bar-sorted'
          else if (isPointer) cls += ' abv-bar-pointer'
          else cls += ' abv-bar-default'
          if (isDimmed && !isDone) cls += ' abv-bar-dim'

          return (
            <motion.div
              key={i}
              layout
              className={cls}
              style={{ height: `${h}%` }}
              animate={{ y: lift }}
              transition={{ layout: { duration: 0.22, ease: 'easeInOut' }, y: { duration: 0.15 } }}
            >
              {(values.length <= 32 || isAction || isFound) && (
                <span className="abv-bar-label">{val}</span>
              )}
              {isSwap && <span className="abv-swap-icon">⇅</span>}
            </motion.div>
          )
        })}
      </div>

      {/* Index row */}
      {values.length <= 40 && (
        <div className="abv-index-row">
          {values.map((_, i) => (
            <div key={i} className="abv-index-cell">{i}</div>
          ))}
        </div>
      )}

      {/* Pointer tags */}
      <div className="abv-ptr-row">
        {values.map((_, i) => {
          const labels = pointerMap.get(i) || []
          return (
            <div key={i} className="abv-ptr-cell">
              {labels.map((lbl) => (
                <motion.span
                  key={lbl}
                  className="abv-ptr-tag"
                  initial={{ y: -4, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  ▲{lbl}
                </motion.span>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
