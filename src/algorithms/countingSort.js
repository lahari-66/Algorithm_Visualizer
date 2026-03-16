export const countingSortSteps = (input) => {
  const arr = [...input]
  const steps = []
  const max = Math.max(...arr)
  const min = Math.min(...arr)
  const range = max - min + 1
  const count = new Array(range).fill(0)

  steps.push({
    type: 'RANGE',
    indices: [],
    description: `Count sort: values range from ${min} to ${max} (${range} buckets).`,
  })

  // Count phase
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++
    steps.push({
      type: 'COMPARE',
      indices: [i],
      pointers: [{ label: 'I', index: i }],
      description: `Count ${arr[i]}: bucket[${arr[i] - min}] = ${count[arr[i] - min]}.`,
    })
  }

  // Prefix sum phase
  steps.push({
    type: 'POINTER_MOVE',
    indices: [],
    description: `Build prefix sums to determine output positions.`,
  })
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1]
    steps.push({
      type: 'OVERWRITE',
      indices: [],
      description: `Prefix sum: bucket[${i}] = ${count[i]} (cumulative up to value ${min + i}).`,
    })
  }

  // Place phase
  const output = new Array(arr.length)
  const original = [...arr]
  for (let i = arr.length - 1; i >= 0; i--) {
    const pos = count[original[i] - min] - 1
    output[pos] = original[i]
    count[original[i] - min]--
    steps.push({
      type: 'OVERWRITE',
      indices: [pos],
      value: original[i],
      pointers: [{ label: 'I', index: i }],
      description: `Place ${original[i]} at output position ${pos + 1}.`,
    })
  }

  // Mark all sorted
  for (let i = 0; i < output.length; i++) {
    steps.push({
      type: 'SORTED',
      indices: [i],
      description: `Position ${i + 1} = ${output[i]} is in its final sorted place.`,
    })
  }

  return { steps }
}
