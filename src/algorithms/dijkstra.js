// Dijkstra's shortest path on a weighted graph
export const dijkstraSteps = (nodeCount = 6, weightedEdges = null, startNode = 0) => {
  const n = nodeCount
  const edges = weightedEdges ?? [
    [0,1,4],[0,2,1],[2,1,2],[1,3,1],[2,3,5],[3,4,3],[1,4,6],[4,5,2],[3,5,7],
  ]
  const adj = Array.from({ length: n }, () => [])
  edges.forEach(([u, v, w]) => { adj[u].push({ to: v, w }); adj[v].push({ to: u, w }) })

  const INF = Infinity
  const dist = new Array(n).fill(INF)
  const prev = new Array(n).fill(null)
  const visited = new Array(n).fill(false)
  dist[startNode] = 0

  const steps = []
  steps.push({
    type: 'VISIT',
    node: startNode,
    dist: [...dist],
    visited: [...visited],
    description: `Start Dijkstra from node ${startNode}. Set dist[${startNode}] = 0, all others = ∞.`,
  })

  for (let iter = 0; iter < n; iter++) {
    // Pick unvisited node with smallest dist
    let u = -1
    for (let i = 0; i < n; i++) {
      if (!visited[i] && (u === -1 || dist[i] < dist[u])) u = i
    }
    if (u === -1 || dist[u] === INF) break

    visited[u] = true
    steps.push({
      type: 'DEQUEUE',
      node: u,
      dist: [...dist],
      visited: [...visited],
      description: `Pick node ${u} with smallest tentative distance ${dist[u]}.`,
    })

    for (const { to, w } of adj[u]) {
      steps.push({
        type: 'COMPARE',
        node: to,
        from: u,
        weight: w,
        dist: [...dist],
        visited: [...visited],
        description: `Relax edge ${u}→${to} (weight ${w}). Current dist[${to}] = ${dist[to] === INF ? '∞' : dist[to]}, new = ${dist[u] + w}.`,
      })
      if (dist[u] + w < dist[to]) {
        dist[to] = dist[u] + w
        prev[to] = u
        steps.push({
          type: 'OVERWRITE',
          node: to,
          dist: [...dist],
          visited: [...visited],
          description: `Update dist[${to}] = ${dist[to]} (via node ${u}).`,
        })
      }
    }
  }

  steps.push({
    type: 'DONE',
    dist: [...dist],
    prev: [...prev],
    visited: [...visited],
    description: `Dijkstra complete. Shortest distances from node ${startNode}: [${dist.map((d,i)=>`${i}:${d===INF?'∞':d}`).join(', ')}].`,
  })

  return { steps, graph: { n, edges, adj }, dist, prev }
}
