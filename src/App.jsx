import './App.css'
import { useState } from 'react'
import VisualizerPage from './pages/VisualizerPage.jsx'
import AlgorithmTheory from './components/AlgorithmTheory.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState('visualizer')

  return (
    <>
      {currentPage === 'visualizer' ? (
        <VisualizerPage onShowTheory={() => setCurrentPage('theory')} />
      ) : (
        <div className="theory-page-wrapper">
          <AlgorithmTheory />
          <button 
            className="back-to-visualizer-btn"
            onClick={() => setCurrentPage('visualizer')}
            title="Back to Visualizer"
            aria-label="Back to Visualizer"
          >
            ← Visualizer
          </button>
        </div>
      )}
    </>
  )
}

export default App
