import { useMemo } from 'react'

function cellClass(r, c, step, grid, start, end) {
  const [sr, sc] = start
  const [er, ec] = end
  if (r === sr && c === sc) return 'pv-cell-start'
  if (r === er && c === ec) return 'pv-cell-end'
  if (grid?.[r]?.[c] === 1) return 'pv-cell-wall'

  if (!step) return 'pv-cell-open'

  const key = `${r},${c}`
  const path = step.path ?? []
  const openSet = step.openSet ?? []
  const closedSet = step.closedSet ?? []
  const currCell = step.cell
  const fromCell = step.from

  // Final path
  if (path.some(([pr, pc]) => pr === r && pc === c)) return 'pv-cell-path'
  // Current cell being expanded
  if (currCell && currCell[0] === r && currCell[1] === c) return 'pv-cell-current'
  // Neighbour being checked
  if (fromCell && step.type === 'COMPARE' && step.cell?.[0] === r && step.cell?.[1] === c) return 'pv-cell-checking'
  // Open set (frontier)
  if (openSet.includes(key)) return 'pv-cell-open-set'
  // Closed set (explored)
  if (closedSet.includes(key)) return 'pv-cell-closed'

  return 'pv-cell-open'
}

export default function PathVisualizer({ algoType, step, pathMeta }) {
  const { grid, rows = 5, cols = 7, start = [0, 0], end = [4, 6] } = pathMeta ?? {}

  const defaultGrid = useMemo(() => {
    if (grid) return grid
    if (algoType === 'maze') {
      return [
        [0,0,1,0,0,0,0],
        [1,0,1,0,1,1,0],
        [0,0,0,0,0,1,0],
        [0,1,1,1,0,0,0],
        [0,0,0,1,0,1,0],
      ]
    }
    return [
      [0,0,0,0,0,0,0],
      [0,1,1,0,1,1,0],
      [0,0,0,0,0,1,0],
      [0,1,0,1,0,0,0],
      [0,0,0,1,0,1,0],
    ]
  }, [grid, algoType])

  const isDone = step?.type === 'DONE'
  const finalPath = isDone ? (step.path ?? []) : []

  return (
    <div className="pv-root">
      {/* Legend */}
      <div className="pv-legend">
        <span className="pv-pill pv-start">Start</span>
        <span className="pv-pill pv-end">Goal</span>
        <span className="pv-pill pv-current">Current</span>
        {algoType === 'astar' && <span className="pv-pill pv-open-set">Open Set</span>}
        <span className="pv-pill pv-closed">Explored</span>
        <span className="pv-pill pv-path">Path</span>
        <span className="pv-pill pv-wall">Wall</span>
      </div>

      <div className="pv-body">
        {/* Grid */}
        <div className="pv-grid-wrap">
          <div className="pv-grid" style={{ '--cols': cols }}>
            {Array.from({ length: rows }, (_, r) =>
              Array.from({ length: cols }, (_, c) => {
                const cls = cellClass(r, c, step, defaultGrid, start, end)
                const isPath = finalPath.some(([pr, pc]) => pr === r && pc === c)
                return (
                  <div key={`${r}-${c}`} className={`pv-cell ${cls}${isPath ? ' pv-cell-path' : ''}`}>
                    {r === start[0] && c === start[1] && <span className="pv-cell-icon">S</span>}
                    {r === end[0] && c === end[1] && <span className="pv-cell-icon">G</span>}
                    {/* Show f-score for A* */}
                    {algoType === 'astar' && step?.type === 'ENQUEUE' &&
                     step.cell?.[0] === r && step.cell?.[1] === c && step.f != null && (
                      <span className="pv-cell-f">{step.f}</span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Info panel */}
        <div className="pv-info">
          {algoType === 'astar' && step && (
            <div className="pv-info-panel">
              <div className="pv-info-title">A* Info</div>
              {step.cell && (
                <div className="pv-info-row">
                  <span className="pv-info-label">Cell</span>
                  <span className="pv-info-val">({step.cell[0]},{step.cell[1]})</span>
                </div>
              )}
              {step.g != null && (
                <div className="pv-info-row">
                  <span className="pv-info-label">g (cost)</span>
                  <span className="pv-info-val pv-g">{step.g}</span>
                </div>
              )}
              {step.h != null && (
                <div className="pv-info-row">
                  <span className="pv-info-label">h (heuristic)</span>
                  <span className="pv-info-val pv-h">{step.h}</span>
                </div>
              )}
              {step.f != null && (
                <div className="pv-info-row">
                  <span className="pv-info-label">f = g + h</span>
                  <span className="pv-info-val pv-f">{step.f}</span>
                </div>
              )}
              <div className="pv-info-row">
                <span className="pv-info-label">Open</span>
                <span className="pv-info-val">{step.openSet?.length ?? 0}</span>
              </div>
              <div className="pv-info-row">
                <span className="pv-info-label">Closed</span>
                <span className="pv-info-val">{step.closedSet?.length ?? 0}</span>
              </div>
            </div>
          )}

          {algoType === 'maze' && step && (
            <div className="pv-info-panel">
              <div className="pv-info-title">Maze Solver</div>
              {step.cell && (
                <div className="pv-info-row">
                  <span className="pv-info-label">Cell</span>
                  <span className="pv-info-val">({step.cell[0]},{step.cell[1]})</span>
                </div>
              )}
              <div className="pv-info-row">
                <span className="pv-info-label">Path len</span>
                <span className="pv-info-val">{step.path?.length ?? 0}</span>
              </div>
            </div>
          )}

          {isDone && finalPath.length > 0 && (
            <div className="pv-result">
              <span className="pv-result-icon">✓</span>
              <span className="pv-result-text">Path found! {finalPath.length - 1} steps</span>
            </div>
          )}
          {isDone && finalPath.length === 0 && (
            <div className="pv-result pv-result-fail">
              <span className="pv-result-icon">✕</span>
              <span className="pv-result-text">No path found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
