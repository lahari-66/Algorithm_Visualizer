function Navbar({ title, subtitle }) {
  return (
    <header className="navbar">
      <div>
        <p className="navbar-kicker">Interactive Lab</p>
        <h1 className="navbar-title">{title}</h1>
        <p className="navbar-subtitle">{subtitle}</p>
      </div>
      <div className="navbar-badges">
        <span className="badge">Visual</span>
        <span className="badge">Stepwise</span>
        <span className="badge">Real Time</span>
      </div>
    </header>
  )
}

export default Navbar
