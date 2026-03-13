export const linearSearchSteps = (input, target) => {
  const arr = [...input]
  const steps = []

  for (let i = 0; i < arr.length; i += 1) {
    steps.push({
      type: 'compare',
      indices: [i],
      description: `Check if ${arr[i]} equals ${target}.`,
    })

    if (arr[i] === target) {
      steps.push({
        type: 'markFound',
        indices: [i],
        description: `Found ${target} at position ${i + 1}.`,
      })
      return { steps }
    }
  }

  steps.push({
    type: 'markFound',
    indices: [-1],
    description: `Value ${target} not found in the array.`,
  })

  return { steps }
}
