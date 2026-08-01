import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || ''

// questions: [{ label: '...' }]
// ส่งคำตอบไปตรวจที่ backend เพื่อไม่ให้เห็นคำตอบตรง ๆ ใน frontend
export default function ShortAnswerQuiz({ questions, onSuccess, gameNumber }) {
  const [values, setValues] = useState(Array(questions.length).fill(''))
  const [feedback, setFeedback] = useState(null)

  async function submit() {
    try {
      const response = await fetch(`${API_BASE}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameNumber,
          answers: values,
          type: 'short',
        }),
      })

      const data = await response.json()
      if (data.ok) {
        setFeedback({ ok: true, msg: 'ถูกต้องทั้งหมด! ปลดล็อกสำเร็จ' })
        onSuccess()
      } else {
        setFeedback({ ok: false, msg: 'ยังมีคำตอบที่ไม่ถูกต้อง ลองดูอีกครั้งนะ' })
      }
    } catch (error) {
      setFeedback({ ok: false, msg: 'ไม่สามารถเชื่อมต่อ backend ได้ ลองเปิด server ก่อนใช้งาน' })
    }
  }

  return (
    <div>
      {questions.map((q, i) => (
        <div key={i} className="field-row">
          <div style={{ minWidth: 260, fontSize: 14 }}>{q.label}</div>
          <input
            type="text"
            value={values[i]}
            onChange={(e) => {
              const next = [...values]
              next[i] = e.target.value
              setValues(next)
            }}
          />
        </div>
      ))}
      <button className="primary-btn" onClick={submit} style={{ marginTop: 12 }}>
        ยืนยันคำตอบ
      </button>
      {feedback && <p className={`feedback ${feedback.ok ? 'ok' : 'err'}`}>{feedback.msg}</p>}
    </div>
  )
}
