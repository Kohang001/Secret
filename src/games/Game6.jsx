import GameShell from '../components/GameShell'
import ShortAnswerQuiz from '../components/ShortAnswerQuiz'

const questions = [
  { label: '1. พี่โกฮังชอบสีอะไร' },
  { label: '2. หนังเรื่อง Ghost board มีผีกี่ตัว' },
  { label: '3. พี่โกฮังว่างๆ ชอบทำอะไร' },
  { label: '4. การ์ตูนที่พี่โกฮังชอบมากที่สุดใน 3 โลก' },
  { label: '5. พี่โกฮังชอบกินอาหารประเทศอะไรที่สุด' },
]

export default function Game6({ done, onBack, onSuccess }) {
  return (
    <GameShell gameNumber={6} onBack={onBack} done={done} story="ตอบคำถามเกี่ยวกับพี่โกฮังให้ถูกทั้งหมดเพื่อปลดล็อก">
      <ShortAnswerQuiz questions={questions} gameNumber={6} onSuccess={onSuccess} />
    </GameShell>
  )
}
