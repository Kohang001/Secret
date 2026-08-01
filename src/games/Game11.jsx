import { useEffect, useRef, useState } from 'react'
import GameShell from '../components/GameShell'

const COLORS = [
  { id: 0, name: 'เขียว', color: '#9fd6aa' },
  { id: 1, name: 'ทอง', color: '#e9c9b0' },
  { id: 2, name: 'ฟ้า', color: '#a8cfe1' },
  { id: 3, name: 'ชมพู', color: '#f0bfd8' },
]
const FLASH_MS = 420
const STEP_MS = 820
const WIN_ROUND = 5

export default function Game11({ done, onBack, onSuccess }) {
  const [sequence, setSequence] = useState([])
  const [playerIdx, setPlayerIdx] = useState(0)
  const [status, setStatus] = useState('idle') // idle | showing | input | won | lost
  const [litUp, setLitUp] = useState(null)
  const timeoutsRef = useRef([])

  function clearTimeouts() {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  function start() {
    clearTimeouts()
    const first = Array.from({ length: 2 }, () => Math.floor(Math.random() * 4))
    setSequence(first)
    setPlayerIdx(0)
    setStatus('showing')
  }

  function playSequence(seq) {
    clearTimeouts()
    setLitUp(null)

    seq.forEach((c, i) => {
      timeoutsRef.current.push(
        setTimeout(() => {
          setLitUp(c)
          timeoutsRef.current.push(setTimeout(() => setLitUp(null), FLASH_MS))
        }, i * STEP_MS)
      )
    })

    timeoutsRef.current.push(
      setTimeout(() => {
        setStatus('input')
        setPlayerIdx(0)
      }, seq.length * STEP_MS + FLASH_MS)
    )
  }

  useEffect(() => {
    if (status === 'showing') playSequence(sequence)
    return () => clearTimeouts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sequence])

  function press(id) {
    if (status !== 'input') return
    setLitUp(id)
    setTimeout(() => setLitUp(null), 200)
    if (id !== sequence[playerIdx]) {
      setStatus('lost')
      return
    }
    if (playerIdx + 1 === sequence.length) {
      if (sequence.length >= WIN_ROUND) {
        setStatus('won')
        onSuccess()
        return
      }
      const next = [...sequence, Math.floor(Math.random() * 4)]
      setTimeout(() => {
        setSequence(next)
        setStatus('showing')
      }, 600)
    } else {
      setPlayerIdx((p) => p + 1)
    }
  }

  return (
    <GameShell gameNumber={11} onBack={onBack} done={done} story={`จำจังหวะสีที่กระพริบ แล้วกดตามลำดับให้ถูกต้อง จนครบรอบที่ ${WIN_ROUND}`}>
      <p className="stat-row">
        {status === 'showing' && 'ดูจังหวะให้ดี...'}
        {status === 'input' && `ตาคุณ (รอบที่ ${sequence.length})`}
        {status === 'idle' && 'พร้อมเริ่มหรือยัง?'}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 260 }}>
        {COLORS.map((c) => (
          <button
            key={c.id}
            onClick={() => press(c.id)}
            style={{
              aspectRatio: '1',
              borderRadius: 14,
              border: '2px solid var(--line)',
              background: c.color,
              opacity: litUp === c.id ? 1 : 0.45,
              boxShadow: litUp === c.id ? `0 0 24px ${c.color}` : 'none',
              transition: 'opacity .1s, box-shadow .1s',
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: 18 }}>
        {status !== 'showing' && status !== 'input' && (
          <button className="primary-btn" onClick={start}>
            {status === 'idle' ? 'เริ่มเกม' : 'เล่นอีกครั้ง'}
          </button>
        )}
      </div>
      {status === 'lost' && <p className="feedback err">กดผิดจังหวะ! ลองใหม่นะ</p>}
      {status === 'won' && <p className="feedback ok">ความจำเป๊ะมาก! ผ่านด่าน</p>}
    </GameShell>
  )
}
