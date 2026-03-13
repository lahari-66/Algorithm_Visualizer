function ArrayBar({ value, maxValue, state, isInRange }) {
  const height = Math.max((value / maxValue) * 100, 6)
  const classes = ['array-bar', state, isInRange ? '' : 'dim'].join(' ').trim()

  return (
    <div className={classes} style={{ height: `${height}%` }}>
      <span className="bar-value">{value}</span>
    </div>
  )
}

export default ArrayBar
