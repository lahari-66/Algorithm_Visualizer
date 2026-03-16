import { useEffect, useRef } from 'react'

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

function StepItem({ step, index, isActive, onClick, ref: refProp }) {
  const meta = TYPE_META[step.type] ?? { color: '#94a3b8', label: step.type, icon: '·' }
  return (
    <button
      ref={refProp}
      type="button"
      className={`sep-step-item${isActive ? ' active' : ''}`}
      onClick={onClick}
    >
      <div className="sep-step-left">
        <span className="sep-step-num">#{index + 1}</span>
        <span
          className="sep-step-icon"
          style={{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}44` }}
        >
          {meta.icon}
        </span>
      </div>
      <div className="sep-step-body">
        <span
          className="sep-step-badge"
          style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}40` }}
        >
          {meta.label}
        </span>
        <p className="sep-step-desc">{step.description}</p>
        {step.indices?.length > 0 && step.indices[0] >= 0 && (
          <div className="sep-step-indices">
            {step.indices.map((idx) => (
              <span key={idx} className="sep-step-idx">[{idx}]</span>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}

export default function StepsPanel({ steps, currentIndex, onSelectStep, onClose }) {
  const activeRef = useRef(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [currentIndex])

  const progress = steps.length > 0 ? Math.round(((currentIndex + 1) / steps.length) * 100) : 0

  return (
    <div className="sep-panel">
      {/* Header */}
      <div className="sep-header">
        <div className="sep-header-left">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 12h6M9 16h4" />
          </svg>
          <span className="sep-title">Step-by-Step Explanation</span>
        </div>
        <button type="button" className="sep-close" onClick={onClose} aria-label="Close panel">✕</button>
      </div>

      {/* Progress bar */}
      {steps.length > 0 && (
        <div className="sep-progress-wrap">
          <div className="sep-progress-bar">
            <div className="sep-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="sep-progress-label">
            {currentIndex < 0 ? 0 : currentIndex + 1} / {steps.length}
          </span>
        </div>
      )}

      {/* Step list */}
      <div className="sep-list">
        {steps.length === 0 ? (
          <div className="sep-empty">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
            </svg>
            <p>Run an algorithm to see steps here.</p>
          </div>
        ) : (
          steps.map((step, i) => (
            <StepItem
              key={i}
              step={step}
              index={i}
              isActive={i === currentIndex}
              refProp={i === currentIndex ? activeRef : null}
              onClick={() => onSelectStep(i)}
            />
          ))
        )}
      </div>
    </div>
  )
}
