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

    steps.push({
      type: 'POINTER_MOVE',
      indices: [root],
      activeRange: [0, size - 1],
      pointers: [
        { label: 'P', index: root },
        { label: 'L', index: left < size ? left : null },
        { label: 'R', index: right < size ? right : null },
      ],
      description: `Heapify at position ${root + 1}.`,
      pseudocodeLine: 4,
    })

    if (left < size) {
      steps.push({
        type: 'COMPARE',
        indices: [left, largest],
        activeRange: [0, size - 1],
        pointers: [
          { label: 'L', index: left },
          { label: 'P', index: largest },
        ],
        description: `Compare ${arr[left]} with ${arr[largest]}.`,
        pseudocodeLine: 4,
      })
      if (arr[left] > arr[largest]) {
        largest = left
      }
    }

    if (right < size) {
      steps.push({
        type: 'COMPARE',
        indices: [right, largest],
        activeRange: [0, size - 1],
        pointers: [
          { label: 'R', index: right },
          { label: 'P', index: largest },
        ],
        description: `Compare ${arr[right]} with ${arr[largest]}.`,
        pseudocodeLine: 4,
      })
      if (arr[right] > arr[largest]) {
        largest = right
      }
    }

    if (largest !== root) {
      steps.push({
        type: 'SWAP',
        indices: [root, largest],
        activeRange: [0, size - 1],
        pointers: [
          { label: 'P', index: root },
          { label: 'L', index: largest },
        ],
        description: `Swap ${arr[root]} with ${arr[largest]}.`,
        pseudocodeLine: 4,
      })
      swap(root, largest)
      heapify(size, largest)
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
    steps.push({
      type: 'POINTER_MOVE',
      indices: [i],
      activeRange: [0, n - 1],
      pointers: [
        { label: 'P', index: i },
      ],
      description: `Build heap: sift down from position ${i + 1}.`,
      pseudocodeLine: 1,
    })
    heapify(n, i)
  }

  for (let end = n - 1; end > 0; end -= 1) {
    steps.push({
      type: 'SWAP',
      indices: [0, end],
      activeRange: [0, end],
      pointers: [
        { label: 'P', index: 0 },
        { label: 'E', index: end },
      ],
      description: `Move max ${arr[0]} to the end.`,
      pseudocodeLine: 3,
    })
    swap(0, end)
    steps.push({
      type: 'SORTED',
      indices: [end],
      activeRange: [0, end - 1],
      pointers: [
        { label: 'E', index: end },
      ],
      description: `Position ${end + 1} is sorted.`,
      pseudocodeLine: 2,
    })
    heapify(end, 0)
  }

  steps.push({
    type: 'SORTED',
    indices: [0],
    activeRange: [0, 0],
    pointers: [
      { label: 'E', index: 0 },
    ],
    description: `First element ${arr[0]} is sorted.`,
    pseudocodeLine: 2,
  })

  return { steps }
}
