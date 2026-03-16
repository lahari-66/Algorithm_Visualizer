const PSEUDOCODE = {
  bubble: [
    'for i from 0 to n-1',
    '  for j from 0 to n-i-2',
    '    if arr[j] > arr[j+1]',
    '      swap arr[j], arr[j+1]',
    '  mark arr[n-i-1] sorted',
  ],
  merge: [
    'mergeSort(start, end)',
    '  if start >= end return',
    '  mid = floor((start+end)/2)',
    '  mergeSort(start, mid)',
    '  mergeSort(mid+1, end)',
    '  merge(start, mid, end)',
  ],
  quick: [
    'quickSort(low, high)',
    '  if low >= high return',
    '  pivot = arr[high]',
    '  i = low',
    '  for j from low to high-1',
    '    if arr[j] < pivot',
    '      swap arr[i], arr[j]',
    '      i++',
    '  swap arr[i], arr[high]',
  ],
  heap: [
    'build max heap',
    'for end from n-1 to 1',
    '  swap root with arr[end]',
    '  heapify(0, end)',
  ],
  linear: [
    'for i from 0 to n-1',
    '  if arr[i] == target return i',
    'return not found',
  ],
  binary: [
    'while left <= right',
    '  mid = floor((left+right)/2)',
    '  if arr[mid] == target return mid',
    '  if arr[mid] < target: left = mid + 1',
    '  else right = mid - 1',
    'return not found',
  ],
}

function PseudocodePanel({ algorithmKey, currentLine }) {
  const lines = PSEUDOCODE[algorithmKey] ?? []

  return (
    <div className="pseudocode-panel">
      <div className="pseudocode-header">
        <h2>Pseudocode</h2>
        <p>Current line highlights as the algorithm runs.</p>
      </div>
      <div className="pseudocode-box">
        {lines.map((line, index) => {
          const lineNumber = index + 1
          const isActive = currentLine === lineNumber
          return (
            <div
              key={`${algorithmKey}-${lineNumber}`}
              className={`pseudocode-line ${isActive ? 'active' : ''}`}
            >
              <span className="pseudocode-line-number">{lineNumber}</span>
              <span className="pseudocode-line-text">{line}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PseudocodePanel
