import { ALGORITHM_PLAYBOOK, FALLBACK_PLAYBOOK } from '../data/algorithmPlaybook.js'

function AlgorithmPlaybookPanel({ algorithmKey, algorithmName }) {
  const playbook = ALGORITHM_PLAYBOOK[algorithmKey] ?? FALLBACK_PLAYBOOK

  return (
    <section className="playbook-panel" aria-label="Algorithm theory and steps">
      <div className="playbook-header">
        <h2>Algorithm Playbook</h2>
        <span className="playbook-name">{algorithmName}</span>
      </div>

      <div className="playbook-block">
        <h3>Core Theory</h3>
        <p>{playbook.theory}</p>
      </div>

      <div className="playbook-block">
        <h3>Best Used When</h3>
        <p>{playbook.bestFor}</p>
      </div>

      <div className="playbook-block">
        <h3>How It Works</h3>
        <ol>
          {playbook.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default AlgorithmPlaybookPanel
