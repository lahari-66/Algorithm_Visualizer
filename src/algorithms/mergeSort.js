export const mergeSortSteps = (input) => {
  const arr = [...input]
  const aux = [...input]
  const steps = []

  const merge = (start, mid, end) => {
    for (let i = start; i <= end; i += 1) {
      aux[i] = arr[i]
    }

    let left = start
    let right = mid + 1

    for (let k = start; k <= end; k += 1) {
      if (left > mid) {
        arr[k] = aux[right]
        steps.push({
          type: 'overwrite',
          indices: [k],
          value: arr[k],
          description: `Write ${arr[k]} into position ${k + 1}.`,
        })
        right += 1
      } else if (right > end) {
        arr[k] = aux[left]
        steps.push({
          type: 'overwrite',
          indices: [k],
          value: arr[k],
          description: `Write ${arr[k]} into position ${k + 1}.`,
        })
        left += 1
      } else {
        steps.push({
          type: 'compare',
          indices: [left, right],
          description: `Compare ${aux[left]} and ${aux[right]}.`,
        })
        if (aux[left] <= aux[right]) {
          arr[k] = aux[left]
          steps.push({
            type: 'overwrite',
            indices: [k],
            value: arr[k],
            description: `Write ${arr[k]} into position ${k + 1}.`,
          })
          left += 1
        } else {
          arr[k] = aux[right]
          steps.push({
            type: 'overwrite',
            indices: [k],
            value: arr[k],
            description: `Write ${arr[k]} into position ${k + 1}.`,
          })
          right += 1
        }
      }
    }
  }

  const sort = (start, end) => {
    if (start >= end) return
    const mid = Math.floor((start + end) / 2)
    sort(start, mid)
    sort(mid + 1, end)
    merge(start, mid, end)
  }

  sort(0, arr.length - 1)

  return { steps }
}
