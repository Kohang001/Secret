import { gameToSet, setValues } from '../data/gameData'

export default function ResultTicket({ gameNumber }) {
  const setNo = gameToSet[gameNumber]
  const bits = setValues[setNo]
  return (
    <div className="ticket">
      <span className="set-num">ชุดที่ {setNo}</span>
      <span className="bits">{bits}</span>
    </div>
  )
}
