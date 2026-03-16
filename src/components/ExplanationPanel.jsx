function ExplanationPanel({
  steps,
  currentStep,
  stepIndex,
  algorithmKey,
  scrubValue,
  isScrubbing,
  onScrubStart,
  onScrub,
  onScrubEnd,
  onResume,
  onRewind,
  onStepBack,
  onStepForward,
}) {
  const visibleSteps = steps.slice(Math.max(stepIndex - 4, 0), stepIndex + 5)
  const hint = getBeginnerHint(currentStep)
  const activeStep = stepIndex >= 0 ? steps[stepIndex] : null
  const activeAnnotation = getStepAnnotation(activeStep, algorithmKey)
  const hasSteps = steps.length > 0
  const safeValue = hasSteps ? Math.max(0, Math.min(scrubValue, steps.length - 1)) : 0

  return (
    <div className="explanation-panel">
      <div className="panel-header">
        <h2>Step Explanation</h2>
        <p>Follow along with the algorithm narration.</p>
      </div>

      <div className="current-step">
        <span>Now</span>
        <p>{currentStep}</p>
        {activeAnnotation ? <p className="step-annotation">{activeAnnotation}</p> : null}
      </div>

      <div className="beginner-tip">
        <span>Beginner Tip</span>
        <p>{hint}</p>
      </div>

      <div className="scrubber">
        <div className="scrubber-header">
          <span>Step Scrubber</span>
          <span className="scrubber-meta">
            {hasSteps ? `Step ${safeValue + 1} of ${steps.length}` : 'No steps yet'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={hasSteps ? steps.length - 1 : 0}
          value={safeValue}
          disabled={!hasSteps}
          onMouseDown={onScrubStart}
          onTouchStart={onScrubStart}
          onMouseUp={onScrubEnd}
          onTouchEnd={onScrubEnd}
          onChange={(event) => onScrub(Number(event.target.value))}
        />
        <p className="scrubber-note">
          {isScrubbing
            ? 'Release to keep this frame. Use Resume to continue.'
            : 'Drag to jump to any micro-step.'}
        </p>
        <div className="scrubber-actions">
          <button
            type="button"
            className="button ghost scrubber-button"
            onClick={onRewind}
            disabled={!hasSteps}
          >
            Rewind
          </button>
          <button
            type="button"
            className="button ghost scrubber-button"
            onClick={onStepBack}
            disabled={!hasSteps}
          >
            Prev
          </button>
          <button
            type="button"
            className="button ghost scrubber-button"
            onClick={onStepForward}
            disabled={!hasSteps}
          >
            Next
          </button>
          <button
            type="button"
            className="button primary scrubber-button"
            onClick={onResume}
            disabled={!hasSteps}
          >
            Resume
          </button>
        </div>
      </div>

      <div className="step-list">
        {visibleSteps.length ? (
          visibleSteps.map((step, index) => {
            const actualIndex = Math.max(stepIndex - 4, 0) + index
            const isActive = actualIndex === stepIndex

            return (
              <div key={`${step.description}-${actualIndex}`} className={isActive ? 'step active' : 'step'}>
                <span>Step {actualIndex + 1}</span>
                <p>{step.description}</p>
                {getStepAnnotation(step, algorithmKey) ? (
                  <p className="step-annotation">{getStepAnnotation(step, algorithmKey)}</p>
                ) : null}
              </div>
            )
          })
        ) : (
          <p className="empty-state">No steps yet. Start an algorithm to see narration.</p>
        )}
      </div>
    </div>
  )
}

const getBeginnerHint = (text) => {
  const message = text.toLowerCase()
  if (message.includes('compare')) {
    return 'We check two values to decide which should come first.'
  }
  if (message.includes('swap')) {
    return 'The two elements trade places to move toward the correct order.'
  }
  if (message.includes('sorted')) {
    return 'This element is locked in place and will not move again.'
  }
  if (message.includes('pivot')) {
    return 'The pivot splits the array into smaller and larger values.'
  }
  if (message.includes('range')) {
    return 'We focus only on the active range to narrow the search.'
  }
  if (message.includes('found')) {
    return 'Match found! The search can stop here.'
  }
  return 'Follow the highlights to see how values move step by step.'
}

const getStepAnnotation = (step, algorithmKey) => {
  if (!step || algorithmKey !== 'quick') return ''
  if (step.type === 'RANGE') {
    const [start, end] = step.indices
    return `Partitioning range ${start + 1}-${end + 1}.`
  }
  if (step.description?.toLowerCase().includes('pivot')) {
    return 'Pivot anchors the split between smaller and larger values.'
  }
  if (step.type === 'SWAP' && step.description?.toLowerCase().includes('pivot')) {
    return 'Pivot is moving closer to its final position.'
  }
  return ''
}

export default ExplanationPanel
