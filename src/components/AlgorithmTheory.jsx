import { useState } from 'react'
import { ALGORITHM_THEORY, ALGORITHM_CATEGORIES } from '../data/algorithmTheory'
import './AlgorithmTheory.css'

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '📚' },
  { id: 'sorting', label: 'Sorting', icon: '↕️' },
  { id: 'searching', label: 'Searching', icon: '🔍' },
  { id: 'graphs', label: 'Graphs', icon: '📊' },
  { id: 'trees', label: 'Trees', icon: '🌳' },
  { id: 'pathfinding', label: 'Pathfinding', icon: '🎯' },
]

const CX_COLORS = {
  best: 'cx-best',
  average: 'cx-avg',
  worst: 'cx-worst',
  space: 'cx-space',
}

function getComplexityValues(complexity) {
  if (!complexity) return { best: '-', average: '-', worst: '-', space: '-' }
  if (complexity.time) {
    const t = complexity.time
    if (typeof t === 'string') return { best: t, average: t, worst: t, space: complexity.space || '-' }
    return {
      best: t.best || t.average || '-',
      average: t.average || t.best || '-',
      worst: t.worst || t.average || '-',
      space: complexity.space || '-',
    }
  }
  const fallback =
    complexity.search?.average || complexity.insertion?.average || complexity.deletion?.average || '-'
  return { best: fallback, average: fallback, worst: fallback, space: complexity.space || '-' }
}

function getComplexityLabel(complexity) {
  const v = getComplexityValues(complexity)
  return v.average !== '-' ? v.average : v.best
}

function hasChar(algo, token) {
  return Array.isArray(algo?.characteristics) &&
    algo.characteristics.some(c => c.toLowerCase().includes(token))
}

function hasCharOrDef(algo, token) {
  return hasChar(algo, token) ||
    (algo?.definition || '').toLowerCase().includes(token) ||
    (algo?.theory || '').toLowerCase().includes(token)
}

function getParadigm(algo) {
  const text = ((algo?.theory || '') + ' ' + (algo?.definition || '')).toLowerCase()
  if (text.includes('divide-and-conquer') || text.includes('divide and conquer')) return 'Divide & Conquer'
  if (text.includes('greedy')) return 'Greedy'
  if (text.includes('dynamic programming')) return 'Dynamic Programming'
  if (text.includes('heuristic') || text.includes('informed search')) return 'Heuristic / Informed'
  if (text.includes('backtrack')) return 'Backtracking'
  if (text.includes('comparison-based') || text.includes('comparison based')) return 'Comparison-based'
  if (text.includes('non-comparative') || text.includes('non-comparison')) return 'Non-comparative'
  if (text.includes('traversal')) return 'Graph / Tree Traversal'
  return 'Iterative / Sequential'
}

function getDataStructure(algo) {
  const text = ((algo?.theory || '') + ' ' + (algo?.characteristics?.join(' ') || '')).toLowerCase()
  if (text.includes('priority queue') || text.includes('min-heap') || text.includes('max heap') || text.includes('max-heap')) return 'Priority Queue / Heap'
  if (text.includes('queue (fifo)') || text.includes('uses queue')) return 'Queue (FIFO)'
  if (text.includes('stack (lifo)') || text.includes('uses stack')) return 'Stack (LIFO)'
  if (text.includes('count array') || text.includes('count array')) return 'Count Array'
  if (text.includes('binary tree') || text.includes('bst')) return 'Binary Tree'
  if (text.includes('heap')) return 'Heap (Array)'
  if (text.includes('array') || text.includes('in-place')) return 'Array (in-place)'
  return 'Array'
}

function isRecursive(algo) {
  const text = ((algo?.theory || '') + ' ' + (algo?.stepByStep?.join(' ') || '')).toLowerCase()
  if (text.includes('recursive') || text.includes('recursively')) return 'Yes'
  if (text.includes('iterative') || text.includes('loop') || text.includes('while')) return 'Iterative'
  return 'Varies'
}

