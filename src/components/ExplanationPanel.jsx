function ExplanationPanel({ steps, currentStep, stepIndex }) {
  const visibleSteps = steps.slice(Math.max(stepIndex - 4, 0), stepIndex + 5)
  const hint = getBeginnerHint(currentStep)

  return (
    <div className="explanation-panel">
      <div className="panel-header">
        <h2>Step Explanation</h2>
        <p>Follow along with the algorithm narration.</p>
      </div>

      <div className="current-step">
        <span>Now</span>
        <p>{currentStep}</p>
      </div>

      <div className="beginner-tip">
        <span>Beginner Tip</span>
        <p>{hint}</p>
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

export default ExplanationPanel
