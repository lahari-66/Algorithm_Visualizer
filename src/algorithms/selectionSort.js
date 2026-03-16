export const selectionSortSteps = (input) => {
  const arr = [...input]
  const steps = []
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    steps.push({
      type: 'POINTER_MOVE',
      indices: [i],
      activeRange: [i, n - 1],
      pointers: [{ label: 'MIN', index: minIdx }, { label: 'I', index: i }],
      description: `Pass ${i + 1}: assume position ${i + 1} holds the minimum.`,
    })
    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: 'COMPARE',
        indices: [j, minIdx],
        activeRange: [i, n - 1],
        pointers: [{ label: 'MIN', index: minIdx }, { label: 'J', index: j }],
        description: `Compare ${arr[j]} at position ${j + 1} with current min ${arr[minIdx]}.`,
      })
      if (arr[j] < arr[minIdx]) {
        minIdx = j
        steps.push({
          type: 'POINTER_MOVE',
          indices: [minIdx],
          activeRange: [i, n - 1],
          pointers: [{ label: 'MIN', index: minIdx }, { label: 'J', index: j }],
          description: `New minimum found: ${arr[minIdx]} at position ${minIdx + 1}.`,
        })
      }
    }
    if (minIdx !== i) {
      steps.push({
        type: 'SWAP',
        indices: [i, minIdx],
        activeRange: [i, n - 1],
        pointers: [{ label: 'I', index: i }, { label: 'MIN', index: minIdx }],
        description: `Swap ${arr[i]} and ${arr[minIdx]} to place minimum at position ${i + 1}.`,
      })
      const t = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = t
    }
    steps.push({
      type: 'SORTED',
      indices: [i],
      activeRange: [i + 1, n - 1],
      pointers: [],
      description: `Position ${i + 1} is sorted with value ${arr[i]}.`,
    })
  }
  steps.push({ type: 'SORTED', indices: [n - 1], description: `All elements sorted.` })

  return { steps }
}
