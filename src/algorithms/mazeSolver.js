// Maze solver using recursive backtracking (DFS)
export const mazeSolverSteps = (rows = 5, cols = 7, maze = null, start = [0,0], end = [4,6]) => {
  const M = maze ?? [
    [0,0,1,0,0,0,0],
    [1,0,1,0,1,1,0],
    [0,0,0,0,0,1,0],
    [0,1,1,1,0,0,0],
    [0,0,0,1,0,1,0],
  ]
  const steps = []
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false))
  const path = []
  let solved = false

  const dirs = [[0,1],[1,0],[0,-1],[-1,0]]
  const dirNames = ['right','down','left','up']

  const solve = (r, c) => {
    if (solved) return
    if (r < 0 || r >= rows || c < 0 || c >= cols || M[r][c] === 1 || visited[r][c]) return

    visited[r][c] = true
    path.push([r, c])
    steps.push({
      type: 'VISIT',
      cell: [r, c],
      path: path.map(p => [...p]),
      description: `Visit cell (${r},${c}). Current path length: ${path.length}.`,
    })

    if (r === end[0] && c === end[1]) {
      solved = true
      steps.push({
        type: 'DONE',
        path: path.map(p => [...p]),
        description: `Maze solved! Path: ${path.map(([pr,pc])=>`(${pr},${pc})`).join(' → ')}.`,
      })
      return
    }

    for (let d = 0; d < 4; d++) {
      const nr = r + dirs[d][0], nc = c + dirs[d][1]
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && M[nr][nc] === 0) {
        steps.push({
          type: 'COMPARE',
          cell: [nr, nc],
          from: [r, c],
          description: `Try going ${dirNames[d]} to (${nr},${nc}).`,
        })
        solve(nr, nc)
        if (solved) return
      }
    }

    path.pop()
    steps.push({
      type: 'BACKTRACK',
      cell: [r, c],
      path: path.map(p => [...p]),
      description: `Dead end at (${r},${c}). Backtrack.`,
    })
  }

  steps.push({ type: 'RANGE', description: `Maze solver: find path from (${start[0]},${start[1]}) to (${end[0]},${end[1]}).` })
  solve(...start)
  if (!solved) {
    steps.push({ type: 'DONE', path: [], description: `No path found through the maze.` })
  }

  return { steps, maze: M, rows, cols, start, end }
}
