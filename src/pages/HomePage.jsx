import { useNavigate } from 'react-router-dom'

const ALGORITHM_GROUPS = [
  {
    title: 'Sorting Algorithms',
    icon: 'sorting',
    items: [
      {
        key: 'bubble',
        name: 'Bubble Sort',
        description: 'Simple comparison-based sorting algorithm.',
        complexity: 'O(n^2)',
      },
      {
        key: 'merge',
        name: 'Merge Sort',
        description: 'Divide and conquer sorting with stable merges.',
        complexity: 'O(n log n)',
      },
      {
        key: 'quick',
        name: 'Quick Sort',
        description: 'Partition-based sorting with pivot selection.',
        complexity: 'O(n log n) avg',
      },
      {
        key: 'heap',
        name: 'Heap Sort',
        description: 'Tree-based sorting using heap properties.',
        complexity: 'O(n log n)',
      },
      {
        key: 'shell',
        name: 'Shell Sort',
        description: 'Gap-based insertion sort for faster partial ordering.',
        complexity: 'O(n^(3/2)) avg',
      },
    ],
  },
  {
    title: 'Searching Algorithms',
    icon: 'searching',
    items: [
      {
        key: 'linear',
        name: 'Linear Search',
        description: 'Sequential scan through the array.',
        complexity: 'O(n)',
      },
      {
        key: 'binary',
        name: 'Binary Search',
        description: 'Fast search on a sorted array.',
        complexity: 'O(log n)',
      },
    ],
  },
]

const ICONS = {
  sorting: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="card-icon">
      <path
        d="M4 19h3V5H4v14Zm6 0h3V9h-3v10Zm6 0h3V3h-3v16Z"
        fill="currentColor"
      />
    </svg>
  ),
  searching: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="card-icon">
      <path
        d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0-2a8 8 0 1 0 4.9 14.3l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0 0 10 2Z"
        fill="currentColor"
      />
    </svg>
  ),
}

function HomePage() {
  const navigate = useNavigate()

  const handleNavigate = (key) => {
    navigate(`/visualize/${key}`)
  }

  return (
    <div className="home">
      <header className="home-header">
        <nav className="nav">
          <div className="logo">AV</div>
          <div>
            <h1>Algorithm Visualizer</h1>
            <p>Learn algorithms through interactive visualizations</p>
          </div>
        </nav>
        <div className="hero">
          <div>
            <h2>Algorithm Visualizer</h2>
            <p>
              Explore interactive simulations with clear visuals, step-by-step
              explanations, and intuitive controls designed for beginners.
            </p>
          </div>
          <div className="legend-card">
            <h3>Color Legend</h3>
            <ul>
              <li>
                <span className="legend-dot blue" /> Blue = Normal
              </li>
              <li>
                <span className="legend-dot yellow" /> Yellow = Comparing
              </li>
              <li>
                <span className="legend-dot red" /> Red = Swapping
              </li>
              <li>
                <span className="legend-dot green" /> Green = Sorted / Found
              </li>
            </ul>
          </div>
        </div>
      </header>

      <main className="home-main">
        {ALGORITHM_GROUPS.map((group) => (
          <section className="category" key={group.title}>
            <div className="category-head">
              <div className="category-icon">{ICONS[group.icon]}</div>
              <div>
                <h3>{group.title}</h3>
                <p>Pick an algorithm to start the visualization.</p>
              </div>
            </div>
            <div className="card-grid">
              {group.items.map((item) => (
                <button
                  key={item.key}
                  className="algo-card"
                  type="button"
                  onClick={() => handleNavigate(item.key)}
                >
                  <div className="card-top">
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                    </div>
                    <span className="pill">{item.complexity}</span>
                  </div>
                  <div className="card-footer">
                    <span>Time Complexity</span>
                    <span className="arrow">View</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="home-footer">
        Interactive Algorithm Learning Tool
      </footer>
    </div>
  )
}

export default HomePage
