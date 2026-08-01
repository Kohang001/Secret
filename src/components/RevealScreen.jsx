import { useEffect, useRef, useState } from 'react'
import { finalMessage } from '../data/gameData'
import HeartRain from './HeartRain'

const SONG_SRC = '/song/song.mp3'

export default function RevealScreen({ onBack, onReset }) {
  const [pink, setPink] = useState(false)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const [audioMissing, setAudioMissing] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    document.body.classList.add('reveal-pink')
    const pinkTimer = setTimeout(() => setPink(true), 50)

    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.7
      audio.play().catch(() => setAudioBlocked(true))
    }

    return () => {
      document.body.classList.remove('reveal-pink')
      clearTimeout(pinkTimer)
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [])

  function tryPlay() {
    audioRef.current?.play().then(() => setAudioBlocked(false)).catch(() => setAudioBlocked(true))
  }

  return (
    <div className={`game-page reveal-wrap ${pink ? 'pink' : ''}`}>
      <HeartRain />
      <audio
        ref={audioRef}
        src={SONG_SRC}
        loop
        onError={() => setAudioMissing(true)}
      />

      <div className="vault-door open" style={{ marginBottom: 30 }}>
        <div className="center">✓</div>
      </div>
      <h2>กล่องเปิดแล้ว...</h2>
      <p className="reveal-message">{finalMessage}</p>

      {audioMissing && (
        <p className="music-note">
          🎵 ยังไม่พบไฟล์เพลง — วางไฟล์ mp3 ที่คุณมีสิทธิ์ใช้งานไว้ที่ <code>public/song/song.mp3</code> แล้วรีเฟรชหน้านี้
        </p>
      )}
      {!audioMissing && audioBlocked && (
        <button className="ghost-btn music-note" onClick={tryPlay} style={{ marginTop: 12 }}>
          ▶ กดเพื่อเล่นเพลง
        </button>
      )}

      <div style={{ marginTop: 40, display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="ghost-btn" onClick={onBack}>← กลับไปหน้าเลือกด่าน</button>
        <button className="reset-link" onClick={onReset}>รีเซ็ตความคืบหน้าทั้งหมด</button>
      </div>
    </div>
  )
}
