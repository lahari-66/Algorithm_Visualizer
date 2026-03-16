const STEP_EXPLANATIONS = {
  COMPARE: (step) => `The algorithm is comparing two elements: ${
    step.description?.match(/\d+/g)?.slice(0, 2).join(' and ') ?? 'values'
  }. It checks which one is larger to decide the next action.`,
  SWAP: (step) => `Two elements are being swapped. ${step.description ?? ''} This moves them closer to their correct sorted positions.`,
  SORTED: () => `This element has reached its final sorted position and will not move again. It is now locked in place.`,
  FOUND: (step) => step.description?.includes('not found')
    ? `The search has exhausted all possibilities. The target value does not exist in the array.`
    : `The target value has been found! The search stops here successfully.`,
  OVERWRITE: (step) => `A value is being written into a position. ${step.description ?? ''} This is part of the merge operation where elements are placed in sorted order.`,
  RANGE: (step) => `The algorithm is now focusing on a sub-range of the array. ${step.description ?? ''} Only elements within this range are being processed.`,
  POINTER_MOVE: (step) => `A pointer is being repositioned. ${step.description ?? ''} Pointers track the current working positions within the algorithm.`,
}

const TYPE_COLORS = {
  COMPARE: '#fbbf24',
  SWAP: '#fb7185',
  SORTED: '#34d399',
  FOUND: '#38bdf8',
  OVERWRITE: '#a78bfa',
  RANGE: '#67e8f9',
  POINTER_MOVE: '#94a3b8',
}

function StepTutor({ step, stepIndex }) {
  if (!step) {
    return (
      <div className="tutor-panel tutor-empty">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <p>Select a step to see a detailed explanation.</p>
      </div>
    )
  }

  const explanation = STEP_EXPLANATIONS[step.type]?.(step) ?? step.description ?? ''
  const color = TYPE_COLORS[step.type] ?? '#94a3b8'

  return (
    <div className="tutor-panel">
      <div className="tutor-header">
        <span className="tutor-step-num">Step {stepIndex + 1}</span>
        <span className="tutor-type-badge" style={{ background: `${color}22`, color, borderColor: `${color}55` }}>
          {step.type}
        </span>
      </div>
      <p className="tutor-action">{step.description}</p>
      <div className="tutor-divider" />
      <p className="tutor-explanation">{explanation}</p>
      {step.indices?.length > 0 && step.indices[0] >= 0 && (
        <div className="tutor-indices">
          <span className="tutor-indices-label">Affected positions:</span>
          {step.indices.map((idx) => (
            <span key={idx} className="tutor-index-chip">[{idx}]</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default StepTutor
