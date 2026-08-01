import { gameNames } from '../data/gameData'
import ResultTicket from './ResultTicket'

export default function GameShell({ gameNumber, story, onBack, done, children, revealContent }) {
  return (
    <div className="game-page">
      <button className="back-btn" onClick={onBack}>← กลับไปหน้าเลือกด่าน</button>
      <h2 className="game-title">ด่านที่ {gameNumber}: {gameNames[gameNumber]}</h2>
      {story && <div className="game-story">{story}</div>}

      {done ? (
        <div>
          <p className="feedback ok">✓ ผ่านด่านนี้แล้ว! เก็บรหัสไว้เรียบร้อย</p>
          {revealContent || <ResultTicket gameNumber={gameNumber} />}
        </div>
      ) : (
        children
      )}
    </div>
  )
}
