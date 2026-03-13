export const bubbleSortSteps = (input) => {
  const arr = [...input]
  const steps = []
  const n = arr.length

  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n - i - 1; j += 1) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        description: `Compare ${arr[j]} and ${arr[j + 1]}.`,
      })

      if (arr[j] > arr[j + 1]) {
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          description: `Swap ${arr[j]} with ${arr[j + 1]}.`,
        })
        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
    steps.push({
      type: 'markSorted',
      indices: [n - i - 1],
      description: `Position ${n - i} is locked in place.`,
    })
  }

  return { steps }
}
