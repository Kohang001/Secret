import { useState } from 'react'
import GameShell from '../components/GameShell'

const ICONS = ['🐾', '💚', '🍞', '🕵️', '💎', '🎮', '🔐', '🌿']

function buildDeck() {
  const deck = [...ICONS, ...ICONS]
    .map((icon, i) => ({ icon, id: i }))
    .sort(() => Math.random() - 0.5)
  return deck
}

export default function Game9({ done, onBack, onSuccess }) {
  const [deck, setDeck] = useState(buildDeck)
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)

  function restart() {
    setDeck(buildDeck())
    setFlipped([])
    setMatched([])
    setLocked(false)
    setMoves(0)
  }

  function flipCard(idx) {
    if (locked || flipped.includes(idx) || matched.includes(idx)) return
    const next = [...flipped, idx]
    setFlipped(next)
    if (next.length === 2) {
      setLocked(true)
      setMoves((m) => m + 1)
      const [a, b] = next
      if (deck[a].icon === deck[b].icon) {
        setTimeout(() => {
          const newMatched = [...matched, a, b]
          setMatched(newMatched)
          setFlipped([])
          setLocked(false)
          if (newMatched.length === deck.length) onSuccess()
        }, 400)
      } else {
        setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 700)
      }
    }
  }

  return (
    <GameShell gameNumber={9} onBack={onBack} done={done} story="พลิกไพ่หาคู่ที่เหมือนกันให้ครบทุกคู่">
      <div className="stat-row">
        <span>จำนวนครั้งที่พลิก: {moves}</span>
        <button className="ghost-btn" onClick={restart}>เริ่มใหม่</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, maxWidth: 340 }}>
        {deck.map((card, idx) => {
          const isUp = flipped.includes(idx) || matched.includes(idx)
          return (
            <button
              key={card.id}
              onClick={() => flipCard(idx)}
              style={{
                aspectRatio: '1',
                borderRadius: 10,
                border: '1px solid var(--line)',
                background: isUp ? 'var(--bg-panel-2)' : 'linear-gradient(160deg, var(--bg-panel), var(--bg-panel-2))',
                fontSize: 24,
                color: matched.includes(idx) ? 'var(--signal)' : 'var(--cream)',
              }}
            >
              {isUp ? card.icon : '?'}
            </button>
          )
        })}
      </div>
    </GameShell>
  )
}
