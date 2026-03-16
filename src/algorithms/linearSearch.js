export const linearSearchSteps = (input, target) => {
  const arr = [...input]
  const steps = []

  for (let i = 0; i < arr.length; i += 1) {
    steps.push({
      type: 'POINTER_MOVE',
      indices: [i],
      pointers: [{ label: 'I', index: i }],
      description: `Move to position ${i + 1}.`,
      pseudocodeLine: 1,
    })

    steps.push({
      type: 'COMPARE',
      indices: [i],
      pointers: [{ label: 'I', index: i }],
      description: `Check if ${arr[i]} equals ${target}.`,
      pseudocodeLine: 2,
    })

    if (arr[i] === target) {
      steps.push({
        type: 'FOUND',
        indices: [i],
        pointers: [{ label: 'I', index: i }],
        description: `Found ${target} at position ${i + 1}.`,
        pseudocodeLine: 2,
      })
      return { steps }
    }
  }

  steps.push({
    type: 'FOUND',
    indices: [-1],
    description: `Value ${target} not found in the array.`,
    pseudocodeLine: 3,
  })

  return { steps }
}
