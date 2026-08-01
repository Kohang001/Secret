import { useEffect, useState } from 'react'

const STORAGE_KEY = 'surprise-progress-v1'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('ไม่สามารถอ่านความคืบหน้าเดิมได้', e)
  }
  return {
    completedGames: {}, // { [gameNumber]: true }
    boxInputs: Array(25).fill(''),
    boxLockedSlots: Array(25).fill(false), // ช่องที่ตอบถูกแล้วจะล็อกไว้ไม่ต้องพิมพ์ซ้ำ
    vaultOpen: false,
  }
}

export default function useProgress() {
  const [progress, setProgress] = useState(loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  function markGameComplete(gameNumber) {
    setProgress((p) => ({
      ...p,
      completedGames: { ...p.completedGames, [gameNumber]: true },
    }))
  }

  function isGameComplete(gameNumber) {
    return !!progress.completedGames[gameNumber]
  }

  function setBoxInput(index, value) {
    setProgress((p) => {
      const next = [...p.boxInputs]
      next[index] = value
      return { ...p, boxInputs: next }
    })
  }

  function lockBoxSlot(index) {
    setProgress((p) => {
      const next = [...p.boxLockedSlots]
      next[index] = true
      return { ...p, boxLockedSlots: next }
    })
  }

  function openVault() {
    setProgress((p) => ({ ...p, vaultOpen: true }))
  }

  function resetAll() {
    localStorage.removeItem(STORAGE_KEY)
    setProgress(loadInitial())
  }

  return {
    progress,
    markGameComplete,
    isGameComplete,
    setBoxInput,
    lockBoxSlot,
    openVault,
    resetAll,
  }
}
