export const heapSortSteps = (input) => {
  const arr = [...input]
  const steps = []
  const n = arr.length

  const swap = (first, second) => {
    const temp = arr[first]
    arr[first] = arr[second]
    arr[second] = temp
  }

  const heapify = (size, root) => {
    let largest = root
    const left = 2 * root + 1
    const right = 2 * root + 2

    if (left < size) {
      steps.push({
        type: 'compare',
        indices: [left, largest],
        description: `Compare ${arr[left]} with ${arr[largest]}.`,
      })
      if (arr[left] > arr[largest]) {
        largest = left
      }
    }

    if (right < size) {
      steps.push({
        type: 'compare',
        indices: [right, largest],
        description: `Compare ${arr[right]} with ${arr[largest]}.`,
      })
      if (arr[right] > arr[largest]) {
        largest = right
      }
    }

    if (largest !== root) {
      steps.push({
        type: 'swap',
        indices: [root, largest],
        description: `Swap ${arr[root]} with ${arr[largest]}.`,
      })
      swap(root, largest)
      heapify(size, largest)
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
    heapify(n, i)
  }

  for (let end = n - 1; end > 0; end -= 1) {
    steps.push({
      type: 'swap',
      indices: [0, end],
      description: `Move max ${arr[0]} to the end.`,
    })
    swap(0, end)
    steps.push({
      type: 'markSorted',
      indices: [end],
      description: `Position ${end + 1} is sorted.`,
    })
    heapify(end, 0)
  }

  steps.push({
    type: 'markSorted',
    indices: [0],
    description: `First element ${arr[0]} is sorted.`,
  })

  return { steps }
}
