import { useState } from 'react'
import { ALGORITHM_THEORY, ALGORITHM_CATEGORIES } from '../data/algorithmTheory'
import './AlgorithmTheory.css'

export default function AlgorithmTheory() {
  const [selectedAlgo, setSelectedAlgo] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchText, setSearchText] = useState('')

  const allAlgorithms = Object.values(ALGORITHM_THEORY)

  const getComplexityLabel = (complexity) => {
    if (!complexity) return '-'
    if (typeof complexity === 'string') return complexity

    if (typeof complexity.time === 'string') return complexity.time
    if (complexity.time?.average) return complexity.time.average
    if (complexity.time?.best) return complexity.time.best
    if (typeof complexity.space === 'string') return complexity.space

    if (complexity.search?.average) return `Search ${complexity.search.average}`
    if (complexity.insertion?.average) return `Insert ${complexity.insertion.average}`

    return '-'
  }

  const categories = [
    { id: 'all', label: `All (${allAlgorithms.length})`, icon: '📚' },
    { id: 'sorting', label: `Sorting (${ALGORITHM_CATEGORIES.sorting.length})`, icon: '↕️' },
    { id: 'searching', label: `Searching (${ALGORITHM_CATEGORIES.searching.length})`, icon: '🔍' },
    { id: 'graphs', label: `Graphs (${ALGORITHM_CATEGORIES.graphs.length})`, icon: '📊' },
    { id: 'trees', label: `Trees (${ALGORITHM_CATEGORIES.trees.length})`, icon: '🌳' },
    { id: 'pathfinding', label: `Pathfinding (${ALGORITHM_CATEGORIES.pathfinding.length})`, icon: '🎯' },
  ]

  const currentCategory = selectedCategory === 'all'
    ? allAlgorithms
    : (ALGORITHM_CATEGORIES[selectedCategory] || [])
  
  const filteredAlgos = currentCategory.filter(algo => 
    algo.name.toLowerCase().includes(searchText.toLowerCase()) ||
    algo.definition.toLowerCase().includes(searchText.toLowerCase())
  )

  const algo = selectedAlgo ? ALGORITHM_THEORY[selectedAlgo] : null

  return (
    <div className="algorithm-theory">
      <div className="theory-header">
        <h1>📚 Algorithm Theory & Reference</h1>
        <p className="theory-subtitle">Complete guide to algorithms, complexity analysis, and usage</p>
      </div>

      <div className="theory-container">
        {/* Sidebar */}
        <div className="theory-sidebar">
          {/* Category Tabs */}
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  setSelectedAlgo(null)
                  setSearchText('')
                }}
                title={cat.label}
              >
                <span className="tab-icon">{cat.icon}</span>
                <span className="tab-label">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="theory-search">
            <input
              type="text"
              placeholder="Search algorithms..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Algorithm List */}
          <div className="algorithm-list">
            {filteredAlgos.length > 0 ? (
              filteredAlgos.map(algo => (
                <button
                  key={algo.id}
                  className={`algo-item ${selectedAlgo === algo.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAlgo(algo.id)}
                >
                  <div className="algo-name">{algo.name}</div>
                  <div className="algo-complexity">{getComplexityLabel(algo.complexity)}</div>
                </button>
              ))
            ) : (
              <div className="no-results">No algorithms found</div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="theory-content">
          {algo ? (
            <div className="algo-details">
              {/* Header */}
              <div className="details-header">
                <h2>{algo.name}</h2>
                <span className="badge category-badge">{algo.category}</span>
              </div>

              {/* Definition */}
              <section className="theory-section">
                <h3>📖 Definition</h3>
                <p className="definition">{algo.definition}</p>
              </section>

              {/* Complexity Analysis */}
              <section className="theory-section">
                <h3>⏱️ Complexity Analysis</h3>
                <div className="complexity-grid">
                  {algo.complexity?.time ? (
                    <>
                      <div className="complexity-item">
                        <div className="complexity-label">Time Best Case</div>
                        <div className="complexity-value">{algo.complexity.time.best || algo.complexity.time}</div>
                      </div>
                      <div className="complexity-item">
                        <div className="complexity-label">Time Average</div>
                        <div className="complexity-value">{algo.complexity.time.average || algo.complexity.time}</div>
                      </div>
                      <div className="complexity-item">
                        <div className="complexity-label">Time Worst</div>
                        <div className="complexity-value">{algo.complexity.time.worst || algo.complexity.time}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      {algo.complexity?.search && (
                        <div className="complexity-item">
                          <div className="complexity-label">Search (Avg)</div>
                          <div className="complexity-value">{algo.complexity.search.average || algo.complexity.search.best}</div>
                        </div>
                      )}
                      {algo.complexity?.insertion && (
                        <div className="complexity-item">
                          <div className="complexity-label">Insertion (Avg)</div>
                          <div className="complexity-value">{algo.complexity.insertion.average || algo.complexity.insertion.best}</div>
                        </div>
                      )}
                      {algo.complexity?.deletion && (
                        <div className="complexity-item">
                          <div className="complexity-label">Deletion (Avg)</div>
                          <div className="complexity-value">{algo.complexity.deletion.average || algo.complexity.deletion.best}</div>
                        </div>
                      )}
                      {!algo.complexity?.search && !algo.complexity?.insertion && !algo.complexity?.deletion && (
                        <div className="complexity-item">
                          <div className="complexity-label">Complexity</div>
                          <div className="complexity-value">{getComplexityLabel(algo.complexity)}</div>
                        </div>
                      )}
                    </>
                  )}
                  {algo.complexity.space && (
                    <div className="complexity-item">
                      <div className="complexity-label">Space</div>
                      <div className="complexity-value">{algo.complexity.space}</div>
                    </div>
                  )}
                </div>
              </section>

              {/* Theory */}
              <section className="theory-section">
                <h3>🧠 How It Works</h3>
                <pre className="theory-text">{algo.theory}</pre>
              </section>

              {/* Characteristics */}
              {algo.characteristics && (
                <section className="theory-section">
                  <h3>✨ Characteristics</h3>
                  <ul className="feature-list">
                    {algo.characteristics.map((char, i) => (
                      <li key={i}>{char}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Use Cases */}
              {algo.useCases && (
                <section className="theory-section">
                  <h3>🎯 Use Cases</h3>
                  <ul className="feature-list">
                    {algo.useCases.map((use, i) => (
                      <li key={i}>{use}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Advantages */}
              {algo.advantages && (
                <section className="theory-section advantages">
                  <h3>✅ Advantages</h3>
                  <ul className="feature-list">
                    {algo.advantages.map((adv, i) => (
                      <li key={i}>{adv}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Disadvantages */}
              {algo.disadvantages && (
                <section className="theory-section disadvantages">
                  <h3>❌ Disadvantages</h3>
                  <ul className="feature-list">
                    {algo.disadvantages.map((dis, i) => (
                      <li key={i}>{dis}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Step by Step */}
              {algo.stepByStep && (
                <section className="theory-section">
                  <h3>📋 Step-by-Step</h3>
                  <ol className="steps-list">
                    {algo.stepByStep.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </section>
              )}

              {/* Related Concepts */}
              {algo.relatedConcepts && (
                <section className="theory-section">
                  <h3>🔗 Related Concepts</h3>
                  <div className="tag-list">
                    {algo.relatedConcepts.map((concept, i) => (
                      <span key={i} className="tag">{concept}</span>
                    ))}
                  </div>
                </section>
              )}

              {/* Better Alternatives */}
              {algo.betterAlternatives && (
                <section className="theory-section">
                  <h3>💡 Better Alternatives</h3>
                  <div className="alternatives">
                    {Array.isArray(algo.betterAlternatives) ? (
                      algo.betterAlternatives.map((alt, i) => (
                        <div key={i} className="alt-suggestion">{alt}</div>
                      ))
                    ) : (
                      <div className="alt-suggestion">{algo.betterAlternatives}</div>
                    )}
                  </div>
                </section>
              )}

              {/* Comparison Table */}
              {algo.vsAlternative && (
                <section className="theory-section">
                  <h3>🔄 Comparison</h3>
                  <div className="comparison-box">
                    <div className="comp-item">
                      <strong>vs {algo.vsAlternative.algorithm}</strong>
                    </div>
                    <div className="comp-item">
                      <span className="comp-label">Advantage:</span> {algo.vsAlternative.advantage}
                    </div>
                    <div className="comp-item">
                      <span className="comp-label">Disadvantage:</span> {algo.vsAlternative.disadvantage}
                    </div>
                  </div>
                </section>
              )}

              {/* Additional Info */}
              {algo.preconditions && (
                <section className="theory-section">
                  <h3>⚠️ Preconditions</h3>
                  <ul className="feature-list">
                    {algo.preconditions.map((cond, i) => (
                      <li key={i}>{cond}</li>
                    ))}
                  </ul>
                </section>
              )}

              {algo.conditions && (
                <section className="theory-section">
                  <h3>📌 Conditions</h3>
                  <ul className="feature-list">
                    {algo.conditions.map((cond, i) => (
                      <li key={i}>{cond}</li>
                    ))}
                  </ul>
                </section>
              )}

              {algo.gapSequences && (
                <section className="theory-section">
                  <h3>🔢 Gap Sequences</h3>
                  <ul className="feature-list">
                    {algo.gapSequences.map((seq, i) => (
                      <li key={i}>{seq}</li>
                    ))}
                  </ul>
                </section>
              )}

              {algo.heuristicSelection && (
                <section className="theory-section">
                  <h3>🧭 Heuristic Options</h3>
                  <ul className="feature-list">
                    {algo.heuristicSelection.map((heur, i) => (
                      <li key={i}>{heur}</li>
                    ))}
                  </ul>
                </section>
              )}

              {algo.variants && (
                <section className="theory-section">
                  <h3>🔀 Variants</h3>
                  <ul className="feature-list">
                    {algo.variants.map((variant, i) => (
                      <li key={i}>{variant}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>Select an Algorithm</h3>
              <p>Choose an algorithm from the list to view detailed theory and information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
