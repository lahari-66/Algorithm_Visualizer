export const quickSortSteps = (input) => {
  const arr = [...input]
  const steps = []

  const swap = (first, second) => {
    const temp = arr[first]
    arr[first] = arr[second]
    arr[second] = temp
  }

  const partition = (low, high) => {
    const pivot = arr[high]
    let i = low

    steps.push({
      type: 'POINTER_MOVE',
      indices: [high],
      activeRange: [low, high],
      pointers: [
        { label: 'P', index: high },
      ],
      description: `Choose pivot ${pivot} at position ${high + 1}.`,
      pseudocodeLine: 3,
    })

    steps.push({
      type: 'POINTER_MOVE',
      indices: [i],
      activeRange: [low, high],
      pointers: [
        { label: 'I', index: i },
        { label: 'P', index: high },
      ],
      description: `Set I at position ${i + 1}.`,
      pseudocodeLine: 4,
    })

    for (let j = low; j < high; j += 1) {
      steps.push({
        type: 'POINTER_MOVE',
        indices: [j],
        activeRange: [low, high],
        pointers: [
          { label: 'I', index: i },
          { label: 'J', index: j },
          { label: 'P', index: high },
        ],
        description: `Move J to position ${j + 1}.`,
        pseudocodeLine: 5,
      })

      steps.push({
        type: 'COMPARE',
        indices: [j, high],
        activeRange: [low, high],
        pointers: [
          { label: 'J', index: j },
          { label: 'P', index: high },
        ],
        description: `Compare ${arr[j]} with pivot ${pivot}.`,
        pseudocodeLine: 6,
      })
      if (arr[j] < pivot) {
        steps.push({
          type: 'SWAP',
          indices: [i, j],
          activeRange: [low, high],
          pointers: [
            { label: 'I', index: i },
            { label: 'J', index: j },
          ],
          description: `Swap ${arr[i]} and ${arr[j]}.`,
          pseudocodeLine: 7,
        })
        swap(i, j)
        i += 1

        steps.push({
          type: 'POINTER_MOVE',
          indices: [i],
          activeRange: [low, high],
          pointers: [
            { label: 'I', index: i },
            { label: 'J', index: j },
          ],
          description: `Move I to position ${i + 1}.`,
          pseudocodeLine: 8,
        })
      }
    }

    steps.push({
      type: 'SWAP',
      indices: [i, high],
      activeRange: [low, high],
      pointers: [
        { label: 'I', index: i },
        { label: 'P', index: high },
      ],
      description: `Move pivot ${pivot} into position ${i + 1}.`,
      pseudocodeLine: 9,
    })
    swap(i, high)
    steps.push({
      type: 'SORTED',
      indices: [i],
      activeRange: [low, high],
      pointers: [
        { label: 'P', index: i },
      ],
      description: `Pivot ${pivot} is in its final place.`,
      pseudocodeLine: 9,
    })

    return i
  }

  const sort = (low, high) => {
    if (low >= high) {
      if (low === high) {
        steps.push({
          type: 'SORTED',
          indices: [low],
          activeRange: [low, high],
          pointers: [{ label: 'S', index: low }],
          description: `Single element ${arr[low]} is sorted.`,
          pseudocodeLine: 2,
        })
      }
      return
    }

    steps.push({
      type: 'RANGE',
      indices: [low, high],
      activeRange: [low, high],
      pointers: [
        { label: 'L', index: low },
        { label: 'R', index: high },
      ],
      description: `Focus on range ${low + 1}-${high + 1}.`,
      pseudocodeLine: 1,
    })

    const pivotIndex = partition(low, high)
    sort(low, pivotIndex - 1)
    sort(pivotIndex + 1, high)
  }

  sort(0, arr.length - 1)

  return { steps }
}
