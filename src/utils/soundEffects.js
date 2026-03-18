const BASE_FREQUENCIES = {
  COMPARE: 460,
  SWAP: 280,
  OVERWRITE: 360,
  SORTED: 660,
  FOUND: 760,
  DONE: 820,
  RANGE: 420,
  POINTER_MOVE: 500,
  VISIT: 620,
  ENQUEUE: 540,
  DEQUEUE: 340,
  BACKTRACK: 300,
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function createSoundEngine() {
  let context = null
  let masterGain = null
  let currentVolume = 0.35
  let lastSoundAt = 0

  const ensureContext = () => {
    if (typeof window === 'undefined') return null
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null

    if (!context) {
      context = new AudioCtx()
      masterGain = context.createGain()
      masterGain.gain.value = currentVolume
      masterGain.connect(context.destination)
    }

    if (context.state === 'suspended') {
      context.resume().catch(() => {})
    }

    return context
  }

  const triggerTone = ({ frequency, duration = 0.08, volume = 1, type = 'sine' }) => {
    const ctx = ensureContext()
    if (!ctx || !masterGain) return

    const now = ctx.currentTime
    const oscillator = ctx.createOscillator()
    const envelope = ctx.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, now)

    envelope.gain.setValueAtTime(0.0001, now)
    envelope.gain.exponentialRampToValueAtTime(clamp(volume, 0.05, 1), now + 0.01)
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    oscillator.connect(envelope)
    envelope.connect(masterGain)
    oscillator.start(now)
    oscillator.stop(now + duration + 0.02)
  }

  const playStepSound = (stepType, opts = {}) => {
    const now = performance.now()
    if (now - lastSoundAt < 45) return
    lastSoundAt = now

    const frequency = BASE_FREQUENCIES[stepType] ?? 440
    const emphasis = clamp(opts.emphasis ?? 1, 0.6, 1.4)

    if (stepType === 'FOUND' || stepType === 'DONE' || stepType === 'SORTED') {
      triggerTone({ frequency, duration: 0.07, volume: 0.7 * emphasis, type: 'triangle' })
      triggerTone({ frequency: frequency * 1.24, duration: 0.1, volume: 0.45 * emphasis, type: 'triangle' })
      return
    }

    if (stepType === 'SWAP' || stepType === 'OVERWRITE') {
      triggerTone({ frequency, duration: 0.06, volume: 0.65 * emphasis, type: 'square' })
      triggerTone({ frequency: frequency * 0.78, duration: 0.045, volume: 0.4 * emphasis, type: 'square' })
      return
    }

    triggerTone({ frequency, duration: 0.055, volume: 0.45 * emphasis, type: 'sine' })
  }

  const playUiSound = (kind) => {
    if (kind === 'play') {
      triggerTone({ frequency: 640, duration: 0.05, volume: 0.55, type: 'triangle' })
      triggerTone({ frequency: 820, duration: 0.07, volume: 0.45, type: 'triangle' })
      return
    }

    if (kind === 'pause') {
      triggerTone({ frequency: 410, duration: 0.08, volume: 0.35, type: 'sine' })
      return
    }

    triggerTone({ frequency: 520, duration: 0.04, volume: 0.3, type: 'sine' })
  }

  const setVolume = (nextVolume) => {
    currentVolume = clamp(nextVolume, 0, 1)
    if (masterGain && context) {
      masterGain.gain.setTargetAtTime(currentVolume, context.currentTime, 0.015)
    }
  }

  const dispose = () => {
    if (context) {
      context.close().catch(() => {})
      context = null
      masterGain = null
    }
  }

  return {
    playStepSound,
    playUiSound,
    setVolume,
    dispose,
  }
}
