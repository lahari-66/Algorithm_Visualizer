export const mergeSortSteps = (input) => {
  const arr = [...input]
  const aux = [...input]
  const steps = []
  const n = arr.length

  const pushStep = (step) => {
    steps.push(step)
  }

  const merge = (start, mid, end) => {
    for (let i = start; i <= end; i += 1) {
      aux[i] = arr[i]
    }

    let left = start
    let right = mid + 1
    pushStep({
      type: 'POINTER_MOVE',
      indices: [start, end],
      activeRange: [start, end],
      pointers: [
        { label: 'L', index: left },
        { label: 'R', index: right },
        { label: 'W', index: start },
      ],
      description: `Merge ranges ${start + 1}-${mid + 1} and ${mid + 2}-${end + 1}.`,
      pseudocodeLine: 6,
    })

    for (let k = start; k <= end; k += 1) {
      if (left > mid) {
        pushStep({
          type: 'POINTER_MOVE',
          indices: [k],
          activeRange: [start, end],
          pointers: [
            { label: 'R', index: right },
            { label: 'W', index: k },
          ],
          description: `Left half is empty. Take from the right half.`,
          pseudocodeLine: 6,
        })
        arr[k] = aux[right]
        pushStep({
          type: 'OVERWRITE',
          indices: [k],
          value: arr[k],
          activeRange: [start, end],
          pointers: [
            { label: 'R', index: right },
            { label: 'W', index: k },
          ],
          description: `Write ${arr[k]} into position ${k + 1}.`,
          pseudocodeLine: 6,
        })
        right += 1
      } else if (right > end) {
        pushStep({
          type: 'POINTER_MOVE',
          indices: [k],
          activeRange: [start, end],
          pointers: [
            { label: 'L', index: left },
            { label: 'W', index: k },
          ],
          description: `Right half is empty. Take from the left half.`,
          pseudocodeLine: 6,
        })
        arr[k] = aux[left]
        pushStep({
          type: 'OVERWRITE',
          indices: [k],
          value: arr[k],
          activeRange: [start, end],
          pointers: [
            { label: 'L', index: left },
            { label: 'W', index: k },
          ],
          description: `Write ${arr[k]} into position ${k + 1}.`,
          pseudocodeLine: 6,
        })
        left += 1
      } else {
        pushStep({
          type: 'COMPARE',
          indices: [left, right],
          activeRange: [start, end],
          pointers: [
            { label: 'L', index: left },
            { label: 'R', index: right },
          ],
          description: `Compare ${aux[left]} and ${aux[right]}.`,
          pseudocodeLine: 6,
        })
        if (aux[left] <= aux[right]) {
          arr[k] = aux[left]
          pushStep({
            type: 'OVERWRITE',
            indices: [k],
            value: arr[k],
            activeRange: [start, end],
            pointers: [
              { label: 'L', index: left },
              { label: 'W', index: k },
            ],
            description: `Write ${arr[k]} into position ${k + 1}.`,
            pseudocodeLine: 6,
          })
          left += 1
        } else {
          arr[k] = aux[right]
          pushStep({
            type: 'OVERWRITE',
            indices: [k],
            value: arr[k],
            activeRange: [start, end],
            pointers: [
              { label: 'R', index: right },
              { label: 'W', index: k },
            ],
            description: `Write ${arr[k]} into position ${k + 1}.`,
            pseudocodeLine: 6,
          })
          right += 1
        }
      }
    }

    if (start === 0 && end === n - 1) {
      for (let i = start; i <= end; i += 1) {
        pushStep({
          type: 'SORTED',
          indices: [i],
          activeRange: [start, end],
          pointers: [{ label: 'W', index: i }],
          description: `${arr[i]} is now locked in its final position.`,
          pseudocodeLine: 6,
        })
      }
    }
  }

  const sort = (start, end) => {
    pushStep({
      type: 'RANGE',
      indices: [start, end],
      activeRange: [start, end],
      pointers: [
        { label: 'S', index: start },
        { label: 'E', index: end },
      ],
      description: `Focus on range ${start + 1}-${end + 1}.`,
      pseudocodeLine: 1,
    })

    if (start >= end) {
      pushStep({
        type: 'RANGE',
        indices: [start, end],
        activeRange: [start, end],
        pointers: [{ label: 'S', index: start }],
        description: `Single element range. Return.`,
        pseudocodeLine: 2,
      })
      return
    }

    const mid = Math.floor((start + end) / 2)
    pushStep({
      type: 'POINTER_MOVE',
      indices: [mid],
      activeRange: [start, end],
      pointers: [{ label: 'MID', index: mid }],
      description: `Split at midpoint ${mid + 1}.`,
      pseudocodeLine: 3,
    })
    sort(start, mid)
    sort(mid + 1, end)
    merge(start, mid, end)
  }

  sort(0, arr.length - 1)

  return { steps }
}
