// BFS on a small adjacency-list graph (nodes 0..N-1)
// Returns steps with type VISIT / ENQUEUE / DEQUEUE / DONE
export const bfsSteps = (nodeCount = 7, edgeList = null, startNode = 0) => {
  const n = nodeCount
  // Default graph edges if none provided
  const edges = edgeList ?? [
    [0,1],[0,2],[1,3],[1,4],[2,5],[2,6],
  ]
  const adj = Array.from({ length: n }, () => [])
  edges.forEach(([u, v]) => { adj[u].push(v); adj[v].push(u) })

  const steps = []
  const visited = new Array(n).fill(false)
  const queue = [startNode]
  visited[startNode] = true

  steps.push({
    type: 'VISIT',
    node: startNode,
    queue: [...queue],
    visited: [...visited],
    description: `Start BFS from node ${startNode}. Mark it visited and enqueue.`,
  })

  while (queue.length > 0) {
    const curr = queue.shift()
    steps.push({
      type: 'DEQUEUE',
      node: curr,
      queue: [...queue],
      visited: [...visited],
      description: `Dequeue node ${curr}. Explore its neighbours.`,
    })

    for (const nb of adj[curr]) {
      steps.push({
        type: 'COMPARE',
        node: nb,
        from: curr,
        queue: [...queue],
        visited: [...visited],
        description: `Check neighbour ${nb} of node ${curr}. ${visited[nb] ? 'Already visited — skip.' : 'Not visited yet.'}`,
      })
      if (!visited[nb]) {
        visited[nb] = true
        queue.push(nb)
        steps.push({
          type: 'ENQUEUE',
          node: nb,
          from: curr,
          queue: [...queue],
          visited: [...visited],
          description: `Mark node ${nb} visited and enqueue it.`,
        })
      }
    }
  }

  steps.push({
    type: 'DONE',
    visited: [...visited],
    description: `BFS complete. All reachable nodes visited: [${visited.map((v,i)=>v?i:null).filter(x=>x!==null).join(', ')}].`,
  })

  return { steps, graph: { n, edges, adj } }
}
