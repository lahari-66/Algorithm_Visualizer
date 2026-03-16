import { useMemo } from 'react'
import ArrayCellVisualizer from './ArrayCellVisualizer.jsx'

// Build the full recursion tree structure from the initial array
function buildTree(arr, start, end) {
  if (start > end) return null
  const mid = Math.floor((start + end) / 2)
  return {
    start, end,
    values: arr.slice(start, end + 1),
    left: start < end ? buildTree(arr, start, mid) : null,
    right: start < end ? buildTree(arr, mid + 1, end) : null,
    depth: 0, // filled below
  }
}

function assignDepths(node, depth = 0) {
  if (!node) return 0
  node.depth = depth
  const ld = assignDepths(node.left, depth + 1)
  const rd = assignDepths(node.right, depth + 1)
  return Math.max(ld, rd, depth)
}

// Flatten tree into level-order for rendering
function flattenByLevel(root) {
  if (!root) return []
  const levels = []
  const queue = [root]
  while (queue.length) {
    const size = queue.length
    const level = []
    for (let i = 0; i < size; i++) {
      const node = queue.shift()
      level.push(node)
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
    levels.push(level)
  }
  return levels
}

export default function MergeSortVisualizer({ baseArray, values, actionIndices, sortedIndices, activeRange, pointers, lastType, isDone, steps, stepIndex }) {
  const tree = useMemo(() => {
    if (!baseArray.length) return null
    const root = buildTree(baseArray, 0, baseArray.length - 1)
    assignDepths(root)
    return root
  }, [baseArray])

  const levels = useMemo(() => tree ? flattenByLevel(tree) : [], [tree])

  // Determine which node is currently active
  const activeKey = activeRange ? `${activeRange[0]}-${activeRange[1]}` : null

  // Determine phase from lastType
  const isMerging = lastType === 'OVERWRITE' || lastType === 'COMPARE'

  return (
    <div className="msv-root">
      {/* Recursion tree */}
      <div className="msv-tree-section">
        <div className="msv-section-label">
          {isMerging ? '🔀 Merge Phase' : '✂️ Split Phase'}
        </div>
        <div className="msv-tree">
          {levels.map((level, li) => (
            <div key={li} className="msv-level">
              {level.map((node) => {
                const key = `${node.start}-${node.end}`
                const isActive = key === activeKey
                const isSingleDone = isDone || (sortedIndices.includes(node.start) && sortedIndices.includes(node.end))
                return (
                  <div
                    key={key}
                    className={`msv-node${isActive ? (isMerging ? ' msv-merging' : ' msv-splitting') : ''}${isSingleDone ? ' msv-node-done' : ''}`}
                  >
                    {node.values.map((v, vi) => (
                      <span key={vi} className="msv-node-val">{v}</span>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Current array state as cells */}
      <div className="msv-array-section">
        <div className="msv-section-label">Array State</div>
        <ArrayCellVisualizer
          values={values}
          actionIndices={actionIndices}
          sortedIndices={sortedIndices}
          activeRange={activeRange}
          pointers={pointers}
          lastType={lastType}
          isDone={isDone}
        />
      </div>

      {/* Active merge operation detail */}
      {isMerging && activeRange && (
        <div className="msv-merge-detail">
          <span className="msv-merge-label">Merging range</span>
          <span className="msv-merge-range">[{activeRange[0]}…{activeRange[1]}]</span>
          <div className="msv-merge-cells">
            {values.slice(activeRange[0], activeRange[1] + 1).map((v, i) => {
              const realIdx = activeRange[0] + i
              const isAct = actionIndices.includes(realIdx)
              return (
                <span key={i} className={`msv-merge-cell${isAct ? ' msv-merge-cell-active' : ''}`}>{v}</span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
