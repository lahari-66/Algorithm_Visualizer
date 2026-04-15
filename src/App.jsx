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
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          {/* Theory top bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0 20px',
            height: '52px',
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
            zIndex: 10,
          }}>
            <button
              onClick={() => setCurrentPage('visualizer')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--muted)', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
            >
              ← Back to Visualizer
            </button>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
              📚 Algorithm Theory & Reference
            </span>
          </div>
          {/* Theory content fills remaining height */}
          <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
            <AlgorithmTheory />
          </div>
        </div>
      )}
    </>
  )
}

export default App
