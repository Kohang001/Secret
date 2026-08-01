import { useEffect, useRef, useState } from 'react'
import GameShell from '../components/GameShell'

const STAGE_W = 460
const STAGE_H = 220
const GROUND_Y = STAGE_H - 40
const DINO_SIZE = 30
const WIN_SCORE = 10

export default function Game8({ done, onBack, onSuccess }) {
  const [status, setStatus] = useState('idle')
  const [score, setScore] = useState(0)
  const dinoY = useRef(GROUND_Y)
  const velocity = useRef(0)
  const obstacles = useRef([])
  const [, forceRender] = useState(0)
  const loopRef = useRef(null)
  const speedRef = useRef(4)

  function start() {
    dinoY.current = GROUND_Y
    velocity.current = 0
    obstacles.current = [{ x: STAGE_W, passed: false }]
    speedRef.current = 4
    setScore(0)
    setStatus('playing')
  }

  function jump() {
    if (status !== 'playing') return
    if (dinoY.current >= GROUND_Y - 1) velocity.current = -11
  }

  useEffect(() => {
    function onKey(e) {
      if (e.code === 'Space' || e.key === 'ArrowUp') jump()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [status])

  useEffect(() => {
    if (status !== 'playing') return
    loopRef.current = setInterval(() => {
      // physics
      velocity.current += 0.7
      dinoY.current = Math.min(GROUND_Y, dinoY.current + velocity.current)

      // move obstacles
      obstacles.current = obstacles.current
        .map((o) => ({ ...o, x: o.x - speedRef.current }))
        .filter((o) => o.x > -30)

      if (obstacles.current.length === 0 || obstacles.current[obstacles.current.length - 1].x < STAGE_W - 220) {
        obstacles.current.push({ x: STAGE_W, passed: false })
      }

      // collision + scoring
      let collided = false
      obstacles.current.forEach((o) => {
        const dinoX = 60
        if (!o.passed && o.x < dinoX) {
          o.passed = true
          setScore((s) => {
            const ns = s + 1
            speedRef.current = Math.min(9, 4 + ns * 0.4)
            if (ns >= WIN_SCORE) {
              clearInterval(loopRef.current)
              setStatus('won')
              onSuccess()
            }
            return ns
          })
        }
        const obstacleTop = GROUND_Y + DINO_SIZE - 26
        const overlapX = o.x < dinoX + DINO_SIZE && o.x + 18 > dinoX
        const overlapY = dinoY.current + DINO_SIZE > obstacleTop
        if (overlapX && overlapY) collided = true
      })

      if (collided) {
        clearInterval(loopRef.current)
        setStatus('lost')
      }

      forceRender((n) => n + 1)
    }, 30)
    return () => clearInterval(loopRef.current)
  }, [status])

  return (
    <GameShell gameNumber={8} onBack={onBack} done={done} story={`กด Space หรือคลิกเพื่อกระโดดข้ามกระบองเพชร ผ่านให้ได้ ${WIN_SCORE} อัน`}>
      <div className="stat-row"><span>คะแนน: {score} / {WIN_SCORE}</span></div>
      <div className="game-stage" style={{ width: STAGE_W, height: STAGE_H }} onClick={jump}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: GROUND_Y + DINO_SIZE, height: 2, background: 'var(--line)' }} />
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: dinoY.current,
            width: DINO_SIZE,
            height: DINO_SIZE,
            background: 'var(--signal)',
            borderRadius: 6,
          }}
        />
        {obstacles.current.map((o, i) => (
          <div key={i} style={{ position: 'absolute', left: o.x, top: GROUND_Y + DINO_SIZE - 26, width: 16, height: 26, background: 'var(--gold)', borderRadius: 3 }} />
        ))}
        {status !== 'playing' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: 'rgba(11,35,24,0.85)' }}>
            {status === 'lost' && <p className="feedback err">ชนกระบองเพชร! ลองใหม่นะ</p>}
            {status === 'won' && <p className="feedback ok">เก่งมาก! ผ่านด่าน</p>}
            <button className="primary-btn" onClick={start}>{status === 'idle' ? 'เริ่มเกม' : 'เล่นอีกครั้ง'}</button>
          </div>
        )}
      </div>
    </GameShell>
  )
}
