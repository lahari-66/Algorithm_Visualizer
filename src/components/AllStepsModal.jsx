import { useEffect, useRef, useState } from 'react'

const TYPE_META = {
  COMPARE:      { color: '#fbbf24', label: 'Compare',   icon: '⚖' },
  SWAP:         { color: '#fb7185', label: 'Swap',       icon: '⇅' },
  SORTED:       { color: '#34d399', label: 'Sorted',     icon: '✓' },
  FOUND:        { color: '#38bdf8', label: 'Found',      icon: '◎' },
  OVERWRITE:    { color: '#a78bfa', label: 'Write',      icon: '✎' },
  RANGE:        { color: '#67e8f9', label: 'Range',      icon: '↔' },
  POINTER_MOVE: { color: '#94a3b8', label: 'Pointer',    icon: '→' },
  VISIT:        { color: '#34d399', label: 'Visit',      icon: '●' },
  ENQUEUE:      { color: '#38bdf8', label: 'Enqueue',    icon: '+' },
  DEQUEUE:      { color: '#fb923c', label: 'Dequeue',    icon: '−' },
  BACKTRACK:    { color: '#f472b6', label: 'Backtrack',  icon: '↩' },
  DONE:         { color: '#34d399', label: 'Done',       icon: '★' },
}

// Group consecutive steps of the same type into phases for the summary
function buildPhases(steps) {
  const phases = []
  let cur = null
  steps.forEach((s, i) => {
    if (!cur || cur.type !== s.type) {
      cur = { type: s.type, start: i + 1, end: i + 1, count: 1 }
      phases.push(cur)
    } else {
      cur.end = i + 1
      cur.count++
    }
  })
  return phases
}

export default function AllStepsModal({ steps, algoName, currentIndex, onJumpTo, onClose }) {
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const activeRef = useRef(null)
  const inputRef = useRef(null)

  // Focus search on open
  useEffect(() => { inputRef.current?.focus() }, [])

  // Scroll active step into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [currentIndex])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const allTypes = ['ALL', ...Array.from(new Set(steps.map((s) => s.type)))]
  const phases = buildPhases(steps)

  const filtered = steps
    .map((s, i) => ({ ...s, _i: i }))
    .filter((s) => {
      const matchType = typeFilter === 'ALL' || s.type === typeFilter
      const matchText = !filter || s.description?.toLowerCase().includes(filter.toLowerCase())
      return matchType && matchText
    })

  const comparisons = steps.filter((s) => s.type === 'COMPARE').length
  const swaps       = steps.filter((s) => s.type === 'SWAP').length
  const writes      = steps.filter((s) => s.type === 'OVERWRITE').length

  return (
    /* Backdrop */
    <div className="asm-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="asm-modal" role="dialog" aria-modal="true" aria-label="All Steps">

        {/* ── Header ── */}
        <div className="asm-header">
          <div className="asm-header-left">
            <span className="asm-icon">📋</span>
            <div>
              <div className="asm-title">Complete Step Log</div>
              <div className="asm-subtitle">{algoName} · {steps.length} steps total</div>
            </div>
          </div>
          <button type="button" className="asm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ── Summary bar ── */}
        <div className="asm-summary">
          <div className="asm-stat">
            <span className="asm-stat-val">{steps.length}</span>
            <span className="asm-stat-lbl">Total Steps</span>
          </div>
          <div className="asm-stat-divider" />
          <div className="asm-stat">
            <span className="asm-stat-val" style={{ color: '#fbbf24' }}>{comparisons}</span>
            <span className="asm-stat-lbl">Comparisons</span>
          </div>
          <div className="asm-stat-divider" />
          <div className="asm-stat">
            <span className="asm-stat-val" style={{ color: '#fb7185' }}>{swaps}</span>
            <span className="asm-stat-lbl">Swaps</span>
          </div>
          {writes > 0 && (
            <>
              <div className="asm-stat-divider" />
              <div className="asm-stat">
                <span className="asm-stat-val" style={{ color: '#a78bfa' }}>{writes}</span>
                <span className="asm-stat-lbl">Writes</span>
              </div>
            </>
          )}
          <div className="asm-stat-divider" />
          <div className="asm-stat">
            <span className="asm-stat-val" style={{ color: '#67e8f9' }}>{phases.length}</span>
            <span className="asm-stat-lbl">Phases</span>
          </div>
        </div>

        {/* ── Phase overview ── */}
        <div className="asm-phases">
          {phases.map((ph, i) => {
            const meta = TYPE_META[ph.type] ?? { color: '#94a3b8', label: ph.type, icon: '·' }
            return (
              <span key={i} className="asm-phase-chip"
                style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}35` }}>
                {meta.icon} {meta.label} ×{ph.count}
              </span>
            )
          })}
        </div>

        {/* ── Filters ── */}
        <div className="asm-filters">
          <div className="asm-search-wrap">
            <svg className="asm-search-icon" viewBox="0 0 24 24" width="14" height="14"
              fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input ref={inputRef} type="text" className="asm-search"
              placeholder="Search steps…" value={filter}
              onChange={(e) => setFilter(e.target.value)} />
            {filter && (
              <button type="button" className="asm-search-clear" onClick={() => setFilter('')}>✕</button>
            )}
          </div>
          <div className="asm-type-filters">
            {allTypes.map((t) => {
              const meta = t === 'ALL' ? { color: '#94a3b8', label: 'All' } : (TYPE_META[t] ?? { color: '#94a3b8', label: t })
              return (
                <button key={t} type="button"
                  className={`asm-type-chip${typeFilter === t ? ' active' : ''}`}
                  style={typeFilter === t ? { background: `${meta.color}22`, color: meta.color, borderColor: `${meta.color}55` } : {}}
                  onClick={() => setTypeFilter(t)}>
                  {meta.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Step list ── */}
        <div className="asm-list">
          {filtered.length === 0 ? (
            <div className="asm-empty">No steps match your filter.</div>
          ) : (
            filtered.map((step) => {
              const i = step._i
              const meta = TYPE_META[step.type] ?? { color: '#94a3b8', label: step.type, icon: '·' }
              const isActive = i === currentIndex
              return (
                <button
                  key={i}
                  ref={isActive ? activeRef : null}
                  type="button"
                  className={`asm-row${isActive ? ' asm-row-active' : ''}`}
                  onClick={() => onJumpTo(i)}
                  title="Click to jump to this step"
                >
                  {/* Step number */}
                  <span className="asm-row-num">#{i + 1}</span>

                  {/* Type icon */}
                  <span className="asm-row-icon"
                    style={{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}44` }}>
                    {meta.icon}
                  </span>

                  {/* Type badge */}
                  <span className="asm-row-badge"
                    style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}40` }}>
                    {meta.label}
                  </span>

                  {/* Description */}
                  <span className="asm-row-desc">{step.description}</span>

                  {/* Indices */}
                  {step.indices?.length > 0 && step.indices[0] >= 0 && (
                    <span className="asm-row-indices">
                      {step.indices.map((idx) => (
                        <span key={idx} className="asm-row-idx">[{idx}]</span>
                      ))}
                    </span>
                  )}

                  {/* Active indicator */}
                  {isActive && <span className="asm-row-here">← here</span>}
                </button>
              )
            })
          )}
        </div>

        {/* ── Footer ── */}
        <div className="asm-footer">
          <span className="asm-footer-hint">Click any step to jump the visualization to that point · Esc to close</span>
          <button type="button" className="btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  )
}
