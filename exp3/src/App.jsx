import { useState, useEffect, useRef } from 'react'
import './App.css'

const MODES = {
  work: { label: 'Focus', duration: 25 * 60, color: '#e94560' },
  break: { label: 'Short Break', duration: 5 * 60, color: '#0f9b6b' },
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

function App() {
  const [mode, setMode] = useState('work')
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef(null)

  const currentMode = MODES[mode]
  const totalDuration = currentMode.duration
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            if (mode === 'work') setSessions((s) => s + 1)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, mode])

  useEffect(() => {
    document.title = `${formatTime(timeLeft)} — ${currentMode.label}`
  }, [timeLeft, currentMode.label])

  function switchMode(newMode) {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(MODES[newMode].duration)
  }

  function handleReset() {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setTimeLeft(currentMode.duration)
  }

  return (
    <div className="app">
      <h1 className="title">Pomodoro Timer</h1>

      <div className="mode-tabs">
        {Object.entries(MODES).map(([key, val]) => (
          <button
            key={key}
            className={`tab-btn ${mode === key ? 'active' : ''}`}
            style={mode === key ? { '--tab-color': val.color } : {}}
            onClick={() => switchMode(key)}
          >
            {val.label}
          </button>
        ))}
      </div>

      <div className="timer-ring-wrapper">
        <svg className="ring" viewBox="0 0 280 280">
          <circle
            className="ring-track"
            cx="140" cy="140" r="120"
            fill="none" strokeWidth="10"
          />
          <circle
            className="ring-progress"
            cx="140" cy="140" r="120"
            fill="none" strokeWidth="10"
            stroke={currentMode.color}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 140 140)"
            style={{ transition: isRunning ? 'stroke-dashoffset 1s linear' : 'none' }}
          />
        </svg>
        <div className="timer-display">
          <span className="time" style={{ color: currentMode.color }}>
            {formatTime(timeLeft)}
          </span>
          <span className="mode-label">{currentMode.label}</span>
        </div>
      </div>

      <div className="controls">
        <button className="ctrl-btn reset-btn" onClick={handleReset} title="Reset">
          ↺
        </button>
        <button
          className="ctrl-btn play-btn"
          style={{ background: currentMode.color }}
          onClick={() => setIsRunning((r) => !r)}
        >
          {isRunning ? '❚❚' : '▶'}
        </button>
        <button
          className="ctrl-btn skip-btn"
          onClick={() => switchMode(mode === 'work' ? 'break' : 'work')}
          title="Skip"
        >
          ⏭
        </button>
      </div>

      <div className="sessions">
        <span>Sessions completed:</span>
        <span className="session-count">{sessions}</span>
      </div>
    </div>
  )
}

export default App
