function ExplanationPanel({ steps, currentStep, stepIndex }) {
  const visibleSteps = steps.slice(Math.max(stepIndex - 4, 0), stepIndex + 5)

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

export default ExplanationPanel
