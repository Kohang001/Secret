import { useState } from 'react'
import GameShell from '../components/GameShell'

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function winnerOf(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  }
  if (board.every(Boolean)) return 'draw'
  return null
}

function aiMove(board) {
  const empty = board.map((v, i) => (v ? null : i)).filter((v) => v !== null)
  // ลองบล็อกหรือชนะก่อน ถ้าไม่มีให้สุ่ม
  for (const i of empty) {
    const b = [...board]
    b[i] = 'O'
    if (winnerOf(b) === 'O') return i
  }
  for (const i of empty) {
    const b = [...board]
    b[i] = 'X'
    if (winnerOf(b) === 'X') return i
  }
  return empty[Math.floor(Math.random() * empty.length)]
}

export default function Game13({ done, onBack, onSuccess }) {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [status, setStatus] = useState('playing') // playing | win | lose | draw

  function reset() {
    setBoard(Array(9).fill(null))
    setStatus('playing')
  }

  function play(i) {
    if (status !== 'playing' || board[i]) return
    const b = [...board]
    b[i] = 'X'
    let w = winnerOf(b)
    if (w) {
      setBoard(b)
      finish(w)
      return
    }
    const ai = aiMove(b)
    if (ai !== undefined) b[ai] = 'O'
    w = winnerOf(b)
    setBoard(b)
    if (w) finish(w)
  }

  function finish(w) {
    if (w === 'X') {
      setStatus('win')
      onSuccess()
    } else if (w === 'O') setStatus('lose')
    else setStatus('draw')
  }

  return (
    <GameShell gameNumber={13} onBack={onBack} done={done} story="เล่น OX กับ AI คุณเป็น X ต้องเอาชนะให้ได้ (เสมอหรือแพ้ต้องเล่นใหม่)">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, maxWidth: 220 }}>
        {board.map((v, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            style={{
              aspectRatio: '1',
              fontSize: 28,
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-panel-2)',
              border: '1px solid var(--line)',
              borderRadius: 8,
              color: v === 'X' ? 'var(--signal)' : 'var(--gold)',
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        {status === 'lose' && <p className="feedback err">แพ้ AI! ลองใหม่นะ</p>}
        {status === 'draw' && <p className="feedback err">เสมอ! ต้องชนะเท่านั้นถึงจะผ่าน</p>}
        {status === 'win' && <p className="feedback ok">ชนะแล้ว! ผ่านด่าน</p>}
        {status !== 'playing' && (
          <button className="primary-btn" onClick={reset}>เล่นอีกครั้ง</button>
        )}
      </div>
    </GameShell>
  )
}
