import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || ''

// questions: [{ text: '...' }]
// ส่งคำตอบไปตรวจที่ backend เพื่อไม่ให้เห็นชุดคำตอบชัดเจนใน frontend
export default function TrueFalseQuiz({ questions, onSuccess, gameNumber }) {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null))
  const [feedback, setFeedback] = useState(null)

  function setAnswer(i, val) {
    const next = [...answers]
    next[i] = val
    setAnswers(next)
  }

  async function submit() {
    if (answers.some((a) => a === null)) {
      setFeedback({ ok: false, msg: 'ตอบให้ครบทุกข้อก่อนนะ' })
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameNumber,
          answers,
          type: 'truefalse',
        }),
      })

      const data = await response.json()
      if (data.ok) {
        setFeedback({ ok: true, msg: 'ถูกต้องทั้งหมด! ปลดล็อกสำเร็จ' })
        onSuccess()
      } else {
        setFeedback({ ok: false, msg: 'มีคำตอบผิดอยู่ ลองใหม่อีกครั้งนะ' })
      }
    } catch (error) {
      setFeedback({ ok: false, msg: 'ไม่สามารถเชื่อมต่อ backend ได้ ลองเปิด server ก่อนใช้งาน' })
    }
  }

  return (
    <div>
      {questions.map((q, i) => (
        <div key={i} className="field-row" style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 220, fontSize: 14 }}>
            <strong style={{ color: 'var(--gold)' }}>ข้อ {i + 1}: </strong>
            {q.text}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="ghost-btn"
              style={answers[i] === 1 ? { borderColor: 'var(--signal)', color: 'var(--signal)' } : {}}
              onClick={() => setAnswer(i, 1)}
            >
              จริง (1)
            </button>
            <button
              className="ghost-btn"
              style={answers[i] === 0 ? { borderColor: 'var(--danger)', color: 'var(--danger)' } : {}}
              onClick={() => setAnswer(i, 0)}
            >
              ไม่จริง (0)
            </button>
          </div>
        </div>
      ))}
      <button className="primary-btn" onClick={submit} style={{ marginTop: 12 }}>
        ยืนยันคำตอบ
      </button>
      {feedback && (
        <p className={`feedback ${feedback.ok ? 'ok' : 'err'}`}>{feedback.msg}</p>
      )}
    </div>
  )
}
