import { useState } from 'react'
import { correctAnswerForSlot } from '../data/gameData'

function hashText(value) {
  const text = String(value || '').trim().toLowerCase()
  let h = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

export default function MainBox({ progress, setBoxInput, lockBoxSlot, onBack, onUnlock }) {
  const [feedback, setFeedback] = useState(null)
  const { boxInputs, boxLockedSlots } = progress

  function checkAll() {
    let allCorrect = true
    boxInputs.forEach((val, i) => {
      const correct = correctAnswerForSlot(i)
      if (hashText(val) === correct) {
        if (!boxLockedSlots[i]) lockBoxSlot(i)
      } else {
        allCorrect = false
      }
    })
    if (allCorrect) {
      setFeedback({ ok: true, msg: 'รหัสถูกต้องครบทุกช่อง! กล่องกำลังเปิด...' })
      setTimeout(onUnlock, 900)
    } else {
      setFeedback({ ok: false, msg: 'ยังมีบางช่องไม่ถูกต้อง ลองตรวจสอบรหัสจากแต่ละด่านอีกครั้งนะ' })
    }
  }

  return (
    <div className="game-page vault-wrap">
      <button className="back-btn" onClick={onBack}>← กลับไปหน้าเลือกด่าน</button>
      <h2 className="game-title">กล่องสมบัติหลัก</h2>
      <p className="game-story">
        กรอกรหัสฐาน 2 ทั้ง 25 ชุดให้ถูกต้องตามลำดับที่ได้จากด่านที่ 16 โดยใช้ค่ารหัสของแต่ละ "ชุด" ที่เก็บมาจากด่านที่ 1-15
        ช่องที่ตอบถูกแล้วจะถูกล็อกไว้ ไม่ต้องพิมพ์ซ้ำแม้จะออกจากหน้านี้ไป
      </p>

      <div className="vault-door">
        <div className="center">?</div>
      </div>

      <div className="slot-grid">
        {boxInputs.map((val, i) => (
          <div className={`slot ${boxLockedSlots[i] ? 'locked' : ''}`} key={i}>
            <span className="idx">{i + 1}</span>
            <input
              type="text"
              value={val}
              disabled={boxLockedSlots[i]}
              maxLength={8}
              placeholder="00000000"
              onChange={(e) => setBoxInput(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button className="primary-btn" onClick={checkAll}>ตรวจสอบรหัสทั้งหมด</button>
      {feedback && <p className={`feedback ${feedback.ok ? 'ok' : 'err'}`}>{feedback.msg}</p>}
    </div>
  )
}
