import { useEffect, useState } from 'react'
import GameShell from '../components/GameShell'

const MAZE = [
  '###########',
  '#S..#.....#',
  '#.#.#.###.#',
  '#.#...#...#',
  '#.#####.#.#',
  '#.......#.#',
  '#.#####.#.#',
  '#.#.....#.#',
  '#.#.#####.#',
  '#...#....G#',
  '###########',
]

const CELL = 32

function findChar(ch) {
  for (let y = 0; y < MAZE.length; y++) {
    const x = MAZE[y].indexOf(ch)
    if (x !== -1) return { x, y }
  }
  return { x: 1, y: 1 }
}

const start = findChar('S')
const goal = findChar('G')

export default function Game15({ done, onBack, onSuccess }) {
  const [pos, setPos] = useState(start)
  const [won, setWon] = useState(false)

  function reset() {
    setPos(start)
    setWon(false)
  }

  useEffect(() => {
    function onKey(e) {
      if (won) return
      const deltas = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      }
      const d = deltas[e.key]
      if (!d) return
      e.preventDefault()
      setPos((p) => {
        const nx = p.x + d.x
        const ny = p.y + d.y
        if (MAZE[ny] && MAZE[ny][nx] !== '#') {
          if (nx === goal.x && ny === goal.y) {
            setWon(true)
            onSuccess()
          }
          return { x: nx, y: ny }
        }
        return p
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [won])

  return (
    <GameShell gameNumber={15} onBack={onBack} done={done} story="ใช้ลูกศรบนคีย์บอร์ดพาจุดเขียวจากจุดเริ่มต้น (S) ไปยังเป้าหมาย (G) ให้ได้">
      <div
        className="game-stage"
        style={{ width: MAZE[0].length * CELL, height: MAZE.length * CELL }}
      >
        {MAZE.map((row, y) =>
          row.split('').map((ch, x) =>
            ch === '#' ? (
              <div key={`${x}-${y}`} style={{ position: 'absolute', left: x * CELL, top: y * CELL, width: CELL, height: CELL, background: 'var(--line)' }} />
            ) : null
          )
        )}
        <div style={{ position: 'absolute', left: goal.x * CELL + 4, top: goal.y * CELL + 4, width: CELL - 8, height: CELL - 8, background: 'var(--gold)', borderRadius: 6 }} />
        <div style={{ position: 'absolute', left: pos.x * CELL + 6, top: pos.y * CELL + 6, width: CELL - 12, height: CELL - 12, background: 'var(--signal)', borderRadius: '50%', boxShadow: '0 0 10px var(--signal)', transition: 'left .1s, top .1s' }} />
      </div>
      <div style={{ marginTop: 16 }}>
        {won && <p className="feedback ok">ถึงเป้าหมายแล้ว! ผ่านด่าน</p>}
        <button className="ghost-btn" onClick={reset}>เริ่มใหม่</button>
      </div>
    </GameShell>
  )
}
