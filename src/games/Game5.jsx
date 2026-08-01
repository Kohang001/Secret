import GameShell from '../components/GameShell'
import ShortAnswerQuiz from '../components/ShortAnswerQuiz'

const questions = [
  { label: 'ด่านที่ 1 (1/2): จำนวนคนที่ "ว่ายน้ำได้" ในกลุ่มหมวกฟางหลังกินผลปีศาจแล้ว' },
  { label: 'ด่านที่ 1 (2/2): ดวลกับมิฮอว์ค โซโลเหลือดาบไม่หักกี่เล่ม' },
  { label: 'ด่านที่ 2 (1/2): เรือที่สร้างจากไม้ต้นอดัมที่หมวกฟางมี กี่ลำ' },
  { label: 'ด่านที่ 2 (2/2): ซันจิเตะผู้หญิงไปแล้วทั้งหมดกี่ครั้ง' },
  { label: 'ด่านที่ 3 (1/2): ปัจจุบันแชงคูสเหลือแขนซ้ายกี่ข้าง' },
  { label: 'ด่านที่ 3 (2/2): หนวดดำเชื่อว่าความฝันของผู้คนสิ้นสุดกี่ครั้ง' },
  { label: 'ด่านที่ 4 (1/2): วันพีซมีอยู่จริงหรือไม่ (มี=1 / ไม่มี=0)' },
  { label: 'ด่านที่ 4 (2/2): เอซรอดชีวิตจากสงครามมารีนฟอร์ดหรือไม่ (รอด=1 / ไม่รอด=0)' },
]

export default function Game5({ done, onBack, onSuccess }) {
  return (
    <GameShell
      gameNumber={5}
      onBack={onBack}
      done={done}
      story={`กล่องสมบัติปริศนาซ่อนคำใบ้ไว้ข้างใน หน้ากล่องมีแป้นให้กรอกรหัสลับ 8 หลัก (0/1 เท่านั้น) จงตอบคำถามทั้ง 4 ด่านเรียงจากซ้ายไปขวาเพื่อประกอบรหัสผ่านทั้ง 8 ตัว`}
    >
      <ShortAnswerQuiz questions={questions} gameNumber={5} onSuccess={onSuccess} />
    </GameShell>
  )
}