function isAdaptive(algo) {
  const text = ((algo?.characteristics?.join(' ') || '') + ' ' + (algo?.advantages?.join(' ') || '')).toLowerCase()
  if (text.includes('adaptive') || text.includes('nearly sorted')) return 'Yes'
  if (text.includes('not adaptive') || text.includes('consistent')) return 'No'
  return '-'
}

function getBestFor(algo) {
  if (!Array.isArray(algo?.useCases) || algo.useCases.length === 0) return '-'
  return algo.useCases[0]
}

function getWorstFor(algo) {
  if (!Array.isArray(algo?.disadvantages) || algo.disadvantages.length === 0) return '-'
  // pick the most descriptive disadvantage (longest)
  return algo.disadvantages.reduce((a, b) => b.length > a.length ? b : a, algo.disadvantages[0])
}

function getAlternatives(algo) {
  if (!algo?.betterAlternatives) return '-'
  const alts = Array.isArray(algo.betterAlternatives) ? algo.betterAlternatives : [algo.betterAlternatives]
  return alts.join(', ')
}

function getSpecialNote(algo) {
  if (algo?.limitations) return algo.limitations
  if (algo?.improvement) return algo.improvement
  if (algo?.preconditions?.length) return algo.preconditions[0]
  if (algo?.conditions?.length) return algo.conditions[0]
  return '-'
}

function Section({ icon, title, children, className = '' }) {
  return (
    <section className={`ts-section ${className}`}>
      <div className="ts-section-title">{icon} {title}</div>
      {children}
    </section>
  )
}

function TagList({ items }) {
  return (
    <div className="ts-tags">
      {items.map((t, i) => <span key={i} className="ts-tag">{t}</span>)}
    </div>
  )
}

function BulletList({ items, variant = '' }) {
  return (
    <ul className={`ts-list ${variant}`}>
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  )
}

function StepList({ items }) {
  return (
    <ol className="ts-list ts-steps">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ol>
  )
}

