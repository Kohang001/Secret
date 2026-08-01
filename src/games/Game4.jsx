import GameShell from '../components/GameShell'
import ShortAnswerQuiz from '../components/ShortAnswerQuiz'

const questions = [
  {
    label: 'ใครคือคนร้ายตัวจริง?',
  },
]

export default function Game4({ done, onBack, onSuccess }) {
  return (
    <GameShell
      gameNumber={4}
      onBack={onBack}
      done={done}
      story={`ณ คฤหาสน์เศรษฐีในเมืองเบกะ "เพชรยอดน้ำตา" มูลค่ามหาศาลถูกขโมยไปจากตู้เซฟ สารวัตรเมงูเระกักตัวผู้ต้องสงสัยไว้ 4 คน\n\nกฎ: มีคนร้ายเพียง 1 คน และมีคนพูดความจริงเพียง 1 คนเท่านั้น ที่เหลืออีก 3 คนโกหกทั้งหมด!\n\nนายเคน: "นายจอร์จเป็นคนขโมยเพชรไปครับ!"\nนายแม็กซ์: "ผมไม่ได้ขโมยนะ!"\nนายจอร์จ: "นายอาร์ตต่างหากที่เป็นคนขโมย!"\nนายอาร์ต: "นายจอร์จโกหกครับที่บอกว่าผมเป็นคนขโมย!"`}
    >
      <ShortAnswerQuiz questions={questions} gameNumber={4} onSuccess={onSuccess} />
    </GameShell>
  )
}
