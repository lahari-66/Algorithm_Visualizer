export const bubbleSortSteps = (input) => {
  const arr = [...input]
  const steps = []
  const n = arr.length

  for (let i = 0; i < n; i += 1) {
    const passEnd = n - i - 1
    steps.push({
      type: 'POINTER_MOVE',
      indices: [passEnd],
      activeRange: [0, passEnd],
      pointers: [
        { label: 'I', index: i },
        { label: 'END', index: passEnd },
      ],
      description: `Start pass ${i + 1}. We will scan up to position ${passEnd + 1}.`,
      pseudocodeLine: 1,
    })
    for (let j = 0; j < n - i - 1; j += 1) {
      steps.push({
        type: 'POINTER_MOVE',
        indices: [j, j + 1],
        activeRange: [0, passEnd],
        pointers: [
          { label: 'J', index: j },
          { label: 'J+1', index: j + 1 },
        ],
        description: `Move J to position ${j + 1}.`,
        pseudocodeLine: 2,
      })

      steps.push({
        type: 'COMPARE',
        indices: [j, j + 1],
        activeRange: [0, passEnd],
        pointers: [
          { label: 'J', index: j },
          { label: 'J+1', index: j + 1 },
        ],
        description: `Compare ${arr[j]} and ${arr[j + 1]}.`,
        pseudocodeLine: 3,
      })

      if (arr[j] > arr[j + 1]) {
        steps.push({
          type: 'SWAP',
          indices: [j, j + 1],
          activeRange: [0, passEnd],
          pointers: [
            { label: 'J', index: j },
            { label: 'J+1', index: j + 1 },
          ],
          description: `Swap ${arr[j]} with ${arr[j + 1]}.`,
          pseudocodeLine: 4,
        })
        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
    steps.push({
      type: 'SORTED',
      indices: [n - i - 1],
      activeRange: [0, passEnd],
      pointers: [
        { label: 'END', index: passEnd },
      ],
      description: `Position ${n - i} is locked in place.`,
      pseudocodeLine: 5,
    })
  }

  return { steps }
}
