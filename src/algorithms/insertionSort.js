export const insertionSortSteps = (input) => {
  const arr = [...input]
  const steps = []
  const n = arr.length

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    steps.push({
      type: 'POINTER_MOVE',
      indices: [i],
      activeRange: [0, i],
      pointers: [{ label: 'KEY', index: i }],
      description: `Pick element ${key} at position ${i + 1} as the key.`,
    })
    let j = i - 1
    while (j >= 0 && arr[j] > key) {
      steps.push({
        type: 'COMPARE',
        indices: [j, j + 1],
        activeRange: [0, i],
        pointers: [{ label: 'KEY', index: j + 1 }, { label: 'J', index: j }],
        description: `Compare ${arr[j]} > ${key}. Shift ${arr[j]} right.`,
      })
      arr[j + 1] = arr[j]
      steps.push({
        type: 'SWAP',
        indices: [j, j + 1],
        activeRange: [0, i],
        pointers: [{ label: 'J', index: j }],
        description: `Shift ${arr[j + 1]} from position ${j + 1} to ${j + 2}.`,
      })
      j--
    }
    arr[j + 1] = key
    steps.push({
      type: 'SORTED',
      indices: [j + 1],
      activeRange: [0, i],
      pointers: [{ label: 'KEY', index: j + 1 }],
      description: `Insert ${key} at position ${j + 2}. Positions 1–${i + 1} are now sorted.`,
    })
  }

  return { steps }
}
