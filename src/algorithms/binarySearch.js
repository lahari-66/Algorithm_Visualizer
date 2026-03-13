export const binarySearchSteps = (input, target) => {
  const arr = [...input]
  const steps = []
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    steps.push({
      type: 'range',
      indices: [left, right],
      description: `Search range is positions ${left + 1} to ${right + 1}.`,
    })
    const mid = Math.floor((left + right) / 2)

    steps.push({
      type: 'compare',
      indices: [mid],
      description: `Compare middle value ${arr[mid]} with ${target}.`,
    })

    if (arr[mid] === target) {
      steps.push({
        type: 'markFound',
        indices: [mid],
        description: `Found ${target} at position ${mid + 1}.`,
      })
      return { steps }
    }

    if (arr[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  steps.push({
    type: 'markFound',
    indices: [-1],
    description: `Value ${target} not found in the array.`,
  })

  return { steps }
}
