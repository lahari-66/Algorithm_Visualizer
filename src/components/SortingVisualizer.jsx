import { useMemo } from 'react'
import BarArray from './BarArray.jsx'
import HeapTree from './HeapTree.jsx'

const THEMES = {
  bubble: {
    stage: 'bg-slate-900/60 border-sky-400/30',
    base: 'from-sky-300 to-blue-500',
    compare: 'from-yellow-300 to-amber-500',
    swap: 'from-rose-400 to-red-500',
    sorted: 'from-emerald-300 to-green-500',
    pivot: 'from-pink-300 to-fuchsia-500',
    lens: 'from-sky-400/20 to-cyan-400/10',
  },
  merge: {
    stage: 'bg-cyan-950/40 border-cyan-300/30',
    base: 'from-cyan-300 to-sky-500',
    compare: 'from-yellow-300 to-amber-500',
    swap: 'from-rose-400 to-red-500',
    sorted: 'from-emerald-300 to-green-500',
    pivot: 'from-pink-300 to-fuchsia-500',
    lens: 'from-cyan-300/20 to-sky-400/10',
  },
  quick: {
    stage: 'bg-fuchsia-950/30 border-pink-300/30',
    base: 'from-rose-400 to-pink-500',
    compare: 'from-yellow-300 to-amber-500',
    swap: 'from-rose-400 to-red-500',
    sorted: 'from-emerald-300 to-green-500',
    pivot: 'from-pink-300 to-fuchsia-500',
    lens: 'from-pink-400/20 to-fuchsia-400/10',
  },
  heap: {
    stage: 'bg-emerald-950/30 border-emerald-300/30',
    base: 'from-emerald-300 to-green-600',
    compare: 'from-yellow-300 to-amber-500',
    swap: 'from-rose-400 to-red-500',
    sorted: 'from-emerald-200 to-green-400',
    pivot: 'from-pink-300 to-fuchsia-500',
    lens: 'from-emerald-400/20 to-teal-400/10',
  },
}

const buildMergeLevels = (values) => {
  const levels = []
  const visit = (start, end, depth) => {
    if (!levels[depth]) levels[depth] = []
    levels[depth].push({ start, end, values: values.slice(start, end + 1) })
    if (start >= end) return
    const mid = Math.floor((start + end) / 2)
    visit(start, mid, depth + 1)
    visit(mid + 1, end, depth + 1)
  }
  if (values.length) visit(0, values.length - 1, 0)
  return levels
}

function SortingVisualizer({
  algorithmKey,
  array,
  maxValue,
  comparingIndices,
  swappingIndices,
  sortedIndices,
  pivotIndex,
  activeRange,
}) {
  const theme = THEMES[algorithmKey] ?? THEMES.bubble
  const mergeLevels = useMemo(() => buildMergeLevels(array), [array])

  const getState = (index) => {
    if (swappingIndices.includes(index)) return 'swap'
    if (comparingIndices.includes(index)) return 'compare'
    if (pivotIndex === index) return 'pivot'
    if (sortedIndices.includes(index)) return 'sorted'
    return 'default'
  }

  const rangeStyle = () => {
    if (!activeRange || !array.length) return null
    const [start, end] = activeRange
    const safeStart = Math.max(0, Math.min(start, array.length - 1))
    const safeEnd = Math.max(safeStart, Math.min(end, array.length - 1))
    const left = (safeStart / array.length) * 100
    const width = ((safeEnd - safeStart + 1) / array.length) * 100
    return { left: `${left}%`, width: `${width}%` }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Visualization</h2>
          <p className="text-sm text-slate-400">Watch the algorithm transform the array.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em]">
          <span className="rounded-full bg-slate-700/60 px-3 py-1 text-slate-200">Default</span>
          <span className="rounded-full bg-yellow-500/30 px-3 py-1 text-yellow-200">Compare</span>
          <span className="rounded-full bg-rose-500/30 px-3 py-1 text-rose-200">Swap</span>
          <span className="rounded-full bg-emerald-500/30 px-3 py-1 text-emerald-200">Sorted</span>
          {algorithmKey === 'quick' ? (
            <span className="rounded-full bg-pink-500/30 px-3 py-1 text-pink-200">Pivot</span>
          ) : null}
        </div>
      </div>

      <div className={`relative flex h-[380px] items-end gap-2 overflow-hidden rounded-2xl border p-4 ${theme.stage}`}>
        {algorithmKey === 'merge' && activeRange ? (
          <div
            className={`absolute inset-y-2 rounded-xl bg-gradient-to-r ${theme.lens} border border-cyan-300/30`}
            style={rangeStyle()}
          />
        ) : null}
        {array.map((value, index) => {
          const state = getState(index)
          const baseClass = `group bg-gradient-to-b ${theme.base}`
          const stateClass =
            state === 'compare'
              ? `group bg-gradient-to-b ${theme.compare}`
              : state === 'swap'
                ? `group bg-gradient-to-b ${theme.swap}`
                : state === 'sorted'
                  ? `group bg-gradient-to-b ${theme.sorted}`
                  : state === 'pivot'
                    ? `group bg-gradient-to-b ${theme.pivot}`
                    : baseClass

          return (
            <BarArray
              key={`${value}-${index}`}
              value={value}
              maxValue={maxValue}
              state={state}
              className={stateClass}
            />
          )
        })}
      </div>

      {algorithmKey === 'merge' ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-100">Recursive Split Tree</h3>
          <div className="space-y-2">
            {mergeLevels.map((level, levelIndex) => (
              <div key={`level-${levelIndex}`} className="flex flex-wrap gap-2">
                {level.map((segment) => {
                  const isActive =
                    activeRange &&
                    segment.start >= activeRange[0] &&
                    segment.end <= activeRange[1]
                  return (
                    <div
                      key={`${segment.start}-${segment.end}`}
                      className={`rounded-xl border px-3 py-2 text-xs ${
                        isActive
                          ? 'border-cyan-300/60 bg-cyan-500/10 text-cyan-100'
                          : 'border-slate-800/70 bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      [{segment.values.join(', ')}]
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {algorithmKey === 'heap' ? (
        <HeapTree
          values={array}
          highlightIndices={[...new Set([...comparingIndices, ...swappingIndices])]}
        />
      ) : null}
    </div>
  )
}

export default SortingVisualizer
