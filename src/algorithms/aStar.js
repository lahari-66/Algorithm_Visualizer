// A* pathfinding on a small grid (rows x cols)
// 0 = open, 1 = wall
export const aStarSteps = (rows = 5, cols = 7, grid = null, start = [0,0], end = [4,6]) => {
  const G = grid ?? [
    [0,0,0,0,0,0,0],
    [0,1,1,0,1,1,0],
    [0,0,0,0,0,1,0],
    [0,1,0,1,0,0,0],
    [0,0,0,1,0,1,0],
  ]
  const steps = []
  const key = (r,c) => `${r},${c}`
  const h = (r,c) => Math.abs(r-end[0]) + Math.abs(c-end[1]) // Manhattan

  const gScore = {}
  const fScore = {}
  const cameFrom = {}
  const openSet = new Set()
  const closedSet = new Set()

  const sk = key(...start)
  gScore[sk] = 0
  fScore[sk] = h(...start)
  openSet.add(sk)

  steps.push({
    type: 'VISIT',
    cell: start,
    description: `A* start at (${start[0]},${start[1]}). Goal: (${end[0]},${end[1]}). h=${h(...start)}.`,
    openSet: [...openSet], closedSet: [...closedSet],
  })

  const dirs = [[-1,0],[1,0],[0,-1],[0,1]]

  while (openSet.size > 0) {
    // Pick node with lowest fScore
    let curr = null, bestF = Infinity
    for (const k of openSet) {
      if ((fScore[k] ?? Infinity) < bestF) { bestF = fScore[k]; curr = k }
    }
    const [cr, cc] = curr.split(',').map(Number)

    if (cr === end[0] && cc === end[1]) {
      // Reconstruct path
      const path = []
      let c = curr
      while (c) { path.unshift(c.split(',').map(Number)); c = cameFrom[c] }
      steps.push({
        type: 'DONE',
        path,
        description: `Path found! Length ${path.length - 1} steps: ${path.map(([r,c])=>`(${r},${c})`).join(' → ')}.`,
        openSet: [...openSet], closedSet: [...closedSet],
      })
      return { steps, grid: G, rows, cols, start, end }
    }

    openSet.delete(curr)
    closedSet.add(curr)
    steps.push({
      type: 'DEQUEUE',
      cell: [cr, cc],
      f: bestF,
      description: `Expand (${cr},${cc}) with f=${bestF}, g=${gScore[curr]}, h=${h(cr,cc)}.`,
      openSet: [...openSet], closedSet: [...closedSet],
    })

    for (const [dr, dc] of dirs) {
      const nr = cr + dr, nc = cc + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || G[nr][nc] === 1) continue
      const nk = key(nr, nc)
      if (closedSet.has(nk)) continue
      const tentG = (gScore[curr] ?? Infinity) + 1
      steps.push({
        type: 'COMPARE',
        cell: [nr, nc],
        from: [cr, cc],
        description: `Check neighbour (${nr},${nc}). Tentative g=${tentG}, current g=${gScore[nk] ?? '∞'}.`,
        openSet: [...openSet], closedSet: [...closedSet],
      })
      if (tentG < (gScore[nk] ?? Infinity)) {
        cameFrom[nk] = curr
        gScore[nk] = tentG
        fScore[nk] = tentG + h(nr, nc)
        openSet.add(nk)
        steps.push({
          type: 'ENQUEUE',
          cell: [nr, nc],
          g: tentG, h: h(nr,nc), f: fScore[nk],
          description: `Update (${nr},${nc}): g=${tentG}, h=${h(nr,nc)}, f=${fScore[nk]}. Add to open set.`,
          openSet: [...openSet], closedSet: [...closedSet],
        })
      }
    }
  }

  steps.push({ type: 'DONE', path: [], description: `No path found from (${start[0]},${start[1]}) to (${end[0]},${end[1]}).` })
  return { steps, grid: G, rows, cols, start, end }
}
