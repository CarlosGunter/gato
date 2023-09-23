import { useState } from 'react'
import Table from './Table'
import { TURNS } from '../assets/dictionary'
import { User, Machine } from '../assets/svg'

export default function Game ({ currentTurn, setTurn, setSymbol, assign, firstTurn }) {
  const [match, setMatch] = useState(Array(9).fill(null))
  const [win, setWinner] = useState(false)

  const reload = () => {
    setTurn(false)
    setSymbol(false)
  }

  const reset = () => {
    setMatch(Array(9).fill(null))
    setWinner(false)
    setTurn(firstTurn.current)
  }

  return (
    <>
      <Table currentTurn={currentTurn} setTurn={setTurn} assign={assign} match={match} setMatch={setMatch} win={win} setWinner={setWinner} ></Table>

      <TURN win={win} currentTurn={currentTurn} >Tu Turno!</TURN>

      <div className='buttons'>
        <div className='button' onClick={() => reset()}>Reiniciar</div>
        <div className='button' onClick={() => reload()}>Ir al inicio</div>
      </div>
    </>
  )
}

function TURN ({ win, currentTurn }) {
  const printWin = (turn) => {
    if (turn === TURNS.User) return <User></User>
    if (turn === TURNS.Machine) return <Machine></Machine>
  }
  let winner
  if (win && win === 1) {
    winner = 'EMPATE!'
  } else winner = 'GANÓ: '
  if (!win) winner = 'Tu turno!'
  return (
    <section className='stadistics'>
      <h2 className={currentTurn === TURNS.Machine && !win ? 'machine_turn' : ''}>{winner}</h2>

      {
        win && win !== 1
          ? printWin(currentTurn)
          : ''
      }
    </section>
  )
}
