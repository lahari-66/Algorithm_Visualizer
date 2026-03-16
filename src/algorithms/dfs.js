// DFS on a small adjacency-list graph (nodes 0..N-1)
export const dfsSteps = (nodeCount = 7, edgeList = null, startNode = 0) => {
  const n = nodeCount
  const edges = edgeList ?? [
    [0,1],[0,2],[1,3],[1,4],[2,5],[2,6],
  ]
  const adj = Array.from({ length: n }, () => [])
  edges.forEach(([u, v]) => { adj[u].push(v); adj[v].push(u) })

  const steps = []
  const visited = new Array(n).fill(false)
  const stack = []

  const dfs = (node, from) => {
    visited[node] = true
    stack.push(node)
    steps.push({
      type: 'VISIT',
      node,
      from,
      stack: [...stack],
      visited: [...visited],
      description: `Visit node ${node}${from != null ? ` (from ${from})` : ''}. Push onto stack.`,
    })

    for (const nb of adj[node]) {
      steps.push({
        type: 'COMPARE',
        node: nb,
        from: node,
        stack: [...stack],
        visited: [...visited],
        description: `Check neighbour ${nb} of node ${node}. ${visited[nb] ? 'Already visited — skip.' : 'Not visited — recurse.'}`,
      })
      if (!visited[nb]) {
        dfs(nb, node)
      }
    }

    stack.pop()
    steps.push({
      type: 'BACKTRACK',
      node,
      stack: [...stack],
      visited: [...visited],
      description: `Backtrack from node ${node}. Pop from stack.`,
    })
  }

  dfs(startNode, null)

  steps.push({
    type: 'DONE',
    visited: [...visited],
    description: `DFS complete. Traversal order covered all reachable nodes.`,
  })

  return { steps, graph: { n, edges, adj } }
}
