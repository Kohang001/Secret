import { useEffect, useRef, useState } from 'react'
import GameShell from '../components/GameShell'

const TIME_LIMIT = 20
const TARGET_HITS = 35
const STAGE_W = 460
const STAGE_H = 340

function randomCircle() {
  const size = 26 + Math.random() * 34 // 26-60px
  const x = Math.random() * (STAGE_W - size)
  const y = Math.random() * (STAGE_H - size)
  return { size, x, y, id: Math.random() }
}

export default function Game1({ done, onBack, onSuccess }) {
  const [phase, setPhase] = useState('idle') // idle | playing | won | lost
  const [hits, setHits] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [circle, setCircle] = useState(null)
  const timerRef = useRef(null)

  function start() {
    setHits(0)
    setTimeLeft(TIME_LIMIT)
    setCircle(randomCircle())
    setPhase('playing')
  }

  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setPhase('lost')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  useEffect(() => {
    if (hits >= TARGET_HITS && phase === 'playing') {
      clearInterval(timerRef.current)
      setPhase('won')
      onSuccess()
    }
  }, [hits, phase])

  function hitCircle() {
    setHits((h) => h + 1)
    setCircle(randomCircle())
  }

  function missStage() {
    if (phase !== 'playing') return
    clearInterval(timerRef.current)
    setPhase('lost')
  }

  return (
    <GameShell
      gameNumber={1}
      onBack={onBack}
      done={done}
      story={`เกมแบบ Aim Lab: กดวงกลมที่ปรากฏบนจอให้ทันภายใน ${TIME_LIMIT} วินาที ต้องกดโดนอย่างน้อย ${TARGET_HITS} วง ถ้ากดพลาดพื้นที่ว่าง ต้องเริ่มใหม่ทันที!`}
    >
      <div className="stat-row">
        <span>เวลา: {timeLeft}s</span>
        <span>โดนแล้ว: {hits} / {TARGET_HITS}</span>
      </div>

      <div
        className="game-stage"
        style={{ width: STAGE_W, height: STAGE_H }}
        onClick={missStage}
      >
        {phase === 'playing' && circle && (
          <div
            onClick={(e) => {
              e.stopPropagation()
              hitCircle()
            }}
            style={{
              position: 'absolute',
              left: circle.x,
              top: circle.y,
              width: circle.size,
              height: circle.size,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #d9f0da, #9fd6aa)',
              boxShadow: '0 0 14px rgba(159,214,170,0.65)',
              cursor: 'crosshair',
            }}
          />
        )}
        {phase !== 'playing' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
            {phase === 'lost' && <p className="feedback err">พลาด! เริ่มใหม่อีกครั้งนะ</p>}
            {phase === 'won' && <p className="feedback ok">สำเร็จ!</p>}
            <button className="primary-btn" onClick={start}>
              {phase === 'idle' ? 'เริ่มเกม' : 'เล่นอีกครั้ง'}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  )
}
