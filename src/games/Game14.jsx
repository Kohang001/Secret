import { useEffect, useState } from 'react'
import GameShell from '../components/GameShell'

const PALETTE = ['#9fd6aa', '#e9c9b0', '#a8cfe1', '#f0bfd8', '#c7d6ad', '#cbc2e1']
const WIN_SCORE = 12
const TIME_LIMIT = 20

function randomRound() {
  const shuffled = [...PALETTE].sort(() => Math.random() - 0.5).slice(0, 4)
  const target = shuffled[Math.floor(Math.random() * shuffled.length)]
  return { target, options: shuffled }
}

export default function Game14({ done, onBack, onSuccess }) {
  const [status, setStatus] = useState('idle')
  const [round, setRound] = useState(randomRound())
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)

  function start() {
    setScore(0)
    setTimeLeft(TIME_LIMIT)
    setRound(randomRound())
    setStatus('playing')
  }

  useEffect(() => {
    if (status !== 'playing') return
    const t = setInterval(() => {
      setTimeLeft((v) => {
        if (v <= 1) {
          clearInterval(t)
          setStatus('lost')
          return 0
        }
        return v - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [status])

  function pick(color) {
    if (status !== 'playing') return
    if (color === round.target) {
      setScore((s) => {
        const ns = s + 1
        if (ns >= WIN_SCORE) {
          setStatus('won')
          onSuccess()
        }
        return ns
      })
      setRound(randomRound())
    } else {
      setScore((s) => Math.max(0, s - 1))
    }
  }

  return (
    <GameShell gameNumber={14} onBack={onBack} done={done} story={`คลิกปุ่มสีให้ตรงกับสีตัวอย่างด้านบนให้เร็วที่สุด ทำให้ได้ ${WIN_SCORE} แต้ม ภายใน ${TIME_LIMIT} วินาที (ตอบผิดโดนหักแต้ม)`}>
      <div className="stat-row">
        <span>เวลา: {timeLeft}s</span>
        <span>คะแนน: {score} / {WIN_SCORE}</span>
      </div>
      {status === 'playing' && (
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}>จับคู่สีนี้:</p>
          <div style={{ width: 60, height: 60, borderRadius: 12, background: round.target, margin: '0 auto', boxShadow: `0 0 20px ${round.target}` }} />
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, maxWidth: 320 }}>
        {(status === 'playing' ? round.options : PALETTE.slice(0, 4)).map((c) => (
          <button
            key={c}
            onClick={() => pick(c)}
            disabled={status !== 'playing'}
            style={{ aspectRatio: '1', borderRadius: 10, background: c, border: '1px solid var(--line)' }}
          />
        ))}
      </div>
      {status !== 'playing' && (
        <div style={{ marginTop: 16 }}>
          {status === 'lost' && <p className="feedback err">หมดเวลา! ลองใหม่นะ</p>}
          {status === 'won' && <p className="feedback ok">ไวมาก! ผ่านด่าน</p>}
          <button className="primary-btn" onClick={start}>{status === 'idle' ? 'เริ่มเกม' : 'เล่นอีกครั้ง'}</button>
        </div>
      )}
    </GameShell>
  )
}
