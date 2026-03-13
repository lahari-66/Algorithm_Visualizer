import { motion } from 'framer-motion'

const STATE_OFFSETS = {
  default: 0,
  compare: -8,
  swap: -12,
  sorted: -4,
  pivot: -10,
}

function BarArray({ value, maxValue, state, className }) {
  const height = Math.max((value / maxValue) * 100, 6)
  const y = STATE_OFFSETS[state] ?? 0

  return (
    <motion.div
      className={`relative flex flex-1 items-end justify-center rounded-md transition-colors ${className}`}
      style={{ height: `${height}%` }}
      animate={{ y }}
      transition={{ type: 'spring', stiffness: 240, damping: 18 }}
    >
      <span className="pointer-events-none mb-1 text-[10px] text-slate-100/80 opacity-0 transition-opacity group-hover:opacity-100">
        {value}
      </span>
    </motion.div>
  )
}

export default BarArray
