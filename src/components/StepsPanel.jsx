import { useEffect, useRef } from 'react'

function StepsPanel({ steps, currentIndex, onSelectStep, onClose }) {
  const activeRef = useRef(null)

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [currentIndex])

  return (
    <div className="steps-panel">
      <div className="steps-panel-header">
        <h3 className="steps-panel-title">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 12h6M9 16h4" />
          </svg>
          Steps ({steps.length})
        </h3>
        <button type="button" className="steps-close" onClick={onClose} aria-label="Close steps panel">✕</button>
      </div>

      <div className="steps-list">
        {steps.length === 0 ? (
          <p className="steps-empty">Run an algorithm to see steps here.</p>
        ) : (
          steps.map((step, i) => {
            const isActive = i === currentIndex
            return (
              <button
                key={i}
                ref={isActive ? activeRef : null}
                type="button"
                className={`step-item${isActive ? ' active' : ''}`}
                onClick={() => onSelectStep(i)}
              >
                <span className="step-num">#{i + 1}</span>
                <div className="step-content">
                  <span className={`step-type-badge step-type-${step.type?.toLowerCase()}`}>
                    {step.type}
                  </span>
                  <p className="step-desc">{step.description}</p>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default StepsPanel
