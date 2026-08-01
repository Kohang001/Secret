import { gameNames, gameToSet, setValues, totalGames } from '../data/gameData'

export default function GameMenu({ isGameComplete, onOpenGame, onOpenVault }) {
  const completedCount = Array.from({ length: totalGames }, (_, i) => i + 1).filter(isGameComplete).length

  return (
    <div>
      <div className="menu-hero">
        <h1>ภารกิจลับ 16 ด่าน</h1>
        <p>ไขปริศนาแต่ละด่านเพื่อเก็บรหัสฐาน 2 แล้วนำไปปลดล็อกกล่องสมบัติ</p>
      </div>

      <div className="game-grid">
        {Array.from({ length: totalGames }, (_, i) => i + 1).map((n) => {
          const done = isGameComplete(n)
          const setNo = gameToSet[n]
          return (
            <button key={n} className={`game-card ${done ? 'done' : ''}`} onClick={() => onOpenGame(n)}>
              <span className="num">ด่านที่ {n}</span>
              <span className="name">{gameNames[n]}</span>
              {done ? (
                n === 16 ? (
                  <span className="code-chip">เฉลยลำดับแล้ว ✓</span>
                ) : (
                  <span className="code-chip">{setValues[setNo]}</span>
                )
              ) : (
                <span className="lock">🔒 ยังไม่ผ่าน</span>
              )}
            </button>
          )
        })}
      </div>

      <button className="vault-cta" onClick={onOpenVault}>
        🔐 เปิดกล่องสมบัติหลัก
        <small>ความคืบหน้า: {completedCount} / {totalGames} ด่าน</small>
      </button>
    </div>
  )
}
