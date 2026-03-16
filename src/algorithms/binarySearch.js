export const binarySearchSteps = (input, target) => {
  const arr = [...input]
  const steps = []
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    steps.push({
      type: 'RANGE',
      indices: [left, right],
      activeRange: [left, right],
      pointers: [
        { label: 'L', index: left },
        { label: 'R', index: right },
      ],
      description: `Search range is positions ${left + 1} to ${right + 1}.`,
      pseudocodeLine: 1,
    })
    const mid = Math.floor((left + right) / 2)

    steps.push({
      type: 'POINTER_MOVE',
      indices: [mid],
      activeRange: [left, right],
      pointers: [
        { label: 'L', index: left },
        { label: 'M', index: mid },
        { label: 'R', index: right },
      ],
      description: `Check middle position ${mid + 1}.`,
      pseudocodeLine: 2,
    })

    steps.push({
      type: 'COMPARE',
      indices: [mid],
      activeRange: [left, right],
      pointers: [
        { label: 'M', index: mid },
      ],
      description: `Compare middle value ${arr[mid]} with ${target}.`,
      pseudocodeLine: 3,
    })

    if (arr[mid] === target) {
      steps.push({
        type: 'FOUND',
        indices: [mid],
        pointers: [{ label: 'M', index: mid }],
        description: `Found ${target} at position ${mid + 1}.`,
        pseudocodeLine: 3,
      })
      return { steps }
    }

    if (arr[mid] < target) {
      left = mid + 1
      steps.push({
        type: 'POINTER_MOVE',
        indices: [left],
        activeRange: [left, right],
        pointers: [
          { label: 'L', index: left },
        ],
        description: `Target is larger. Move L to position ${left + 1}.`,
        pseudocodeLine: 4,
      })
    } else {
      right = mid - 1
      steps.push({
        type: 'POINTER_MOVE',
        indices: [right],
        activeRange: [left, right],
        pointers: [
          { label: 'R', index: right },
        ],
        description: `Target is smaller. Move R to position ${right + 1}.`,
        pseudocodeLine: 5,
      })
    }
  }

  steps.push({
    type: 'FOUND',
    indices: [-1],
    description: `Value ${target} not found in the array.`,
    pseudocodeLine: 6,
  })

  return { steps }
}
