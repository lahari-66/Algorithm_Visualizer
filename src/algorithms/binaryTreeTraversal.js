// Binary Tree Traversal — In-order, Pre-order, Post-order
// Tree is stored as array (1-indexed heap layout): node i has children 2i, 2i+1
export const binaryTreeTraversalSteps = (values = [4,2,6,1,3,5,7], mode = 'inorder') => {
  const steps = []
  const n = values.length
  // 1-indexed: node at index i (1-based), value = values[i-1]
  const val = (i) => (i <= n ? values[i - 1] : null)

  steps.push({
    type: 'RANGE',
    node: 1,
    description: `Start ${mode} traversal of binary tree with ${n} nodes.`,
  })

  const visit = (i, depth = 0) => {
    if (i > n || val(i) == null) return
    const left = 2 * i, right = 2 * i + 1

    if (mode === 'preorder') {
      steps.push({ type: 'VISIT', node: i, depth, description: `Pre-order: Visit node ${i} (value ${val(i)}).` })
    }
    if (left <= n) {
      steps.push({ type: 'POINTER_MOVE', node: left, from: i, depth, description: `Go left from node ${i} to node ${left} (value ${val(left)}).` })
      visit(left, depth + 1)
    }
    if (mode === 'inorder') {
      steps.push({ type: 'VISIT', node: i, depth, description: `In-order: Visit node ${i} (value ${val(i)}).` })
    }
    if (right <= n) {
      steps.push({ type: 'POINTER_MOVE', node: right, from: i, depth, description: `Go right from node ${i} to node ${right} (value ${val(right)}).` })
      visit(right, depth + 1)
    }
    if (mode === 'postorder') {
      steps.push({ type: 'VISIT', node: i, depth, description: `Post-order: Visit node ${i} (value ${val(i)}).` })
    }
    steps.push({ type: 'BACKTRACK', node: i, depth, description: `Backtrack from node ${i}.` })
  }

  visit(1)
  steps.push({ type: 'DONE', description: `${mode} traversal complete.` })

  return { steps, tree: { values, n } }
}
