import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar.jsx'
import ControlPanel from './components/ControlPanel.jsx'
import Visualizer from './components/Visualizer.jsx'
import ExplanationPanel from './components/ExplanationPanel.jsx'
import { generateRandomArray, parseInputToArray } from './utils/arrayGenerator.js'
import { sleep } from './utils/animationHelper.js'
import { bubbleSortSteps } from './algorithms/bubbleSort.js'
import { mergeSortSteps } from './algorithms/mergeSort.js'
import { quickSortSteps } from './algorithms/quickSort.js'
import { heapSortSteps } from './algorithms/heapSort.js'
import { linearSearchSteps } from './algorithms/linearSearch.js'
import { binarySearchSteps } from './algorithms/binarySearch.js'

const SPEED_LEVELS = [
  { label: 'Slow', value: 700 },
  { label: 'Medium', value: 360 },
  { label: 'Fast', value: 140 },
  { label: 'Blaze', value: 80 },
]

const ALGORITHMS = {
  bubble: {
    name: 'Bubble Sort',
    type: 'sort',
    getSteps: bubbleSortSteps,
    complexity: {
      best: 'O(n)',
      average: 'O(n^2)',
      worst: 'O(n^2)',
      space: 'O(1)',
    },
  },
  merge: {
    name: 'Merge Sort',
    type: 'sort',
    getSteps: mergeSortSteps,
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)',
    },
  },
  quick: {
    name: 'Quick Sort',
    type: 'sort',
    getSteps: quickSortSteps,
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n^2)',
      space: 'O(log n)',
    },
  },
  heap: {
    name: 'Heap Sort',
    type: 'sort',
    getSteps: heapSortSteps,
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(1)',
    },
  },
  linear: {
    name: 'Linear Search',
    type: 'search',
    getSteps: linearSearchSteps,
    complexity: {
      best: 'O(1)',
      average: 'O(n)',
      worst: 'O(n)',
      space: 'O(1)',
    },
  },
  binary: {
    name: 'Binary Search',
    type: 'search',
    getSteps: binarySearchSteps,
    complexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)',
      space: 'O(1)',
    },
  },
}

const DEFAULT_STEP = 'Ready to visualize. Generate an array to begin.'

