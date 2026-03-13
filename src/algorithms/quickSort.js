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

    for (let j = low; j < high; j += 1) {
      steps.push({
        type: 'compare',
        indices: [j, high],
        description: `Compare ${arr[j]} with pivot ${pivot}.`,
      })
      if (arr[j] < pivot) {
        steps.push({
          type: 'swap',
          indices: [i, j],
          description: `Swap ${arr[i]} and ${arr[j]}.`,
        })
        swap(i, j)
        i += 1
      }
    }

    steps.push({
      type: 'swap',
      indices: [i, high],
      description: `Move pivot ${pivot} into position ${i + 1}.`,
    })
    swap(i, high)
    steps.push({
      type: 'markSorted',
      indices: [i],
      description: `Pivot ${pivot} is in its final place.`,
    })

    return i
  }

  const sort = (low, high) => {
    if (low >= high) {
      if (low === high) {
        steps.push({
          type: 'markSorted',
          indices: [low],
          description: `Single element ${arr[low]} is sorted.`,
        })
      }
      return
    }

    const pivotIndex = partition(low, high)
    sort(low, pivotIndex - 1)
    sort(pivotIndex + 1, high)
  }

  sort(0, arr.length - 1)

  return { steps }
}