export default function AlgorithmTheory() {
  const [selectedAlgo, setSelectedAlgo] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState('detail') // 'detail' | 'compare'
  const [compareIds, setCompareIds] = useState([])

  const allAlgorithms = Object.values(ALGORITHM_THEORY)

  const filteredAlgos = (
    selectedCategory === 'all' ? allAlgorithms : (ALGORITHM_CATEGORIES[selectedCategory] || [])
  ).filter(a =>
    a.name.toLowerCase().includes(searchText.toLowerCase()) ||
    a.definition.toLowerCase().includes(searchText.toLowerCase())
  )

  const algo = selectedAlgo ? ALGORITHM_THEORY[selectedAlgo] : null
  const comparedAlgos = compareIds.map(id => ALGORITHM_THEORY[id]).filter(Boolean)

  const toggleCompare = (id) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= 4 ? prev : [...prev, id]
    )
  }

  const selectAlgo = (id) => {
    setSelectedAlgo(id)
    setActiveTab('detail')
  }

  return (
    <div className="at-page">
      {/* Sidebar */}
      <aside className="at-sidebar">
        <div className="at-sidebar-search">
          <span className="at-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search algorithms..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="at-search-input"
          />
          {searchText && (
            <button className="at-search-clear" onClick={() => setSearchText('')}>✕</button>
          )}
        </div>

        <div className="at-cat-tabs">
          {CATEGORIES.map(cat => {
            const count = cat.id === 'all' ? allAlgorithms.length : (ALGORITHM_CATEGORIES[cat.id]?.length || 0)
            return (
              <button
                key={cat.id}
                className={`at-cat-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => { setSelectedCategory(cat.id); setSearchText('') }}
              >
                <span>{cat.icon}</span>
                <span className="at-cat-label">{cat.label}</span>
                <span className="at-cat-count">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="at-algo-list">
          {filteredAlgos.length === 0 && (
            <div className="at-no-results">No algorithms found</div>
          )}
          {filteredAlgos.map(item => (
            <button
              key={item.id}
              className={`at-algo-btn ${selectedAlgo === item.id ? 'active' : ''} ${compareIds.includes(item.id) ? 'in-compare' : ''}`}
              onClick={() => selectAlgo(item.id)}
            >
              <span className="at-algo-name">{item.name}</span>
              <span className="at-algo-cx">{getComplexityLabel(item.complexity)}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="at-main">
        {/* Tab bar */}
        <div className="at-tab-bar">
          <button
            className={`at-tab ${activeTab === 'detail' ? 'active' : ''}`}
            onClick={() => setActiveTab('detail')}
          >
            📖 Detail
            {algo && <span className="at-tab-badge">{algo.name}</span>}
          </button>
          <button
            className={`at-tab ${activeTab === 'compare' ? 'active' : ''}`}
            onClick={() => setActiveTab('compare')}
          >
            ⚖️ Compare
            {compareIds.length > 0 && <span className="at-tab-badge">{compareIds.length}</span>}
          </button>
        </div>

        {/* Detail View */}
        {activeTab === 'detail' && (
          <div className="at-content">
            {!algo ? (
              <div className="at-empty">
                <div className="at-empty-icon">📚</div>
                <h3>Select an Algorithm</h3>
                <p>Pick any algorithm from the sidebar to explore its theory, complexity, and step-by-step breakdown.</p>
              </div>
            ) : (
              <div className="at-detail">
                {/* Header */}
                <div className="at-detail-header">
                  <div>
                    <h2 className="at-detail-title">{algo.name}</h2>
                    <div className="at-detail-meta">
                      <span className="at-badge">{algo.category}</span>
                    </div>
                  </div>
                  <button
                    className={`at-compare-toggle ${compareIds.includes(algo.id) ? 'active' : ''}`}
                    onClick={() => toggleCompare(algo.id)}
                  >
                    {compareIds.includes(algo.id) ? '✓ In Compare' : '+ Add to Compare'}
                  </button>
                </div>

                {/* Complexity Cards */}
                <div className="at-cx-row">
                  {algo.complexity?.time ? (
                    <>
                      <div className="at-cx-card">
                        <div className="at-cx-label">Best Case</div>
                        <div className={`at-cx-val cx-best`}>{getComplexityValues(algo.complexity).best}</div>
                      </div>
                      <div className="at-cx-card">
                        <div className="at-cx-label">Average Case</div>
                        <div className={`at-cx-val cx-avg`}>{getComplexityValues(algo.complexity).average}</div>
                      </div>
                      <div className="at-cx-card">
                        <div className="at-cx-label">Worst Case</div>
                        <div className={`at-cx-val cx-worst`}>{getComplexityValues(algo.complexity).worst}</div>
                      </div>
                    </>
                  ) : (
                    <div className="at-cx-card">
                      <div className="at-cx-label">Time</div>
                      <div className="at-cx-val cx-avg">{getComplexityLabel(algo.complexity)}</div>
                    </div>
                  )}
                  <div className="at-cx-card">
                    <div className="at-cx-label">Space</div>
                    <div className="at-cx-val cx-space">{getComplexityValues(algo.complexity).space}</div>
                  </div>
                </div>

                {/* Definition */}
                <Section icon="📖" title="Definition">
                  <p className="at-definition">{algo.definition}</p>
                </Section>

                {/* How it works */}
                {algo.theory && (
                  <Section icon="🧠" title="How It Works">
                    <div className="at-theory-text">{algo.theory.trim()}</div>
                  </Section>
                )}

                {/* Step by Step */}
                {algo.stepByStep && (
                  <Section icon="📋" title="Step-by-Step">
                    <StepList items={algo.stepByStep} />
                  </Section>
                )}

                {/* Characteristics */}
                {algo.characteristics && (
                  <Section icon="✨" title="Characteristics">
                    <BulletList items={algo.characteristics} />
                  </Section>
                )}

                {/* Two-column: Advantages + Disadvantages */}
                {(algo.advantages || algo.disadvantages) && (
                  <div className="at-two-col">
                    {algo.advantages && (
                      <Section icon="✅" title="Advantages" className="adv">
                        <BulletList items={algo.advantages} variant="advantages" />
                      </Section>
                    )}
                    {algo.disadvantages && (
                      <Section icon="❌" title="Disadvantages" className="dis">
                        <BulletList items={algo.disadvantages} variant="disadvantages" />
                      </Section>
                    )}
                  </div>
                )}

                {/* Use Cases */}
                {algo.useCases && (
                  <Section icon="🎯" title="Use Cases">
                    <BulletList items={algo.useCases} />
                  </Section>
                )}

                {/* Related Concepts */}
                {algo.relatedConcepts && (
                  <Section icon="🔗" title="Related Concepts">
                    <TagList items={algo.relatedConcepts} />
                  </Section>
                )}

                {/* Better Alternatives */}
                {algo.betterAlternatives && (
                  <Section icon="💡" title="Better Alternatives">
                    <div className="at-tags">
                      {(Array.isArray(algo.betterAlternatives) ? algo.betterAlternatives : [algo.betterAlternatives])
                        .map((a, i) => <span key={i} className="at-alt-chip">{a}</span>)}
                    </div>
                  </Section>
                )}

                {/* Variants */}
                {algo.variants && (
                  <Section icon="🔀" title="Variants">
                    <BulletList items={algo.variants} />
                  </Section>
                )}

                {/* Preconditions */}
                {algo.preconditions && (
                  <Section icon="⚠️" title="Preconditions">
                    <BulletList items={algo.preconditions} />
                  </Section>
                )}

                {/* Conditions */}
                {algo.conditions && (
                  <Section icon="📌" title="Conditions">
                    <BulletList items={algo.conditions} />
                  </Section>
                )}

                {/* Gap Sequences */}
                {algo.gapSequences && (
                  <Section icon="🔢" title="Gap Sequences">
                    <BulletList items={algo.gapSequences} />
                  </Section>
                )}

                {/* Heuristic */}
                {algo.heuristicSelection && (
                  <Section icon="🧭" title="Heuristic Options">
                    <BulletList items={algo.heuristicSelection} />
                  </Section>
                )}

                {/* vs Alternative */}
                {algo.vsAlternative && (
                  <Section icon="🔄" title={`vs ${algo.vsAlternative.algorithm}`}>
                    <div className="at-vs-box">
                      <div className="at-vs-row adv">
                        <span className="at-vs-label">Advantage</span>
                        <span>{algo.vsAlternative.advantage}</span>
                      </div>
                      <div className="at-vs-row dis">
                        <span className="at-vs-label">Disadvantage</span>
                        <span>{algo.vsAlternative.disadvantage}</span>
                      </div>
                    </div>
                  </Section>
                )}
              </div>
            )}
          </div>
        )}

        {/* Compare View */}
        {activeTab === 'compare' && (
          <div className="at-content">
            <div className="at-compare-header">
              <div>
                <h3>Algorithm Comparison</h3>
                <p>Select algorithms from the sidebar to compare side by side (up to 4)</p>
              </div>
              {compareIds.length > 0 && (
                <button className="at-clear-btn" onClick={() => setCompareIds([])}>
                  Clear All
                </button>
              )}
            </div>

            {/* Selected chips */}
            <div className="at-compare-chips">
              {filteredAlgos.map(item => {
                const active = compareIds.includes(item.id)
                const blocked = !active && compareIds.length >= 4
                return (
                  <button
                    key={item.id}
                    className={`at-chip ${active ? 'active' : ''}`}
                    onClick={() => toggleCompare(item.id)}
                    disabled={blocked}
                    title={blocked ? 'Max 4 algorithms' : active ? 'Remove' : 'Add to compare'}
                  >
                    {active && <span className="at-chip-check">✓</span>}
                    {item.name}
                  </button>
                )
              })}
            </div>

            {comparedAlgos.length < 2 ? (
              <div className="at-compare-empty">
                <div className="at-empty-icon">⚖️</div>
                <h3>Select at least 2 algorithms</h3>
                <p>Use the chips above or click algorithms in the sidebar to add them to the comparison.</p>
              </div>
            ) : (
              <div className="at-compare-table-wrap">
                <table className="at-compare-table">
                  <thead>
                    <tr>
                      <th className="at-ct-row-label">Criteria</th>
                      {comparedAlgos.map(a => (
                        <th key={a.id}>
                          <div className="at-ct-head-name">{a.name}</div>
                          <div className="at-ct-head-cat">{a.category}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* ── Complexity ── */}
                    <tr className="at-ct-group-row">
                      <td colSpan={comparedAlgos.length + 1} className="at-ct-group-label">⏱ Complexity</td>
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Time — Best</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id} className="cx-best mono">{getComplexityValues(a.complexity).best}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Time — Average</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id} className="cx-avg mono">{getComplexityValues(a.complexity).average}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Time — Worst</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id} className="cx-worst mono">{getComplexityValues(a.complexity).worst}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Space</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id} className="cx-space mono">{getComplexityValues(a.complexity).space}</td>
                      ))}
                    </tr>

                    {/* ── Properties ── */}
                    <tr className="at-ct-group-row">
                      <td colSpan={comparedAlgos.length + 1} className="at-ct-group-label">🔬 Properties</td>
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Category</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id}><span className="at-badge">{a.category}</span></td>
                      ))}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Paradigm</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id} className="at-ct-muted">{getParadigm(a)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Data Structure</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id} className="at-ct-muted">{getDataStructure(a)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Recursive</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id} className="at-ct-muted">{isRecursive(a)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Stable</td>
                      {comparedAlgos.map(a => {
                        const stable = hasChar(a, 'stable') && !hasChar(a, 'not stable')
                        return (
                          <td key={a.id}>
                            <span className={`at-bool ${stable ? 'yes' : 'no'}`}>
                              {stable ? '✓ Yes' : '✗ No'}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">In-place</td>
                      {comparedAlgos.map(a => {
                        const inplace = hasChar(a, 'in-place') || hasChar(a, 'in place')
                        return (
                          <td key={a.id}>
                            <span className={`at-bool ${inplace ? 'yes' : 'no'}`}>
                              {inplace ? '✓ Yes' : '✗ No'}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Adaptive</td>
                      {comparedAlgos.map(a => {
                        const val = isAdaptive(a)
                        return (
                          <td key={a.id}>
                            {val === '-' ? <span className="at-ct-muted">—</span> : (
                              <span className={`at-bool ${val === 'Yes' ? 'yes' : 'no'}`}>
                                {val === 'Yes' ? '✓ Yes' : '✗ No'}
                              </span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Comparison-based</td>
                      {comparedAlgos.map(a => {
                        const nonComp = hasCharOrDef(a, 'non-comparative') || hasCharOrDef(a, 'non-comparison') || hasCharOrDef(a, "doesn't compare")
                        return (
                          <td key={a.id}>
                            <span className={`at-bool ${nonComp ? 'no' : 'yes'}`}>
                              {nonComp ? '✗ No' : '✓ Yes'}
                            </span>
                          </td>
                        )
                      })}
                    </tr>

                    {/* ── Practical ── */}
                    <tr className="at-ct-group-row">
                      <td colSpan={comparedAlgos.length + 1} className="at-ct-group-label">🎯 Practical</td>
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Best For</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id} className="at-ct-muted">{getBestFor(a)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Use Cases</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id}>
                          {Array.isArray(a.useCases) && a.useCases.length > 0 ? (
                            <ul className="at-ct-list">
                              {a.useCases.slice(0, 3).map((u, i) => <li key={i}>{u}</li>)}
                            </ul>
                          ) : <span className="at-ct-muted">—</span>}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Key Advantage</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id} className="at-ct-adv">
                          {Array.isArray(a.advantages) && a.advantages.length > 0 ? a.advantages[0] : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Main Drawback</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id} className="at-ct-drawback">{getWorstFor(a)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Better Alternatives</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id} className="at-ct-muted">{getAlternatives(a)}</td>
                      ))}
                    </tr>

                    {/* ── Notes ── */}
                    <tr className="at-ct-group-row">
                      <td colSpan={comparedAlgos.length + 1} className="at-ct-group-label">📌 Notes</td>
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Definition</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id} className="at-ct-def">{a.definition}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="at-ct-row-label">Special Note</td>
                      {comparedAlgos.map(a => (
                        <td key={a.id} className="at-ct-note">{getSpecialNote(a)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
