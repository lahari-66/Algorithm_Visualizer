/**
 * Comprehensive Algorithm Theory and Explanations
 * Includes definitions, complexity analysis, use cases, and step-by-step breakdowns
 */

export const ALGORITHM_THEORY = {
  // ============ SORTING ALGORITHMS ============
  
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    category: 'Sorting',
    
    definition: 'Bubble Sort is a simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The process continues until the list is sorted.',
    
    complexity: {
      time: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)',
      },
      space: 'O(1)',
    },
    
    theory: `
Bubble Sort operates on the principle of "bubbling" larger elements toward the end of the array with each pass. In each iteration, the largest unsorted element "bubbles up" to its correct position at the end.

How it works:
1. Start at the beginning of the array
2. Compare each pair of adjacent elements
3. If the left element is greater than the right, swap them
4. Move to the next pair and repeat
5. After each complete pass, the largest element is in its final position
6. Repeat for the remaining unsorted portion until the array is sorted

The algorithm performs multiple passes through the data, each time moving the largest unsorted element to its correct position. It's called "bubble" sort because smaller elements gradually "bubble" up to the front.
    `,
    
    characteristics: [
      'Simple and easy to understand',
      'In-place sorting (O(1) space)',
      'Stable sort (maintains relative order of equal elements)',
      'Can detect if array is already sorted',
    ],
    
    useCases: [
      'Educational purposes to learn sorting concepts',
      'Sorting small datasets where simplicity matters more than efficiency',
      'When stability is required and data is nearly sorted',
    ],
    
    advantages: [
      'Very simple implementation',
      'No extra space required (in-place)',
      'Stable sorting algorithm',
      'Easy to understand for beginners',
    ],
    
    disadvantages: [
      'Very slow for large datasets (O(n²) time complexity)',
      'Inefficient for nearly sorted data without optimization',
      'Many unnecessary comparisons',
    ],
    
    stepByStep: [
      'Pass 1: Compare all adjacent pairs, bubble largest to end',
      'Pass 2: Repeat for n-1 elements, second largest in place',
      'Pass 3: Continue reducing range by 1 each iteration',
      'Stop when no swaps occur or array is fully sorted',
    ],
    
    betterAlternatives: ['Merge Sort', 'Quick Sort', 'Heap Sort'],
  },

  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    category: 'Sorting',
    
    definition: 'Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time. It iterates through an array, and for each element, inserts it into its correct position among the already sorted portion.',
    
    complexity: {
      time: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)',
      },
      space: 'O(1)',
    },
    
    theory: `
Insertion Sort views the array as two parts: sorted and unsorted. It expands the sorted portion by inserting the first unsorted element into its proper position.

How it works:
1. Start with second element (first is trivially sorted)
2. Compare current element with elements in sorted portion
3. Shift sorted elements right until correct position found
4. Insert current element in its position
5. Expand sorted portion and repeat

Similar to how people sort playing cards in hand - pick one card at a time and insert it into its correct position relative to already sorted cards.
    `,
    
    characteristics: [
      'Simple and intuitive algorithm',
      'In-place sorting',
      'Stable sort',
      'Efficient for small datasets',
      'Adaptive - O(n) if array is nearly sorted',
    ],
    
    useCases: [
      'Sorting small arrays (typically < 50 elements)',
      'Sorting nearly sorted data',
      'When stability is required',
      'Hybrid sorting (base case in algorithms like TimSort)',
    ],
    
    advantages: [
      'Efficient for small datasets',
      'Adaptive - faster on nearly sorted data',
      'Stable sorting algorithm',
      'In-place and simple implementation',
      'Only requires O(1) extra space',
    ],
    
    disadvantages: [
      'O(n²) complexity makes it slow for large datasets',
      'Many shift operations required',
      'Not suitable for large-scale applications',
    ],
    
    stepByStep: [
      'Mark first element as sorted',
      'Pick next unsorted element',
      'Compare with sorted elements from right to left',
      'Shift larger elements one position right',
      'Insert element in empty position',
      'Repeat until all elements processed',
    ],
    
    betterAlternatives: ['Merge Sort', 'Quick Sort', 'Heap Sort'],
  },

  selection: {
    id: 'selection',
    name: 'Selection Sort',
    category: 'Sorting',
    
    definition: 'Selection Sort divides the array into sorted and unsorted portions. It repeatedly finds the minimum element from the unsorted portion and moves it to the sorted portion.',
    
    complexity: {
      time: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)',
      },
      space: 'O(1)',
    },
    
    theory: `
Selection Sort works by repeatedly selecting the smallest remaining element and placing it at the beginning. The algorithm processes the array in two phases: finding the minimum and placing it in the correct position.

How it works:
1. Find the minimum element in the array
2. Swap it with the first element
3. Find minimum in remaining unsorted portion
4. Swap with first element of unsorted portion
5. Repeat until array is sorted

Each iteration guarantees one element is in its final position.
    `,
    
    characteristics: [
      'Simple comparison-based sort',
      'In-place sorting',
      'Not stable (equal elements may not maintain order)',
      'Consistent O(n²) performance',
      'Minimal number of swaps',
    ],
    
    useCases: [
      'When minimizing write/swap operations is important',
      'Small datasets',
      'When stability is not required',
    ],
    
    advantages: [
      'Simple and easy to implement',
      'Minimum number of swaps (at most n swaps)',
      'In-place sorting with O(1) space',
      'Consistent O(n²) regardless of input',
    ],
    
    disadvantages: [
      'O(n²) time complexity even for sorted arrays',
      'Not stable',
      'Makes many unnecessary comparisons',
      'Poor performance on large datasets',
    ],
    
    stepByStep: [
      'Find minimum in entire array',
      'Swap with first position',
      'Find minimum in remaining unsorted portion',
      'Swap with next available position',
      'Continue until entire array is sorted',
    ],
    
    betterAlternatives: ['Merge Sort', 'Quick Sort', 'Heap Sort'],
  },

  merge: {
    id: 'merge',
    name: 'Merge Sort',
    category: 'Sorting',
    
    definition: 'Merge Sort is a divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves back together.',
    
    complexity: {
      time: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)',
      },
      space: 'O(n)',
    },
    
    theory: `
Merge Sort uses the divide-and-conquer strategy to achieve guaranteed O(n log n) performance. It's highly efficient and predictable.

How it works:
1. Divide array into two halves
2. Recursively sort left half
3. Recursively sort right half
4. Merge the two sorted halves

Merge process:
- Use two pointers for each sorted half
- Compare elements and add smaller to result
- Continue until one half is exhausted
- Add remaining elements from other half

The magic is in the merge step - combining two sorted arrays is linear time O(n).
    `,
    
    characteristics: [
      'Divide-and-conquer approach',
      'Guaranteed O(n log n) complexity',
      'Stable sort',
      'Requires O(n) extra space',
      'Consistent performance',
      'Natural for linked lists',
    ],
    
    useCases: [
      'Large datasets requiring guaranteed performance',
      'When stability is required',
      'External sorting (data larger than memory)',
      'Parallel processing scenarios',
      'When worst-case performance is critical',
    ],
    
    advantages: [
      'Guaranteed O(n log n) in all cases',
      'Stable sorting algorithm',
      'Highly parallelizable',
      'Works well with linked lists',
      'Predictable performance',
    ],
    
    disadvantages: [
      'Requires O(n) extra space',
      'Slightly slower than Quick Sort on average for arrays',
      'Not in-place',
    ],
    
    stepByStep: [
      'Divide array into two halves recursively until size 1',
      'Recursively sort left half',
      'Recursively sort right half',
      'Merge sorted halves using two-pointer technique',
      'Combine results bottom-up',
    ],
    
    relatedConcepts: ['Divide and Conquer', 'Binary trees', 'Recursion'],
  },

  quick: {
    id: 'quick',
    name: 'Quick Sort',
    category: 'Sorting',
    
    definition: 'Quick Sort is a divide-and-conquer algorithm that selects a pivot element and partitions the array around it, recursively sorting the partitions.',
    
    complexity: {
      time: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)',
      },
      space: 'O(log n)',
    },
    
    theory: `
Quick Sort is one of the most practical sorting algorithms, favored for its average-case efficiency and in-place sorting capability.

How it works:
1. Choose a pivot element
2. Partition array: elements < pivot left, > pivot right
3. Recursively sort left partition
4. Recursively sort right partition

Pivot selection strategies:
- First element: simple but poor on sorted data
- Last element: common approach
- Median-of-three: balanced
- Random: helps avoid worst case

The partition step efficiently rearranges elements around the pivot in linear time.
    `,
    
    characteristics: [
      'Divide-and-conquer approach',
      'Average O(n log n), worst O(n²)',
      'In-place sorting (O(log n) space)',
      'Not stable (equal elements order may change)',
      'Very cache-friendly',
    ],
    
    useCases: [
      'General-purpose sorting in most applications',
      'When average performance matters more than worst-case',
      'Large datasets (faster than merge in practice)',
      'Memory-constrained environments',
    ],
    
    advantages: [
      'Very efficient average case O(n log n)',
      'In-place sorting - minimal extra space',
      'Cache-friendly (good memory locality)',
      'Practical performance better than theoretical',
      'Works well in practice for most data',
    ],
    
    disadvantages: [
      'Worst-case O(n²) with poor pivot selection',
      'Not stable',
      'Performance depends on pivot selection',
      'Recursive (uses stack space)',
    ],
    
    stepByStep: [
      'Select pivot element',
      'Partition: move elements < pivot left, > pivot right',
      'Recursively sort left partition',
      'Recursively sort right partition',
      'Array is now sorted',
    ],
    
    betterAlternatives: ['Merge Sort for guaranteed performance', 'Heap Sort for worst-case'],
    improvementTips: ['Use random pivot for randomized data', 'Use median-of-three for better pivot', '3-way partition for duplicates'],
  },

  heap: {
    id: 'heap',
    name: 'Heap Sort',
    category: 'Sorting',
    
    definition: 'Heap Sort uses a heap data structure to sort elements. It builds a heap from the array, then repeatedly extracts the maximum element and places it in its final position.',
    
    complexity: {
      time: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)',
      },
      space: 'O(1)',
    },
    
    theory: `
Heap Sort guarantees O(n log n) performance and requires only O(1) extra space, making it ideal for scenarios where you need predictable performance and minimal memory overhead.

How it works:
1. Build max heap from array
2. Swap root (max) with last element
3. Reduce heap size by 1
4. Heapify root
5. Repeat steps 2-4 until heap size is 1

A max heap ensures parent ≥ children. Root always contains maximum.
Building heap takes O(n), extracting elements takes O(n log n).
    `,
    
    characteristics: [
      'Guaranteed O(n log n) in all cases',
      'In-place sorting with O(1) space',
      'Not stable (equal elements may reorder)',
      'Not adaptive',
      'Uses tree structure implicitly in array',
    ],
    
    useCases: [
      'When O(n log n) guarantee is required',
      'Memory-constrained systems',
      'When stability not required',
      'Finding k largest/smallest elements',
    ],
    
    advantages: [
      'Guaranteed O(n log n) performance',
      'In-place and space-efficient',
      'Useful for priority queues',
      'Predictable performance',
    ],
    
    disadvantages: [
      'Slightly slower than Quick Sort in practice',
      'Not stable',
      'Not adaptive to existing order',
      'Less cache-friendly than Quick Sort',
    ],
    
    stepByStep: [
      'Build max heap from unsorted array',
      'Swap root (largest) with last element',
      'Remove last element from heap',
      'Heapify root to maintain heap property',
      'Repeat swap/heapify until heap size 1',
    ],
    
    relatedConcepts: ['Heap data structure', 'Priority queue', 'Binary trees'],
  },

  counting: {
    id: 'counting',
    name: 'Counting Sort',
    category: 'Sorting',
    
    definition: 'Counting Sort is a non-comparative sorting algorithm that counts the frequency of each distinct value and uses this information to place elements in their sorted position.',
    
    complexity: {
      time: 'O(n + k)',
      space: 'O(k)',
    },
    
    theory: `
Counting Sort is a powerful algorithm for sorting integers within a specific range. Instead of comparing elements, it counts occurrences of each value.

How it works:
1. Find max element in array
2. Create count array of size max+1
3. Count frequency of each element
4. Modify count array to contain cumulative counts
5. Build output array by placing elements in order

This algorithm is particularly efficient when the range of input values (k) is small relative to the number of elements (n).

Key insight: If we know count of elements less than each value, we can directly place elements in correct position.
    `,
    
    characteristics: [
      'Non-comparative (doesn\'t compare elements)',
      'Linear time complexity O(n + k)',
      'Stable sort (maintains relative order)',
      'Requires O(k) extra space',
      'Works only for non-negative integers',
    ],
    
    useCases: [
      'Sorting integers within limited range',
      'Sorting strings by character values',
      'RadixSort base algorithm',
      'When range is small relative to array size',
    ],
    
    advantages: [
      'Linear time O(n + k)',
      'Stable sorting algorithm',
      'Efficient for small range of integers',
      'Perfect for specific-range data',
    ],
    
    disadvantages: [
      'Only works for non-negative integers',
      'Requires O(k) extra space',
      'Inefficient if range is much larger than count',
      'Not in-place',
    ],
    
    stepByStep: [
      'Find maximum value in array',
      'Create count array for each value',
      'Count occurrences of each element',
      'Modify count array for cumulative positions',
      'Place each element in sorted position',
    ],
    
    conditions: [
      'Values must be integers (or convertible)',
      'Range should be reasonable (k ≤ some threshold)',
      'Non-negative values',
    ],
  },

  shell: {
    id: 'shell',
    name: 'Shell Sort',
    category: 'Sorting',
    
    definition: 'Shell Sort is an in-place comparison sort that generalizes insertion sort by allowing comparison and exchange of elements that are far apart. It uses a decreasing sequence of gaps.',
    
    complexity: {
      time: {
        best: 'O(n log n)',
        average: 'O(n^(3/2))',
        worst: 'O(n²)',
      },
      space: 'O(1)',
    },
    
    theory: `
Shell Sort improves on Insertion Sort by allowing elements to "jump" over multiple positions, reducing the number of shifts needed.

How it works:
1. Start with a gap sequence (e.g., n/2)
2. Perform gapped insertion sort
3. Elements gap positions apart are sorted
4. Reduce gap (e.g., gap = gap/2)
5. When gap becomes 1, perform final insertion sort
6. Repeat until gap is 1 and array is sorted

The key insight: partially sorted arrays are much faster to insertion sort.

Gap sequences:
- Shell's original: n/2, n/4, ..., 1
- Knuth's: 1, 4, 13, 40, ... (3k+1)
- Sedgewick's: More optimized sequences
    `,
    
    characteristics: [
      'Generalization of Insertion Sort',
      'In-place sorting',
      'Not stable (equal elements may reorder)',
      'Gap sequence dependent performance',
      'Improves Insertion Sort significantly',
    ],
    
    useCases: [
      'Medium-sized datasets',
      'When in-place sorting required',
      'Better than Insertion Sort for medium data',
      'Embedded systems with memory limitations',
    ],
    
    advantages: [
      'Simple to understand and implement',
      'In-place with O(1) extra space',
      'Significantly better than Insertion Sort',
      'No stack space for recursion',
    ],
    
    disadvantages: [
      'Complexity varies with gap sequence',
      'Not stable',
      'Slower than Quick Sort or Merge Sort on large data',
      'Performance hard to analyze',
    ],
    
    stepByStep: [
      'Initialize gap to n/2',
      'Sort elements that are gap apart',
      'Reduce gap (gap = gap/2)',
      'When gap is 1, perform final insertion sort',
      'Array is now sorted',
    ],
    
    gapSequences: [
      'Shell\'s: n/2, n/4, ..., 1',
      'Knuth\'s: 1, 4, 13, 40, 121, ...',
      'Sedgewick\'s: 1, 5, 19, 41, 109, ...',
    ],
  },

  // ============ SEARCHING ALGORITHMS ============

  linear: {
    id: 'linear',
    name: 'Linear Search',
    category: 'Searching',
    
    definition: 'Linear Search is a simple searching algorithm that checks every element in a sequence sequentially until the target is found or the end is reached.',
    
    complexity: {
      time: {
        best: 'O(1)',
        average: 'O(n)',
        worst: 'O(n)',
      },
      space: 'O(1)',
    },
    
    theory: `
Linear Search, also known as Sequential Search, is the most straightforward searching method. It scans through elements one by one until finding a match.

How it works:
1. Start at the first element
2. Compare with target value
3. If match, return index
4. If no match, move to next element
5. Repeat until target found or end reached
6. Return -1 if target not found

No preprocessing needed - works on unsorted or sorted data identically.
    `,
    
    characteristics: [
      'Simple and straightforward',
      'Works on unsorted data',
      'O(n) time in worst case',
      'O(1) space',
      'No preprocessing required',
    ],
    
    useCases: [
      'Small datasets',
      'Unsorted data',
      'When simplicity is prioritized',
      'Linked lists (no random access)',
    ],
    
    advantages: [
      'No preprocessing needed',
      'Works on any data type',
      'Works on unsorted data',
      'Simple to implement',
      'No extra space required',
    ],
    
    disadvantages: [
      'O(n) time - very slow for large datasets',
      'Inefficient compared to binary search on sorted data',
      'Must check every element in worst case',
    ],
    
    stepByStep: [
      'Start at first element (index 0)',
      'Compare current element with target',
      'If match, return current index',
      'Move to next element',
      'Repeat until target found or list ends',
    ],
    
    whenToUse: [
      'Data is unsorted',
      'Dataset is small (< 1000 elements)',
      'Searching rarely performed',
      'Cannot afford sorting overhead',
    ],
    
    betterAlternatives: 'Binary Search for sorted data',
  },

  binary: {
    id: 'binary',
    name: 'Binary Search',
    category: 'Searching',
    
    definition: 'Binary Search is an efficient searching algorithm that eliminates half of remaining elements with each comparison by leveraging the sorted order of data.',
    
    complexity: {
      time: {
        best: 'O(1)',
        average: 'O(log n)',
        worst: 'O(log n)',
      },
      space: 'O(1)',
    },
    
    theory: `
Binary Search is far superior to Linear Search for sorted data, achieving logarithmic time complexity.

How it works:
1. Set left pointer to start, right to end
2. Calculate middle index
3. Compare middle element with target
4. If match, return middle index
5. If target < middle, search left half (right = mid - 1)
6. If target > middle, search right half (left = mid + 1)
7. Repeat until found or pointers cross
8. Return -1 if not found

Each iteration eliminates half the remaining search space. Searching 1 million items takes at most ~20 comparisons.

Precondition: Array must be sorted!
    `,
    
    characteristics: [
      'Requires sorted data (CRITICAL)',
      'O(log n) time complexity',
      'Extremely efficient',
      'Works only with random-access data',
      'Uses divide-and-conquer strategy',
    ],
    
    useCases: [
      'Large sorted datasets',
      'Finding first/last occurrence',
      'Range searching',
      'Database lookups',
      'Finding insertion point',
    ],
    
    advantages: [
      'O(log n) time - extremely efficient',
      'Works on large datasets',
      'Straightforward implementation',
      'O(1) space',
      'Perfect for sorted static data',
    ],
    
    disadvantages: [
      'Data must be sorted',
      'Doesn\'t work on unsorted data',
      'Requires random-access (not linked list)',
      'Insertion/deletion breaks sorted order',
    ],
    
    stepByStep: [
      'Ensure array is sorted',
      'Initialize left = 0, right = n-1',
      'While left ≤ right:',
      '  Calculate mid = (left + right) / 2',
      '  If arr[mid] == target, return mid',
      '  If arr[mid] < target, left = mid + 1',
      '  If arr[mid] > target, right = mid - 1',
      'Return -1 (not found)',
    ],
    
    preconditions: ['Array must be sorted', 'Data must be comparable', 'Random access required'],
    
    variants: [
      'Iterative Binary Search: Using loop',
      'Recursive Binary Search: Using recursion',
      'Binary Search (First Occurrence): Find leftmost match',
      'Binary Search (Last Occurrence): Find rightmost match',
    ],
  },

  // ============ GRAPH ALGORITHMS ============

  bfs: {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    category: 'Graph Traversal',
    
    definition: 'BFS is a graph traversal algorithm that explores vertices level by level, visiting all neighbors of a vertex before moving to the next level.',
    
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
    },
    
    theory: `
BFS explores a graph in "layers" starting from a source vertex. It visits all vertices at distance k before visiting vertices at distance k+1.

How it works:
1. Create queue and visited set
2. Enqueue starting vertex
3. Mark as visited
4. While queue not empty:
   a. Dequeue vertex
   b. Process/visit vertex
   c. For each unvisited neighbor:
      - Mark as visited
      - Enqueue neighbor
5. Continue until all reachable vertices visited

Uses queue (FIFO) data structure to maintain level-order traversal.

Applications:
- Shortest path in unweighted graphs
- Level-order tree traversal
- Social network analysis (degrees of separation)
- Peer-to-peer networks
- Web crawling (explore breadth first)
    `,
    
    characteristics: [
      'Level-by-level exploration',
      'Uses queue (FIFO)',
      'O(V + E) time, O(V) space',
      'Finds shortest path in unweighted graphs',
      'Complete (visits all reachable vertices)',
    ],
    
    useCases: [
      'Finding shortest path (unweighted)',
      'Level-order traversal',
      'Connected components finding',
      'Bipartite graph checking',
      'Social network analysis',
    ],
    
    advantages: [
      'Finds shortest path in unweighted graphs',
      'Complete - guaranteed to find solution',
      'Can detect cycles',
      'Good for exploring neighborhood',
    ],
    
    disadvantages: [
      'More memory than DFS (stores frontier)',
      'Doesn\'t work well for very deep graphs',
      'Requires explicit visited tracking',
    ],
    
    stepByStep: [
      'Initialize queue with start vertex',
      'Mark start as visited',
      'While queue not empty:',
      '  Dequeue vertex',
      '  For each unvisited adjacent vertex:',
      '    Mark as visited',
      '    Enqueue vertex',
    ],
    
    vsAlternative: {
      algorithm: 'DFS',
      advantage: 'Uses less memory than DFS',
      disadvantage: 'DFS uses less memory',
    },
  },

  dfs: {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    category: 'Graph Traversal',
    
    definition: 'DFS is a graph traversal algorithm that explores as far as possible along each branch before backtracking, going deep first.',
    
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
    },
    
    theory: `
DFS explores a graph by going as deep as possible before backtracking. It follows one branch completely before trying alternatives.

How it works:
1. Create stack and visited set
2. Push starting vertex to stack
3. While stack not empty:
   a. Pop vertex
   b. If unvisited:
      - Mark as visited
      - Process vertex
      - Push all unvisited neighbors to stack
4. Continue until stack empty

Can be implemented:
- Iteratively using explicit stack
- Recursively using call stack

Applications:
- Topological sorting
- Cycle detection
- Strongly connected components
- Maze solving
- Parenthesis matching
- Tree traversals (preorder, postorder, inorder)
    `,
    
    characteristics: [
      'Goes deep first before backtracking',
      'Uses stack (LIFO)',
      'O(V + E) time, O(V) space',
      'Can be recursive naturally',
      'Complete (visits all reachable vertices)',
    ],
    
    useCases: [
      'Cycle detection',
      'Topological sorting',
      'Strongly connected components',
      'Maze solving',
      'Parenthesis matching',
    ],
    
    advantages: [
      'Memory efficient (uses less than BFS typically)',
      'Natural recursive implementation',
      'Good for finding connected components',
      'Good for topological sorting',
    ],
    
    disadvantages: [
      'Doesn\'t find shortest path',
      'Can go arbitrarily deep (stack overflow risk)',
      'Less suitable for finding neighbors at distance k',
    ],
    
    stepByStep: [
      'Initialize stack with start vertex',
      'Mark start as visited',
      'While stack not empty:',
      '  Pop vertex from stack',
      '  For each unvisited adjacent vertex:',
      '    Mark as visited',
      '    Push to stack',
    ],
    
    vsAlternative: {
      algorithm: 'BFS',
      advantage: 'Uses less memory than BFS in many cases',
      disadvantage: 'BFS finds shortest path',
    },
  },

  dijkstra: {
    id: 'dijkstra',
    name: 'Dijkstra\'s Algorithm',
    category: 'Shortest Path',
    
    definition: 'Dijkstra\'s Algorithm is a greedy algorithm that finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights.',
    
    complexity: {
      time: 'O((V + E) log V)',
      space: 'O(V)',
    },
    
    theory: `
Dijkstra's Algorithm finds shortest paths using a greedy approach. It builds shortest path tree from source.

How it works:
1. Initialize distances: source = 0, others = ∞
2. Mark all vertices as unvisited
3. While unvisited vertices exist:
   a. Select unvisited vertex with minimum distance
   b. Mark as visited
   c. For each unvisited neighbor:
      - Calculate distance through current vertex
      - If shorter than known distance, update
4. Continue until all vertices visited

Greedy choice: Always process closest unvisited vertex next.

Precondition: All edge weights must be non-negative!

With priority queue: O((V + E) log V) time
    `,
    
    characteristics: [
      'Finds shortest path to all vertices',
      'Greedy algorithm',
      'Requires non-negative weights',
      'Uses priority queue',
      'O((V + E) log V) time',
    ],
    
    useCases: [
      'GPS/Navigation systems',
      'Network routing protocols',
      'Social networks (closest connections)',
      'Robotics (path planning)',
      'Game AI (movement)',
    ],
    
    advantages: [
      'Guaranteed to find shortest path',
      'Works with weighted graphs',
      'Efficient with priority queue',
      'Well-understood and reliable',
    ],
    
    disadvantages: [
      'Cannot handle negative weights',
      'Greedy - doesn\'t always work for all problems',
      'More complex than BFS',
      'Requires priority queue for efficiency',
    ],
    
    stepByStep: [
      'Set source distance to 0, others to ∞',
      'Select smallest distance unvisited vertex',
      'Mark as visited',
      'For each unvisited neighbor:',
      '  Relax edge if shorter path found',
      '  Update distance',
      'Repeat until all visited',
    ],
    
    preconditions: ['All edge weights must be non-negative', 'Graph must be connected'],
    
    limitations: 'Cannot handle negative edge weights - use Bellman-Ford instead',
  },

  astar: {
    id: 'astar',
    name: 'A* Algorithm',
    category: 'Pathfinding',
    
    definition: 'A* is an informed search algorithm that finds the shortest path by using heuristics to guide the search, combining Dijkstra\'s algorithm with heuristic estimation.',
    
    complexity: {
      time: 'O(b^d)',
      space: 'O(b^d)',
    },
    
    theory: `
A* improves on Dijkstra's by using heuristics to guide search toward goal. It evaluates nodes using f(n) = g(n) + h(n):

g(n) = actual cost from start to node n
h(n) = heuristic estimate from node n to goal
f(n) = total estimated cost

How it works:
1. Initialize open set with start node
2. While open set not empty:
   a. Select node with lowest f score
   b. If goal node, reconstruct path
   c. Move to closed set
   d. For each neighbor:
      - If in closed set, skip
      - Calculate g, h, f scores
      - If new path better, update parent
      - Add to open set if not there
3. Return path or "no path"

Heuristic function h(n) is crucial:
- Must be admissible (never overestimate)
- Must be consistent/monotonic
- Affects both speed and optimality

Common heuristics:
- Manhattan distance
- Euclidean distance
- Chebyshev distance
    `,
    
    characteristics: [
      'Informed search (uses heuristics)',
      'Finds optimal path (if heuristic admissible)',
      'More efficient than Dijkstra',
      'Combines best-first with actual cost',
      'Requires good heuristic function',
    ],
    
    useCases: [
      'Game pathfinding',
      'Robot navigation',
      'GPS routing with destination awareness',
      'Puzzle solving',
      'Maze solving with goal',
    ],
    
    advantages: [
      'Very efficient with good heuristic',
      'Finds optimal path',
      'Much faster than Dijkstra for goal search',
      'Flexible - works with different heuristics',
    ],
    
    disadvantages: [
      'Requires domain-specific heuristic function',
      'Bad heuristic makes it slower than Dijkstra',
      'More complex to implement',
      'Memory intensive (open set management)',
    ],
    
    stepByStep: [
      'Calculate f = g + h for start node',
      'Add start to open set',
      'While open set not empty:',
      '  Select node with lowest f score',
      '  If goal, return path',
      '  Move to closed set',
      '  For each neighbor, update if better path',
    ],
    
    heuristicSelection: [
      'Manhattan: |x1-x2| + |y1-y2| (grid-based)',
      'Euclidean: √((x1-x2)² + (y1-y2)²) (Euclidean space)',
      'Chebyshev: max(|x1-x2|, |y1-y2|) (chess king moves)',
    ],
  },

  // ============ TREE ALGORITHMS ============

  binarytree: {
    id: 'binarytree',
    name: 'Binary Tree Traversal',
    category: 'Tree Traversal',
    
    definition: 'Binary Tree Traversal refers to visiting all nodes in a binary tree in a specific order. Common orders are Inorder, Preorder, and Postorder.',
    
    complexity: {
      time: 'O(n)',
      space: 'O(h)',
    },
    
    theory: `
Binary Tree Traversal systematically visits all nodes. Three common Depth-First orders:

Preorder (Root-Left-Right):
- Visit root first
- Traverse left subtree
- Traverse right subtree
- Used for copying tree, getting prefix expression

Inorder (Left-Root-Right):
- Traverse left subtree
- Visit root
- Traverse right subtree
- For BST: gives sorted order!

Postorder (Left-Right-Root):
- Traverse left subtree
- Traverse right subtree
- Visit root
- Used for deletion, getting postfix expression

Level Order (Breadth-First):
- Visit nodes level by level (left to right)
- Uses queue instead of recursion

Each order serves different purposes:
- Preorder: Copying, expression evaluation
- Inorder: BST validation, sorted output
- Postorder: Tree deletion, expression evaluation
    `,
    
    characteristics: [
      'Three main DFS orders: Pre, In, Post',
      'O(n) time to visit all nodes',
      'O(h) space for recursion stack',
      'Breadth-First is Level order',
      'Different orders serve different purposes',
    ],
    
    useCases: [
      'Tree copying and backup',
      'Validating BST properties',
      'Getting sorted output from BST (Inorder)',
      'Evaluating expression trees',
      'Tree deletion',
    ],
    
    advantages: [
      'Multiple orders for different needs',
      'Simple recursive implementation',
      'Space efficient (recursive)',
      'All nodes visited exactly once',
    ],
    
    disadvantages: [
      'Recursive stack space for deep trees',
      'Different orders needed for different tasks',
      'Must understand tree structure',
    ],
    
    traversalOrders: {
      preorder: 'Root → Left → Right',
      inorder: 'Left → Root → Right',
      postorder: 'Left → Right → Root',
      levelorder: 'Level by level, left to right',
    },
    
    applications: {
      preorder: 'Tree copying, prefix expressions',
      inorder: 'BST sorted output, validation',
      postorder: 'Tree deletion, postfix expressions',
      levelorder: 'Level-by-level processing',
    },
  },

  bst: {
    id: 'bst',
    name: 'BST Operations',
    category: 'Tree Operations',
    
    definition: 'Binary Search Tree (BST) is a binary tree where each node\'s left descendants are smaller and right descendants are larger. BST Operations include search, insertion, and deletion.',
    
    complexity: {
      search: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
      insertion: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
      deletion: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
    },
    
    theory: `
Binary Search Tree is an ordered data structure enabling efficient search, insertion, and deletion.

BST Property:
- For any node: all left descendants < node < all right descendants
- Enables binary search-like traversal

Search operation (Target = T):
1. Start at root
2. If node == T, found
3. If T < node, search left subtree
4. If T > node, search right subtree
5. If null reached, not found

Insertion (Value = V):
1. Find correct position using search
2. Create new leaf node
3. Maintain BST property

Deletion (Value = V):
1. Find node to delete
2. Cases:
   a. No children: remove node
   b. One child: replace with child
   c. Two children: find successor (leftmost right child), replace, delete successor

Time complexity depends on tree balance:
- Balanced: O(log n)
- Skewed: O(n) (essentially a linked list)

AVL and Red-Black trees maintain balance automatically.
    `,
    
    characteristics: [
      'Ordered binary tree structure',
      'Enables efficient search',
      'O(log n) average, O(n) worst case',
      'May become unbalanced',
      'In-order traversal gives sorted output',
    ],
    
    useCases: [
      'Database indexing',
      'File systems',
      'Expression evaluation',
      'Autocomplete suggestions',
      'Range searching',
    ],
    
    advantages: [
      'Ordered data structure',
      'Efficient search O(log n) on average',
      'Easy to understand and implement',
      'Supports range queries',
      'Maintains sorted order',
    ],
    
    disadvantages: [
      'Can become unbalanced (skewed)',
      'Worst case O(n) time',
      'No guarantee of balance',
      'Need self-balancing variants for reliability',
    ],
    
    operations: {
      search: 'Find specific value in tree',
      insert: 'Add new value maintaining BST property',
      delete: 'Remove value, maintain structure',
      traverse: 'Visit all nodes in specific order',
    },
    
    improvement: 'Use AVL Tree or Red-Black Tree for guaranteed O(log n) operations',
  },

  maze: {
    id: 'maze',
    name: 'Maze Solver',
    category: 'Pathfinding',
    
    definition: 'Maze Solver is an algorithm that finds a path from start to exit in a maze, avoiding walls and obstacles.',
    
    complexity: {
      time: 'O(rows × cols)',
      space: 'O(rows × cols)',
    },
    
    theory: `
Maze solving combines pathfinding with obstacle avoidance. Common approaches:

Depth-First Search:
- Go deep into maze until stuck
- Backtrack to last junction
- Try another path
- Simple, memory efficient
- May not find shortest path

Breadth-First Search:
- Explore all adjacent cells level by level
- Guarantees shortest path
- More memory usage
- Level-order exploration

A* Algorithm:
- Use heuristic to guide toward goal
- Balance between DFS efficiency and BFS optimality
- Most efficient

Wall Following (Right Hand or Left Hand):
- Keep hand on wall and follow
- Works for simply connected mazes
- Simple but limited

Representation:
- Grid with cells (walkable) and walls
- Start and exit positions
- Visited tracking
    `,
    
    characteristics: [
      'Grid-based pathfinding',
      'Avoids walls and obstacles',
      'Can use BFS, DFS, or A*',
      'Finds path from start to goal',
      'May find shortest or any valid path',
    ],
    
    useCases: [
      'Game mazes',
      'Robot navigation',
      'Vehicle routing',
      'Automatic maze generation solvers',
      'Educational demonstrations',
    ],
    
    advantages: [
      'Multiple algorithm options',
      'Guaranteed to find path if exists',
      'Can visualize search process',
      'Practical, real-world applications',
    ],
    
    disadvantages: [
      'Requires appropriate data structure',
      'Performance depends on algorithm choice',
      'Large mazes need efficient memory',
    ],
    
    algorithmChoices: {
      dfs: 'Simple, memory efficient, not shortest path',
      bfs: 'Guaranteed shortest path, more memory',
      astar: 'Most efficient with heuristic, balanced',
      wallFollowing: 'Simple but limited to certain mazes',
    },
    
    stepByStep: [
      'Mark start position as visited',
      'Use chosen algorithm (BFS/DFS/A*)',
      'Explore adjacent unvisited cells',
      'Avoid walls and obstacles',
      'Track path as you explore',
      'Return path when goal reached',
    ],
  },
}

// Export organized by category
export const ALGORITHM_CATEGORIES = {
  sorting: Object.values(ALGORITHM_THEORY).filter(a => a.category === 'Sorting'),
  searching: Object.values(ALGORITHM_THEORY).filter(a => a.category === 'Searching'),
  graphs: Object.values(ALGORITHM_THEORY).filter(a => a.category === 'Graph Traversal' || a.category === 'Shortest Path'),
  trees: Object.values(ALGORITHM_THEORY).filter(a => a.category === 'Tree Traversal' || a.category === 'Tree Operations'),
  pathfinding: Object.values(ALGORITHM_THEORY).filter(a => a.category === 'Pathfinding'),
}
