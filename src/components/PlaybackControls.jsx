function PlaybackControls({
  stepIndex,
  totalSteps,
  isPlaying,
  onPlay,
  onPause,
  onPrev,
  onNext,
  onRewind,
  onForward,
  onScrub,
  speed,
  onSpeedChange,
}) {
  const progress = totalSteps > 1 ? (stepIndex / (totalSteps - 1)) * 100 : 0
  const hasSteps = totalSteps > 0

  return (
    <div className="playback">
      {/* Timeline scrub bar */}
      <div className="playback-timeline">
        <span className="playback-time">{hasSteps ? stepIndex + 1 : 0}</span>
        <div className="timeline-track">
          <div className="timeline-fill" style={{ width: `${progress}%` }} />
          <input
            type="range"
            className="timeline-input"
            min="0"
            max={Math.max(0, totalSteps - 1)}
            value={stepIndex < 0 ? 0 : stepIndex}
            disabled={!hasSteps}
            onChange={(e) => onScrub(Number(e.target.value))}
          />
        </div>
        <span className="playback-time">{totalSteps}</span>
      </div>

      {/* Controls row */}
      <div className="playback-controls">
        <button type="button" className="pb-btn" onClick={onRewind} disabled={!hasSteps} title="Rewind to start">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
          </svg>
        </button>
        <button type="button" className="pb-btn" onClick={onPrev} disabled={!hasSteps || stepIndex <= 0} title="Previous step">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
          </svg>
        </button>

        <button
          type="button"
          className="pb-btn pb-play"
          onClick={isPlaying ? onPause : onPlay}
          disabled={!hasSteps}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button type="button" className="pb-btn" onClick={onNext} disabled={!hasSteps || stepIndex >= totalSteps - 1} title="Next step">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 3.9V8.1z" />
          </svg>
        </button>
        <button type="button" className="pb-btn" onClick={onForward} disabled={!hasSteps} title="Jump to end">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 3.9V8.1zM16 6h2v12h-2z" />
          </svg>
        </button>

        <div className="pb-speed">
          <span className="pb-speed-label">Speed</span>
          <input
            type="range" min="0" max="3" step="1"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="pb-speed-slider"
          />
          <span className="pb-speed-val">{['Slow','Med','Fast','Blaze'][speed]}</span>
        </div>
      </div>
    </div>
  )
}

export default PlaybackControls
