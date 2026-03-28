export const ALGORITHM_PLAYBOOK = {
  bubble: {
    theory:
      'Bubble Sort repeatedly compares adjacent values and swaps them when they are out of order. After each full pass, the largest unsorted value moves to the end.',
    bestFor: 'Good for teaching swaps and pass-based sorting; not efficient for large inputs.',
    steps: [
      'Start a pass from the beginning of the unsorted region.',
      'Compare each adjacent pair from left to right.',
      'Swap when the left value is greater than the right value.',
      'Mark the final compared index as sorted for this pass.',
      'Repeat until a pass makes no swaps or all positions are fixed.',
    ],
  },
  selection: {
    theory:
      'Selection Sort grows a sorted prefix by repeatedly finding the minimum value in the remaining unsorted suffix and placing it at the next position.',
    bestFor: 'Useful when write operations are expensive because it performs at most one swap per pass.',
    steps: [
      'Treat the array as sorted prefix plus unsorted suffix.',
      'Assume the first unsorted position is the current minimum.',
      'Scan the rest of the suffix to find the true minimum.',
      'Swap the minimum into the first unsorted position.',
      'Advance the boundary and repeat.',
    ],
  },
  insertion: {
    theory:
      'Insertion Sort builds a sorted prefix one element at a time by taking the next value and inserting it into the correct position among already sorted values.',
    bestFor: 'Excellent for small or nearly sorted arrays and for online insertion of new items.',
    steps: [
      'Take the next unsorted element as the key.',
      'Move left through the sorted prefix while elements are greater than the key.',
      'Shift larger elements one position to the right.',
      'Insert the key into the gap that remains.',
      'Repeat until all elements are inserted.',
    ],
  },
  merge: {
    theory:
      'Merge Sort is a divide-and-conquer algorithm: split the array into halves until single elements, then merge halves back in sorted order.',
    bestFor: 'Stable sorting with guaranteed O(n log n) time and predictable performance.',
    steps: [
      'Recursively split the array into left and right halves.',
      'Stop splitting when each subarray has one element.',
      'Merge two sorted halves by comparing their front elements.',
      'Write the smaller front element into the output position.',
      'Continue merging upward until the full array is merged.',
    ],
  },
  quick: {
    theory:
      'Quick Sort partitions the array around a pivot so smaller elements go left and larger elements go right, then recursively sorts each side.',
    bestFor: 'Fast average-case in-memory sorting with good cache locality.',
    steps: [
      'Choose a pivot element for the current range.',
      'Scan the range and move elements smaller than pivot to the left partition.',
      'Place the pivot between left and right partitions.',
      'Recursively apply partitioning on the left partition.',
      'Recursively apply partitioning on the right partition.',
    ],
  },
  heap: {
    theory:
      'Heap Sort first builds a max heap, then repeatedly extracts the maximum element by swapping the root with the end and restoring heap order.',
    bestFor: 'In-place O(n log n) sorting without requiring extra merge buffers.',
    steps: [
      'Build a max heap from the input array.',
      'Swap the heap root with the last element of the heap.',
      'Reduce heap size by one (end element is now sorted).',
      'Sift down the new root to restore heap property.',
      'Repeat extraction until heap size is one.',
    ],
  },
  counting: {
    theory:
      'Counting Sort counts occurrences of each value in a bounded integer range, then reconstructs sorted order from cumulative counts.',
    bestFor: 'Very fast when values are integers in a small range relative to n.',
    steps: [
      'Compute minimum and maximum to define bucket range.',
      'Count how many times each value appears.',
      'Convert counts to prefix sums for output positions.',
      'Place each input value into its final output index.',
      'Copy output back as the sorted result.',
    ],
  },
  shell: {
    theory:
      'Shell Sort performs insertion-sort style passes using decreasing gaps, which quickly reduces long-distance inversions before final adjacent insertion passes.',
    bestFor: 'Practical medium-sized arrays when a simple in-place improvement over insertion sort is desired.',
    steps: [
      'Initialize a gap sequence (for example n/2, n/4, ...).',
      'For each gap, run gapped insertion sort across the array.',
      'Shift elements by gap distance while out of order.',
      'Reduce gap and repeat the gapped pass.',
      'Finish with gap 1, producing fully sorted order.',
    ],
  },
  linear: {
    theory:
      'Linear Search checks each element one by one until it finds the target or reaches the end.',
    bestFor: 'Unsorted or very small datasets where setup cost must be minimal.',
    steps: [
      'Start at the first position.',
      'Compare current value with the target.',
      'If equal, return the current index.',
      'Otherwise move to the next position.',
      'If end is reached, report not found.',
    ],
  },
  binary: {
    theory:
      'Binary Search operates on sorted data by repeatedly halving the search interval using middle comparisons.',
    bestFor: 'Fast lookups on sorted arrays or ordered index structures.',
    steps: [
      'Set left and right bounds for the sorted array.',
      'Compute the middle index of the active range.',
      'Compare middle value with the target.',
      'Discard half the range based on comparison result.',
      'Repeat until target is found or bounds cross.',
    ],
  },
  bfs: {
    theory:
      'Breadth-First Search explores graph nodes level by level using a queue, guaranteeing shortest path length in unweighted graphs.',
    bestFor: 'Finding minimum-edge paths and layer-wise traversal from a source node.',
    steps: [
      'Mark the source as visited and enqueue it.',
      'Dequeue the next node to process.',
      'Inspect each neighbor of that node.',
      'Enqueue unvisited neighbors and mark them visited.',
      'Continue until the queue is empty.',
    ],
  },
  dfs: {
    theory:
      'Depth-First Search explores as far as possible along each branch before backtracking, typically using recursion or an explicit stack.',
    bestFor: 'Connectivity checks, topological workflows, and branch exploration.',
    steps: [
      'Start from a source node and mark it visited.',
      'Visit one unvisited neighbor and go deeper.',
      'Continue descending until no unvisited neighbor remains.',
      'Backtrack to the previous node.',
      'Repeat until all reachable nodes are visited.',
    ],
  },
  dijkstra: {
    theory:
      'Dijkstra computes shortest paths from a source in a graph with non-negative edge weights by greedily finalizing the nearest unvisited node.',
    bestFor: 'Weighted shortest-path queries when all edge weights are non-negative.',
    steps: [
      'Initialize all distances to infinity except source at 0.',
      'Pick the unvisited node with smallest tentative distance.',
      'Relax each outgoing edge from that node.',
      'Update neighbor distances when a shorter path is found.',
      'Repeat until all nodes are finalized or unreachable.',
    ],
  },
  bttree: {
    theory:
      'Tree traversal visits nodes in a structured order. Preorder, inorder, and postorder each emphasize different processing timing around children.',
    bestFor: 'Hierarchical data processing where visitation order matters.',
    steps: [
      'Start from the root node.',
      'Traverse left subtree according to selected order.',
      'Visit current node at the order-defined moment.',
      'Traverse right subtree.',
      'Backtrack until traversal is complete.',
    ],
  },
  bst: {
    theory:
      'Binary Search Tree operations use ordering invariant: left subtree values are smaller, right subtree values are larger, enabling logarithmic average search and insert.',
    bestFor: 'Dynamic ordered sets with frequent lookups and inserts.',
    steps: [
      'Start at the BST root.',
      'Compare target or insert value with current node value.',
      'Move left for smaller values, right for larger values.',
      'Stop when found or when null child position is reached.',
      'Insert or report result, preserving BST invariant.',
    ],
  },
  astar: {
    theory:
      'A* search combines path cost so far g(n) and heuristic estimate h(n) to goal, evaluating f(n) = g(n) + h(n). With an admissible heuristic, it finds optimal paths.',
    bestFor: 'Goal-directed shortest path search on grids and weighted graphs.',
    steps: [
      'Initialize open set with the start node.',
      'Select open node with smallest f score.',
      'If it is goal, reconstruct and return the path.',
      'For each neighbor, compute tentative g score.',
      'Update neighbor scores/parent and push to open set as needed.',
    ],
  },
  maze: {
    theory:
      'Maze solving here uses systematic exploration and backtracking to find a valid route from start to goal while avoiding blocked cells.',
    bestFor: 'Path discovery in grid mazes where dead ends are common.',
    steps: [
      'Start from the entry cell and mark it visited.',
      'Try moving to valid neighboring cells.',
      'Advance recursively while recording current path.',
      'If dead end is reached, backtrack and try another branch.',
      'Stop when goal is reached or all options are exhausted.',
    ],
  },
}

export const FALLBACK_PLAYBOOK = {
  theory: 'This algorithm processes data step by step and updates state based on each operation.',
  bestFor: 'Learning foundational algorithmic flow and decision points.',
  steps: [
    'Initialize required variables and state.',
    'Evaluate the next candidate operation.',
    'Apply state changes for that operation.',
    'Repeat until termination condition is met.',
    'Return final result.',
  ],
}