function App() {
  const [array, setArray] = useState([])
  const [baseArray, setBaseArray] = useState([])
  const [arraySize, setArraySize] = useState(24)
  const [algorithmKey, setAlgorithmKey] = useState('bubble')
  const [speedLevel, setSpeedLevel] = useState(2)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [steps, setSteps] = useState([])
  const [stepIndex, setStepIndex] = useState(-1)
  const [currentStep, setCurrentStep] = useState(DEFAULT_STEP)
  const [comparingIndices, setComparingIndices] = useState([])
  const [swappingIndices, setSwappingIndices] = useState([])
  const [sortedIndices, setSortedIndices] = useState([])
  const [foundIndex, setFoundIndex] = useState(null)
  const [activeRange, setActiveRange] = useState(null)
  const [customInput, setCustomInput] = useState('')
  const [targetValue, setTargetValue] = useState('')
  const [notice, setNotice] = useState('')

  const pausedRef = useRef(false)
  const stopRef = useRef(false)

  const algorithm = ALGORITHMS[algorithmKey]
  const speed = SPEED_LEVELS[speedLevel]?.value ?? SPEED_LEVELS[1].value

  const maxValue = useMemo(() => {
    if (!array.length) return 1
    return Math.max(...array, 1)
  }, [array])

  useEffect(() => {
    if (isRunning) return
    generateNewArray(arraySize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arraySize])

  useEffect(() => {
    if (isRunning) return
    clearHighlights()
    setSteps([])
    setStepIndex(-1)
    setCurrentStep(DEFAULT_STEP)
    setNotice('')
  }, [algorithmKey, isRunning])

  const clearHighlights = () => {
    setComparingIndices([])
    setSwappingIndices([])
    setSortedIndices([])
    setFoundIndex(null)
    setActiveRange(null)
  }

  const generateNewArray = (size) => {
    const next = generateRandomArray(size, 8, 120)
    setArray(next)
    setBaseArray(next)
    setCustomInput('')
    setNotice('')
    clearHighlights()
    setSteps([])
    setStepIndex(-1)
    setCurrentStep(DEFAULT_STEP)
  }

  const resetToBase = () => {
    stopRef.current = true
    pausedRef.current = false
    setIsPaused(false)
    setIsRunning(false)
    setArray(baseArray)
    clearHighlights()
    setSteps([])
    setStepIndex(-1)
    setCurrentStep(DEFAULT_STEP)
    setNotice('')
  }

  const applyCustomInput = () => {
    if (isRunning) return
    const { array: parsed, error } = parseInputToArray(customInput, 60)
    if (error) {
      setNotice(error)
      return
    }
    if (parsed.length < 2) {
      setNotice('Please enter at least 2 numbers.')
      return
    }
    setNotice('Custom array applied.')
    setArray(parsed)
    setBaseArray(parsed)
    clearHighlights()
    setSteps([])
    setStepIndex(-1)
    setCurrentStep(DEFAULT_STEP)
  }

  const pauseIfNeeded = async () => {
    while (pausedRef.current) {
      if (stopRef.current) return false
      await sleep(80)
    }
    return !stopRef.current
  }

  const applyStep = (step) => {
    setCurrentStep(step.description)
    setComparingIndices([])
    setSwappingIndices([])
    if (step.type === 'range') {
      setActiveRange(step.indices)
    }

    if (step.type === 'compare') {
      setComparingIndices(step.indices)
      return
    }
    if (step.type === 'swap') {
      setSwappingIndices(step.indices)
      setArray((prev) => {
        const next = [...prev]
        const [first, second] = step.indices
        const temp = next[first]
        next[first] = next[second]
        next[second] = temp
        return next
      })
      return
    }
    if (step.type === 'overwrite') {
      setSwappingIndices(step.indices)
      setArray((prev) => {
        const next = [...prev]
        next[step.indices[0]] = step.value
        return next
      })
      return
    }
    if (step.type === 'markSorted') {
      setSortedIndices((prev) => {
        const merged = new Set(prev)
        step.indices.forEach((index) => merged.add(index))
        return Array.from(merged)
      })
      return
    }
    if (step.type === 'markFound') {
      const nextIndex = step.indices[0]
      setFoundIndex(nextIndex >= 0 ? nextIndex : null)
      return
    }
  }

  const runSteps = async (stepList, type, length) => {
    for (let i = 0; i < stepList.length; i += 1) {
      if (stopRef.current) break
      const canContinue = await pauseIfNeeded()
      if (!canContinue) break

      const step = stepList[i]
      setStepIndex(i)
      applyStep(step)
      await sleep(speed)
    }

    if (!stopRef.current && type === 'sort') {
      setSortedIndices(Array.from({ length }, (_, index) => index))
      setCurrentStep('Sorted! Explore the steps or try a new algorithm.')
    }
    if (!stopRef.current && type === 'search') {
      setCurrentStep('Search completed. Adjust the target or regenerate data.')
    }
    if (!stopRef.current) {
      setIsRunning(false)
      setIsPaused(false)
      pausedRef.current = false
    }
  }

  const handleStart = async () => {
    if (isRunning) return
    if (algorithm.type === 'search') {
      if (targetValue.trim() === '') {
        setNotice('Enter a target value to search for.')
        return
      }
      if (Number.isNaN(Number(targetValue))) {
        setNotice('Target value must be a number.')
        return
      }
    }
    setNotice('')
    stopRef.current = false
    pausedRef.current = false
    setIsPaused(false)
    setIsRunning(true)
    clearHighlights()
    setStepIndex(-1)

    const workingArray =
      algorithmKey === 'binary'
        ? [...array].sort((a, b) => a - b)
        : [...array]

    if (algorithmKey === 'binary') {
      setArray(workingArray)
      setBaseArray(workingArray)
      setNotice('Binary search requires a sorted array. Sorted for you.')
    }

    const target = Number(targetValue)
    const { steps: nextSteps } = algorithm.getSteps(workingArray, target)
    setSteps(nextSteps)
    setCurrentStep('Algorithm running...')
    await runSteps(nextSteps, algorithm.type, workingArray.length)
  }

  const handlePauseToggle = () => {
    if (!isRunning) return
    const next = !isPaused
    setIsPaused(next)
    pausedRef.current = next
  }

  return (
    <div className="app">
      <Navbar title="AlgoVista" subtitle="Interactive DSA Algorithm Visualizer" />
      <main className="layout">
        <section className="panel control">
          <ControlPanel
            algorithms={ALGORITHMS}
            algorithmKey={algorithmKey}
            setAlgorithmKey={setAlgorithmKey}
            arraySize={arraySize}
            setArraySize={setArraySize}
            onGenerate={() => generateNewArray(arraySize)}
            onReset={resetToBase}
            onStart={handleStart}
            onPause={handlePauseToggle}
            isRunning={isRunning}
            isPaused={isPaused}
            speedLevel={speedLevel}
            setSpeedLevel={setSpeedLevel}
            speedLabel={SPEED_LEVELS[speedLevel]?.label}
            customInput={customInput}
            setCustomInput={setCustomInput}
            onApplyInput={applyCustomInput}
            targetValue={targetValue}
            setTargetValue={setTargetValue}
            algorithmInfo={algorithm}
            notice={notice}
          />
        </section>
        <section className="panel visual">
          <Visualizer
            array={array}
            maxValue={maxValue}
            comparingIndices={comparingIndices}
            swappingIndices={swappingIndices}
            sortedIndices={sortedIndices}
            foundIndex={foundIndex}
            activeRange={activeRange}
            isRunning={isRunning}
          />
        </section>
        <section className="panel explain">
          <ExplanationPanel
            steps={steps}
            currentStep={currentStep}
            stepIndex={stepIndex}
          />
        </section>
      </main>
    </div>
  )
}

export default App
