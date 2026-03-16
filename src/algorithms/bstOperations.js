// Binary Search Tree — Insert + Search operations
export const bstOperationsSteps = (insertValues = [5,3,7,1,4,6,8], searchTarget = 4) => {
  const steps = []
  let root = null

  class Node { constructor(v) { this.val = v; this.left = null; this.right = null } }

  const insert = (node, v, depth = 0) => {
    if (!node) {
      steps.push({ type: 'SORTED', val: v, depth, description: `Insert ${v}: empty spot found. Place node here.` })
      return new Node(v)
    }
    steps.push({ type: 'COMPARE', val: node.val, depth, description: `Insert ${v}: compare with node ${node.val}.` })
    if (v < node.val) {
      steps.push({ type: 'POINTER_MOVE', direction: 'left', depth, description: `${v} < ${node.val} — go left.` })
      node.left = insert(node.left, v, depth + 1)
    } else if (v > node.val) {
      steps.push({ type: 'POINTER_MOVE', direction: 'right', depth, description: `${v} > ${node.val} — go right.` })
      node.right = insert(node.right, v, depth + 1)
    } else {
      steps.push({ type: 'FOUND', val: v, depth, description: `${v} already exists in the BST.` })
    }
    return node
  }

  steps.push({ type: 'RANGE', description: `Building BST by inserting: [${insertValues.join(', ')}].` })
  for (const v of insertValues) {
    steps.push({ type: 'POINTER_MOVE', val: v, description: `--- Inserting ${v} ---` })
    root = insert(root, v)
  }

  // Search
  steps.push({ type: 'RANGE', description: `--- Searching for ${searchTarget} ---` })
  const search = (node, v, depth = 0) => {
    if (!node) {
      steps.push({ type: 'FOUND', val: v, depth, description: `${v} not found in BST.` })
      return
    }
    steps.push({ type: 'COMPARE', val: node.val, depth, description: `Search ${v}: compare with node ${node.val}.` })
    if (v === node.val) {
      steps.push({ type: 'FOUND', val: v, depth, description: `Found ${v} at depth ${depth}.` })
    } else if (v < node.val) {
      steps.push({ type: 'POINTER_MOVE', direction: 'left', depth, description: `${v} < ${node.val} — go left.` })
      search(node.left, v, depth + 1)
    } else {
      steps.push({ type: 'POINTER_MOVE', direction: 'right', depth, description: `${v} > ${node.val} — go right.` })
      search(node.right, v, depth + 1)
    }
  }
  search(root, searchTarget)

  steps.push({ type: 'DONE', description: `BST operations complete.` })
  return { steps, tree: root }
}
