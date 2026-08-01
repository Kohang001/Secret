import { useState } from 'react'
import useProgress from './hooks/useProgress'
import { totalGames } from './data/gameData'
import GameMenu from './components/GameMenu'
import MainBox from './components/MainBox'
import RevealScreen from './components/RevealScreen'

import Game1 from './games/Game1'
import Game2 from './games/Game2'
import Game3 from './games/Game3'
import Game4 from './games/Game4'
import Game5 from './games/Game5'
import Game6 from './games/Game6'
import Game7 from './games/Game7'
import Game8 from './games/Game8'
import Game9 from './games/Game9'
import Game10 from './games/Game10'
import Game11 from './games/Game11'
import Game12 from './games/Game12'
import Game13 from './games/Game13'
import Game14 from './games/Game14'
import Game15 from './games/Game15'
import Game16 from './games/Game16'

const GAME_COMPONENTS = {
  1: Game1, 2: Game2, 3: Game3, 4: Game4, 5: Game5, 6: Game6, 7: Game7, 8: Game8,
  9: Game9, 10: Game10, 11: Game11, 12: Game12, 13: Game13, 14: Game14, 15: Game15, 16: Game16,
}

export default function App() {
  const { progress, markGameComplete, isGameComplete, setBoxInput, lockBoxSlot, openVault, resetAll } = useProgress()
  const [view, setView] = useState(() => (progress.vaultOpen ? 'reveal' : 'menu')) // 'menu' | number (game) | 'vault' | 'reveal'

  const completedCount = Array.from({ length: totalGames }, (_, i) => i + 1).filter(isGameComplete).length

  function goMenu() {
    setView('menu')
  }

  function renderMain() {
    if (view === 'menu') {
      return (
        <GameMenu
          isGameComplete={isGameComplete}
          onOpenGame={(n) => setView(n)}
          onOpenVault={() => setView(progress.vaultOpen ? 'reveal' : 'vault')}
        />
      )
    }
    if (view === 'vault') {
      return (
        <MainBox
          progress={progress}
          setBoxInput={setBoxInput}
          lockBoxSlot={lockBoxSlot}
          onBack={goMenu}
          onUnlock={() => {
            openVault()
            setView('reveal')
          }}
        />
      )
    }
    if (view === 'reveal') {
      return (
        <RevealScreen
          onBack={goMenu}
          onReset={() => {
            resetAll()
            setView('menu')
          }}
        />
      )
    }
    const GameComponent = GAME_COMPONENTS[view]
    if (GameComponent) {
      return (
        <GameComponent
          done={isGameComplete(view)}
          onBack={goMenu}
          onSuccess={() => markGameComplete(view)}
        />
      )
    }
    return null
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="brand">
          <span className="dot" />
          SECRET // 16 STAGES
        </div>
        <div className="progress-pill">{completedCount} / {totalGames} ด่าน</div>
      </div>
      <div className="main-area">{renderMain()}</div>
    </div>
  )
}
