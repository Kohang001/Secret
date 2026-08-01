import GameShell from '../components/GameShell'
import ShortAnswerQuiz from '../components/ShortAnswerQuiz'
import { boxOrder } from '../data/gameData'

const questions = [
  { label: '1. ถ้า 2x = 28 จงหาค่าของ x' },
  { label: '2. ผลลัพธ์ของ 36 ÷ 6' },
  { label: '3. กำหนดให้ y + 43 = 50 จงหาค่าของ y' },
  { label: '4. รากที่สองที่เป็นบวกของ 49' },
  { label: '5. ผลคูณของ 3 × 5' },
  { label: '6. จำนวนเฉพาะถัดจาก 11' },
  { label: '7. ผลรวมของ 1+2+3+4' },
  { label: '8. ผลลัพธ์ของ 121 ÷ 11' },
  { label: '9. ครึ่งหนึ่งของ 30' },
  { label: '10. ค่าของ 5 ยกกำลังศูนย์' },
  { label: '11. จำนวนด้านของรูปสามเหลี่ยม' },
  { label: '12. พื้นที่สี่เหลี่ยมผืนผ้า กว้าง 3 ยาว 5' },
  { label: '13. ---.. ในรหัสมอสคืออะไร' },
  { label: '14. สามเหลี่ยมมุมฉาก ด้าน 5 และ 12 ด้านตรงข้ามมุมฉากยาวเท่าใด' },
  { label: '15. ค.ร.น. ของ 3 และ 5' },
  { label: '16. รากที่สองของ 25' },
  { label: '17. ค่าของ 3! (แฟกทอเรียล)' },
  { label: '18. 1ปีมีกี่เดือน' },
  { label: '19. จำนวนวันใน 1 สัปดาห์' },
  { label: '20. ห.ร.ม. ของ 8 และ 12' },
  { label: '21. ผลลัพธ์ของ 3 × 4' },
  { label: '22. ผลลัพธ์ของ 18 ÷ 3' },
  { label: '23. รากที่สามของ 27' },
  { label: '24. ค่าของ 3 ยกกำลังสอง' },
  { label: '25. จำนวนเฉพาะเพียงตัวเดียวที่เป็นเลขคู่' },
]

export default function Game16({ done, onBack, onSuccess }) {
  return (
    <GameShell
      gameNumber={16}
      onBack={onBack}
      done={done}
      story="Project OMEGA-MATH: ไขปริศนาคณิตศาสตร์ทั้ง 25 ข้อเรียงตามลำดับ เพื่อสกัดลำดับการเรียงชุดรหัสลับของกล่องหลัก"
      revealContent={
        <div className="ticket" style={{ flexWrap: 'wrap', maxWidth: 560 }}>
          <span className="set-num">ลำดับการเรียงของชุดรหัสลับ</span>
          <span className="bits" style={{ fontSize: 14, letterSpacing: 1 }}>
            "{boxOrder.join(', ')}"
          </span>
        </div>
      }
    >
      <ShortAnswerQuiz questions={questions} gameNumber={16} onSuccess={onSuccess} />
    </GameShell>
  )
}
