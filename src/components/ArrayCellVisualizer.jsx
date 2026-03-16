import { motion } from 'framer-motion'
import { useMemo } from 'react'

// Cell/box array visualizer — used for Binary Search, Linear Search, and as secondary for Merge/Quick
export default function ArrayCellVisualizer({ values, actionIndices = [], sortedIndices = [], foundIndex = null, activeRange = null, pointers = [], lastType = null, isDone = false, label = '' }) {
  const pointerMap = useMemo(() => {
    const m = new Map()
    pointers.forEach((p) => {
      if (p.index == null) return
      if (!m.has(p.index)) m.set(p.index, [])
      m.get(p.index).push(p.label)
    })
    return m
  }, [pointers])

  return (
    <div className="acv-root">
      {label && <div className="acv-label">{label}</div>}
      <div className="acv-row">
        {values.map((val, i) => {
          const isAction = actionIndices.includes(i)
          const isSorted = sortedIndices.includes(i)
          const isFound = foundIndex === i
          const isPointer = pointerMap.has(i)
          const isDimmed = activeRange && (i < activeRange[0] || i > activeRange[1])
          const isSwap = isAction && lastType === 'SWAP'
          const isCompare = isAction && lastType === 'COMPARE'
          const isMerge = isAction && lastType === 'OVERWRITE'

          let cls = 'acv-cell'
          if (isDone) cls += ' acv-sorted'
          else if (isSwap) cls += ' acv-swap'
          else if (isCompare) cls += ' acv-compare'
          else if (isMerge) cls += ' acv-merge'
          else if (isFound) cls += ' acv-found'
          else if (isSorted) cls += ' acv-sorted'
          else if (isPointer) cls += ' acv-pointer'
          if (isDimmed && !isDone) cls += ' acv-dim'

          const labels = pointerMap.get(i) || []

          return (
            <div key={i} className="acv-cell-wrap">
              {/* pointer labels above */}
              <div className="acv-ptr-above">
                {labels.map((lbl) => (
                  <motion.span
                    key={lbl}
                    className="acv-ptr-tag"
                    initial={{ y: -4, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  >
                    {lbl}
                  </motion.span>
                ))}
              </div>
              <motion.div
                className={cls}
                layout
                animate={isSwap ? { y: -10 } : isCompare ? { y: -6 } : { y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="acv-val">{val}</span>
                <span className="acv-idx">[{i}]</span>
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
