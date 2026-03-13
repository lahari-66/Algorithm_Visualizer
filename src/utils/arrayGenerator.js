export const generateRandomArray = (size, min = 8, max = 120) => {
  const result = []
  for (let i = 0; i < size; i += 1) {
    const value = Math.floor(Math.random() * (max - min + 1)) + min
    result.push(value)
  }
  return result
}

export const parseInputToArray = (input, maxSize = 60) => {
  if (!input.trim()) {
    return { array: [], error: 'Custom input is empty.' }
  }

  const values = input
    .split(/[,\s]+/)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))

  const positives = values.filter((value) => value > 0)

  if (!values.length) {
    return { array: [], error: 'No valid numbers found.' }
  }

  if (positives.length !== values.length) {
    return { array: [], error: 'Please enter only positive numbers.' }
  }

  if (positives.length > maxSize) {
    return { array: [], error: `Please limit input to ${maxSize} values.` }
  }

  return { array: positives, error: '' }
}
