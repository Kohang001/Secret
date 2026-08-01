import { useEffect, useRef, useState } from 'react'
import GameShell from '../components/GameShell'

const HOLES = 9
const TIME_LIMIT = 20
const WIN_SCORE = 15

export default function Game10({ done, onBack, onSuccess }) {
  const [status, setStatus] = useState('idle')
  const [activeHole, setActiveHole] = useState(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const moleTimer = useRef(null)
  const clockTimer = useRef(null)

  function start() {
    setScore(0)
    setTimeLeft(TIME_LIMIT)
    setStatus('playing')
  }

  useEffect(() => {
    if (status !== 'playing') return
    function popMole() {
      setActiveHole(Math.floor(Math.random() * HOLES))
      moleTimer.current = setTimeout(popMole, 500 + Math.random() * 500)
    }
    popMole()
    clockTimer.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(clockTimer.current)
          clearTimeout(moleTimer.current)
          setStatus((s) => (s === 'playing' ? 'lost' : s))
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      clearTimeout(moleTimer.current)
      clearInterval(clockTimer.current)
    }
  }, [status])

  function whack(i) {
    if (status !== 'playing' || i !== activeHole) return
    setActiveHole(null)
    setScore((s) => {
      const ns = s + 1
      if (ns >= WIN_SCORE) {
        clearInterval(clockTimer.current)
        clearTimeout(moleTimer.current)
        setStatus('won')
        onSuccess()
      }
      return ns
    })
  }

  return (
    <GameShell gameNumber={10} onBack={onBack} done={done} story={`ตีตัวตุ่นให้ได้ ${WIN_SCORE} ตัว ภายใน ${TIME_LIMIT} วินาที`}>
      <div className="stat-row">
        <span>เวลา: {timeLeft}s</span>
        <span>คะแนน: {score} / {WIN_SCORE}</span>
      </div>
      <div className="game-stage" style={{ width: 400, height: 340 }}>
        {status !== 'playing' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 2, background: 'rgba(11,35,24,0.85)' }}>
            {status === 'lost' && <p className="feedback err">หมดเวลา! ลองใหม่นะ</p>}
            {status === 'won' && <p className="feedback ok">มือไวมาก! ผ่านด่าน</p>}
            <button className="primary-btn" onClick={start}>{status === 'idle' ? 'เริ่มเกม' : 'เล่นอีกครั้ง'}</button>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, padding: 20, height: '100%' }}>
          {Array.from({ length: HOLES }).map((_, i) => (
            <button
              key={i}
              onClick={() => whack(i)}
              style={{
                borderRadius: '50%',
                border: '2px solid var(--line)',
                background: 'radial-gradient(circle at 50% 40%, #0e2318, #071811)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {activeHole === i && (
                <div style={{ position: 'absolute', left: '50%', top: '30%', transform: 'translate(-50%,-50%)', width: '55%', aspectRatio: '1', borderRadius: '50%', background: 'var(--gold)' }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  )
}
