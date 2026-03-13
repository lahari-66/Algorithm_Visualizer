import { motion } from 'framer-motion'

function SearchingVisualizer({
  algorithmKey,
  array,
  comparingIndices,
  foundIndex,
  activeRange,
  isRunning,
}) {
  const currentIndex = comparingIndices[0]
  const leftIndex = activeRange ? activeRange[0] : null
  const rightIndex = activeRange ? activeRange[1] : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Search Visualization</h2>
          <p className="text-sm text-slate-400">
            {isRunning ? 'Scanning through the array...' : 'Ready to search.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em]">
          <span className="rounded-full bg-slate-700/60 px-3 py-1 text-slate-200">Default</span>
          <span className="rounded-full bg-yellow-500/30 px-3 py-1 text-yellow-200">Compare</span>
          <span className="rounded-full bg-emerald-500/30 px-3 py-1 text-emerald-200">Found</span>
        </div>
      </div>

      <div className="relative grid gap-3 rounded-2xl border border-teal-400/30 bg-slate-900/60 p-6 sm:grid-cols-2 lg:grid-cols-4">
        {array.map((value, index) => {
          const isCompare = currentIndex === index
          const isFound = foundIndex === index
          const isOutOfRange =
            algorithmKey === 'binary' && activeRange
              ? index < leftIndex || index > rightIndex
              : false

          return (
            <motion.div
              key={`${value}-${index}`}
              className={`rounded-xl border px-4 py-3 text-center text-sm font-semibold ${
                isFound
                  ? 'border-emerald-400/70 bg-emerald-500/20 text-emerald-100'
                  : isCompare
                    ? 'border-yellow-400/70 bg-yellow-500/20 text-yellow-100'
                    : 'border-slate-700/60 bg-slate-900/60 text-slate-200'
              } ${isOutOfRange ? 'opacity-40' : ''}`}
              animate={{ y: isCompare ? -6 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            >
              <div className="text-xs text-slate-400">Index {index}</div>
              <div className="text-lg font-bold">{value}</div>
              {algorithmKey === 'binary' && activeRange ? (
                <div className="mt-2 flex justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cyan-300">
                  {leftIndex === index ? <span>L</span> : null}
                  {currentIndex === index ? <span>M</span> : null}
                  {rightIndex === index ? <span>R</span> : null}
                </div>
              ) : null}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default SearchingVisualizer
