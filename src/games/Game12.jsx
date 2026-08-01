import { useEffect, useRef, useState } from 'react'
import GameShell from '../components/GameShell'

const STAGE_W = 420
const STAGE_H = 340
const BASKET_W = 88
const WIN_SCORE = 10
const MAX_MISS = 7
const HEART_SIZE = 24

export default function Game12({ done, onBack, onSuccess }) {
  const [status, setStatus] = useState('idle')
  const [basketX, setBasketX] = useState(STAGE_W / 2 - BASKET_W / 2)
  const [score, setScore] = useState(0)
  const [miss, setMiss] = useState(0)
  const items = useRef([])
  const basketXRef = useRef(STAGE_W / 2 - BASKET_W / 2)
  const [, forceRender] = useState(0)
  const loopRef = useRef(null)

  function start() {
    items.current = []
    basketXRef.current = STAGE_W / 2 - BASKET_W / 2
    setBasketX(basketXRef.current)
    setScore(0)
    setMiss(0)
    setStatus('playing')
  }

  function onMove(e) {
    if (status !== 'playing') return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - BASKET_W / 2
    const nextX = Math.max(0, Math.min(STAGE_W - BASKET_W, x))
    basketXRef.current = nextX
    setBasketX(nextX)
  }

  useEffect(() => {
    if (status !== 'playing') return
    loopRef.current = setInterval(() => {
      if (Math.random() < 0.04) {
        items.current.push({
          x: Math.random() * (STAGE_W - HEART_SIZE),
          y: -20,
          id: Math.random(),
          speed: 1.15 + Math.random() * 1.15,
        })
      }

      const currentBasketX = basketXRef.current

      items.current = items.current
        .map((it) => ({ ...it, y: it.y + it.speed }))
        .filter((it) => {
          const itemCenter = it.x + HEART_SIZE / 2
          const catchLeft = currentBasketX - 12
          const catchRight = currentBasketX + BASKET_W + 12

          if (it.y >= STAGE_H - 36 && it.y <= STAGE_H - 8 && itemCenter >= catchLeft && itemCenter <= catchRight) {
            setScore((s) => {
              const ns = s + 1
              if (ns >= WIN_SCORE) {
                clearInterval(loopRef.current)
                setStatus('won')
                onSuccess()
              }
              return ns
            })
            return false
          }

          if (it.y > STAGE_H) {
            setMiss((m) => {
              const nm = m + 1
              if (nm >= MAX_MISS) {
                clearInterval(loopRef.current)
                setStatus('lost')
              }
              return nm
            })
            return false
          }

          return true
        })

      forceRender((n) => n + 1)
    }, 35)

    return () => clearInterval(loopRef.current)
  }, [status])

  return (
    <GameShell gameNumber={12} onBack={onBack} done={done} story={`ขยับตะกร้าด้วยเมาส์ รับหัวใจที่ตกลงมาให้ได้ ${WIN_SCORE} ดวง พลาดได้ไม่เกิน ${MAX_MISS} ครั้ง (ตอนนี้เล่นง่ายขึ้นและไม่กระตุก)`}>
      <div className="stat-row">
        <span>คะแนน: {score} / {WIN_SCORE}</span>
        <span>พลาด: {miss} / {MAX_MISS}</span>
      </div>
      <div className="game-stage" style={{ width: STAGE_W, height: STAGE_H }} onMouseMove={onMove}>
        {items.current.map((it) => (
          <div key={it.id} style={{ position: 'absolute', left: it.x, top: it.y, fontSize: 20 }}>💚</div>
        ))}
        <div style={{ position: 'absolute', left: basketX, bottom: 6, width: BASKET_W, height: 20, background: 'var(--gold)', borderRadius: 8 }} />
        {status !== 'playing' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: 'rgba(11,35,24,0.75)' }}>
            {status === 'lost' && <p className="feedback err">พลาดเยอะไปหน่อย ลองใหม่นะ</p>}
            {status === 'won' && <p className="feedback ok">รับได้หมด! ผ่านด่าน</p>}
            <button className="primary-btn" onClick={start}>{status === 'idle' ? 'เริ่มเกม' : 'เล่นอีกครั้ง'}</button>
          </div>
        )}
      </div>
    </GameShell>
  )
}
