import express from 'express'

const app = express()
const port = process.env.PORT || 3001

app.use((req, res, next) => {
  const origin = req.headers.origin || '*'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  next()
})

app.use(express.json())

const EXPECTED = {
  2: {
    type: 'truefalse',
    answers: [0, 1, 1, 0, 0, 1, 0, 1],
  },
  3: {
    type: 'truefalse',
    answers: [0, 1, 1, 0, 0, 1, 1, 0],
  },
  4: {
    type: 'short',
    answers: ['แม็กซ์', 'นายแม็กซ์', 'max'],
    maxAnswers: 1,
  },
  5: {
    type: 'short',
    answers: ['5', '3', '0', '0', '0', '0', '1', '0'],
  },
  6: {
    type: 'short',
    answers: ['ชมพู', '5', 'เขียนโค้ด', 'blue box', 'อินเดีย'],
  },
  16: {
    type: 'short',
    answers: ['14', '6', '7', '7', '15', '13', '10', '11', '15', '1', '3', '15', '8', '13', '15', '5', '6', '12', '7', '4', '12', '6', '3', '9', '2'],
  },
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

app.post('/api/verify', (req, res) => {
  const { gameNumber, answers = [], type } = req.body || {}
  const game = EXPECTED[Number(gameNumber)]

  if (!game) {
    return res.status(404).json({ ok: false, message: 'game not found' })
  }

  if (game.type === 'truefalse') {
    const clientAnswers = answers.map((a) => Number(a))
    const ok = clientAnswers.length === game.answers.length && clientAnswers.every((a, i) => a === game.answers[i])
    return res.json({ ok, message: ok ? 'correct' : 'wrong' })
  }

  const normalizedClient = answers.map(normalizeText)
  const normalizedExpected = game.answers.map(normalizeText)

  if (game.maxAnswers === 1) {
    const ok = normalizedClient.some((value) => normalizedExpected.includes(value))
    return res.json({ ok, message: ok ? 'correct' : 'wrong' })
  }

  const ok = normalizedClient.length === normalizedExpected.length && normalizedClient.every((value, i) => value === normalizedExpected[i])
  return res.json({ ok, message: ok ? 'correct' : 'wrong' })
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'backend ready' })
})

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
