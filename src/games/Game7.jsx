import { useEffect, useRef, useState } from 'react'
import GameShell from '../components/GameShell'

const GRID = 15
const CELL = 24
const WIN_SCORE = 8

function randomFood(snake) {
  let pos
  do {
    pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y))
  return pos
}

export default function Game7({ done, onBack, onSuccess }) {
  const [snake, setSnake] = useState([{ x: 7, y: 7 }])
  const [food, setFood] = useState({ x: 4, y: 4 })
  const [dir, setDir] = useState({ x: 1, y: 0 })
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState('idle') // idle | playing | won | lost
  const dirRef = useRef(dir)
  dirRef.current = dir

  function start() {
    setSnake([{ x: 7, y: 7 }])
    setFood(randomFood([{ x: 7, y: 7 }]))
    setDir({ x: 1, y: 0 })
    setScore(0)
    setStatus('playing')
    setRunning(true)
  }

  useEffect(() => {
    function onKey(e) {
      const map = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      }
      const nd = map[e.key]
      if (!nd) return
      const cur = dirRef.current
      if (nd.x === -cur.x && nd.y === -cur.y) return // ห้ามหันกลับหลังทันที
      setDir(nd)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!running) return
    const t = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y }
        if (
          head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID ||
          prev.some((s) => s.x === head.x && s.y === head.y)
        ) {
          setRunning(false)
          setStatus('lost')
          return prev
        }
        const ateFood = head.x === food.x && head.y === food.y
        const nextSnake = [head, ...prev]
        if (!ateFood) nextSnake.pop()
        else {
          setScore((s) => {
            const ns = s + 1
            if (ns >= WIN_SCORE) {
              setRunning(false)
              setStatus('won')
              onSuccess()
            }
            return ns
          })
          setFood(randomFood(nextSnake))
        }
        return nextSnake
      })
    }, 150)
    return () => clearInterval(t)
  }, [running, food])

  return (
    <GameShell gameNumber={7} onBack={onBack} done={done} story={`บังคับงูด้วยลูกศร (หรือ WASD) กินอาหารให้ได้ ${WIN_SCORE} ชิ้นโดยไม่ชนกำแพงหรือตัวเอง`}>
      <div className="stat-row"><span>คะแนน: {score} / {WIN_SCORE}</span></div>
      <div
        className="game-stage"
        style={{ width: GRID * CELL, height: GRID * CELL }}
      >
        {status !== 'playing' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 2, background: 'rgba(11,35,24,0.85)' }}>
            {status === 'lost' && <p className="feedback err">ชนแล้ว! ลองใหม่นะ</p>}
            {status === 'won' && <p className="feedback ok">เก่งมาก! ผ่านด่าน</p>}
            <button className="primary-btn" onClick={start}>{status === 'idle' ? 'เริ่มเกม' : 'เล่นอีกครั้ง'}</button>
          </div>
        )}
        {snake.map((s, i) => (
          <div key={i} style={{ position: 'absolute', left: s.x * CELL, top: s.y * CELL, width: CELL - 2, height: CELL - 2, background: i === 0 ? 'var(--signal)' : 'var(--signal-dim)', borderRadius: 4 }} />
        ))}
        <div style={{ position: 'absolute', left: food.x * CELL, top: food.y * CELL, width: CELL - 2, height: CELL - 2, background: 'var(--gold)', borderRadius: '50%' }} />
      </div>
    </GameShell>
  )
}
