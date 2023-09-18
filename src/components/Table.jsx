import { useState, useEffect } from 'react'
import { X, Circle } from '../assets/svg'
import { TURNS, SYMBOLS } from '../assets/dictionary'
import { movePC } from '../model/movePC'
import './table.css'

export default function Table ({ currentTurn, setTurn, assign }) {
  const [match, setMatch] = useState(Array(9).fill(null))
  const [win, setWinner] = useState(false)
  useEffect(() => {
    if (currentTurn === TURNS.User) return
    const gameMachine = movePC({ match, assign })
    setMatch(gameMachine)
    const isWin = checkWin(gameMachine)
    isWin ? setWinner(isWin) : setTurn(TURNS.User)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurn])

  const moveUser = (isValid, index) => {
    if (isValid || currentTurn === TURNS.Machine || win) return
    const copyGame = [...match]
    copyGame[index] = assign.current.user
    setMatch(copyGame)
    const isWin = checkWin(copyGame)
    isWin ? setWinner(isWin) : setTurn(TURNS.Machine)
  }

  const checkWin = (game) => {
    if (game[4]) {
      for (let i = 4; i > 0; i--) {
        if (game[4] === game[4 - i] && game[4] === game[4 + i]) return game[4]
      }
    }
    if (game[0] && (
      (game[0] === game[1] && game[1] === game[2]) ||
      (game[0] === game[3] && game[3] === game[6])
    )) return game[0]
    if (game[8] && (
      (game[8] === game[2] && game[8] === game[5]) ||
      (game[8] === game[6] && game[8] === game[7])
    )) return game[8]
    return false
  }

  const printSymb = (isValid) => {
    if (isValid === SYMBOLS.x) return <X></X>
    if (isValid === SYMBOLS.o) return <Circle></Circle>
  }

  return (
    <>
      <div className='table'>
        {
          match.map((isValid, index) => {
            return (
              <div key={index} onClick={() => { moveUser(isValid, index) }} className="cell">
                {
                  printSymb(isValid)
                }
              </div>
            )
          })
        }
      </div>
    </>
  )
}
