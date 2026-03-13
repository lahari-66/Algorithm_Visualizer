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
  ],
}

function PseudocodePanel({ algorithmKey, currentLine }) {
  const lines = PSEUDOCODE[algorithmKey] ?? []

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">Pseudocode</h2>
        <p className="text-sm text-slate-400">Current line highlights as the algorithm runs.</p>
      </div>
      <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4 font-mono text-sm">
        {lines.map((line, index) => {
          const lineNumber = index + 1
          const isActive = currentLine === lineNumber
          return (
            <div
              key={`${algorithmKey}-${lineNumber}`}
              className={`flex gap-3 rounded-lg px-2 py-1 ${
                isActive ? 'bg-cyan-500/15 text-cyan-200' : 'text-slate-300'
              }`}
            >
              <span className="w-6 text-right text-xs text-slate-500">{lineNumber}</span>
              <span>{line}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PseudocodePanel
