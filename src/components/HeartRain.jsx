const HEART_COUNT = 26
const EMOJIS = ['💗', '💕', '💖', '💓']

function randomHearts() {
  return Array.from({ length: HEART_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 16 + Math.random() * 22,
    duration: 4 + Math.random() * 4,
    delay: Math.random() * 5,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
  }))
}

export default function HeartRain() {
  const hearts = randomHearts()
  return (
    <div className="heart-rain">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  )
}
