export const shellSortSteps = (input) => {
  const arr = [...input]
  const steps = []
  const n = arr.length

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push({
      type: 'POINTER_MOVE',
      indices: [],
      activeRange: [0, n - 1],
      pointers: [{ label: 'GAP', index: gap - 1 }],
      description: `Set gap to ${gap}. Compare elements ${gap} apart.`,
      pseudocodeLine: 1,
    })

    for (let i = gap; i < n; i += 1) {
      steps.push({
        type: 'POINTER_MOVE',
        indices: [i],
        activeRange: [0, n - 1],
        pointers: [{ label: 'I', index: i }, { label: 'GAP', index: gap - 1 }],
        description: `Process position ${i + 1} with gap ${gap}.`,
        pseudocodeLine: 2,
      })

      for (let j = i; j >= gap; j -= gap) {
        steps.push({
          type: 'COMPARE',
          indices: [j - gap, j],
          activeRange: [0, n - 1],
          pointers: [{ label: 'J-G', index: j - gap }, { label: 'J', index: j }],
          description: `Compare ${arr[j - gap]} and ${arr[j]}.`,
          pseudocodeLine: 3,
        })

        if (arr[j - gap] <= arr[j]) {
          steps.push({
            type: 'POINTER_MOVE',
            indices: [j],
            activeRange: [0, n - 1],
            pointers: [{ label: 'J', index: j }],
            description: `No swap needed. Gap-sorted order holds at position ${j + 1}.`,
            pseudocodeLine: 4,
          })
          break
        }

        steps.push({
          type: 'SWAP',
          indices: [j - gap, j],
          activeRange: [0, n - 1],
          pointers: [{ label: 'J-G', index: j - gap }, { label: 'J', index: j }],
          description: `Swap ${arr[j - gap]} and ${arr[j]} to reduce inversions.`,
          pseudocodeLine: 4,
        })

        const temp = arr[j]
        arr[j] = arr[j - gap]
        arr[j - gap] = temp
      }
    }
  }

  for (let i = 0; i < n; i += 1) {
    steps.push({
      type: 'SORTED',
      indices: [i],
      activeRange: [0, n - 1],
      pointers: [],
      description: `Position ${i + 1} is now in final sorted order.`,
      pseudocodeLine: 5,
    })
  }

  return { steps }
}