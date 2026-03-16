import { THEMES } from '../theme.js'

function Navbar({ theme, onThemeChange, onHome, compareMode, onToggleCompare }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-logo" onClick={onHome} type="button" aria-label="Home">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
        </button>
        <div className="navbar-brand">
          <span className="navbar-title">AlgoVista</span>
          <span className="navbar-sub">Algorithm Visualizer</span>
        </div>
      </div>

      <div className="navbar-right">
        <button
          type="button"
          className={`nav-btn${compareMode ? ' active' : ''}`}
          onClick={onToggleCompare}
          title="Compare two algorithms side by side"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="18" rx="1" />
            <rect x="14" y="3" width="7" height="18" rx="1" />
          </svg>
          Compare
        </button>

        <div className="theme-switcher">
          {Object.entries(THEMES).map(([key, t]) => (
            <button
              key={key}
              type="button"
              className={`theme-btn${theme === key ? ' active' : ''}`}
              onClick={() => onThemeChange(key)}
              title={t.name}
            >
              {t.icon}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
