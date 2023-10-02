import { useState } from 'react'
import Table from './Table'
import { useStadistics } from '../hooks/useStadistics'
import { TURNS } from '../assets/dictionary'
import { User, Machine } from '../assets/svg'

export default function Game ({ currentTurn, setTurn, setSymbol, assign, firstTurn }) {
  // Estado del tablero con 0 jugadas
  const [match, setMatch] = useState(Array(9).fill(null))
  // Estado del ganador, si el estado es 1 hay un empate
  const [win, setWinner] = useState(false)
  // Se obtiene el listado de partidas jugadas
  const metrics = useStadistics(win, assign.current)

  // Se ejecuta al darle al boton 'Ir al inicio', se resetea el Turno y
  // el símbolo, obligando al usuario a seleccionar ambos de nuevo
  const reload = () => {
    setTurn(false)
    setSymbol(false)
  }

  // Se ejecuta al hacer click en el botón 'Reiniciar', se resetea el tablero,
  // el ganador y el turno se define al primero que se selecciono al iniciar
  // la primer partida
  const reset = () => {
    setMatch(Array(9).fill(null))
    setWinner(false)
    setTurn(firstTurn.current)
  }

  return (
    <>
      <Table
      currentTurn={currentTurn} setTurn={setTurn}
      assign={assign}
      match={match} setMatch={setMatch}
      win={win} setWinner={setWinner}
      ></Table>

      <TURN win={win} currentTurn={currentTurn} >Tu Turno!</TURN>

      <div className='stadistics'>
        <p className='block'>Juegos: {metrics.plays}</p>
        <p className='block'>Ganaste: {metrics.won}</p>
        <p className='block'>Perdiste: {metrics.loose}</p>
      </div>

      <div className='buttons'>
        <div className='button' onClick={() => reset()}>Reiniciar</div>
        <div className='button' onClick={() => reload()}>Ir al inicio</div>
      </div>
    </>
  )
}

// Componente donde se muestra durante la partida 'Tu turno', si la fuente
// se muestra en blanco es turno del usuario, si se muestra gris el turno
// es de la computadora
// En caso de haber un ganador o un empate cambia la leyenda correspondiente
function TURN ({ win, currentTurn }) {
  const printWin = (turn) => {
    if (turn === TURNS.User) return <User></User>
    if (turn === TURNS.Machine) return <Machine></Machine>
  }
  let winner
  if (win && win === 1) {
    winner = 'Empate!' // Cambia la leyenda a 'Empate'
  } else winner = 'Ganó: ' // Cambia la leyenda a un ganador
  if (!win) winner = 'Tu turno!' // Cambia la leyenda a 'Tu turno'
  return (
    <section className='admin'>
      <h2 className={currentTurn === TURNS.Machine && !win ? 'machine_turn' : '' + 'title'}>{winner}</h2>

      {
        win && win !== 1
          ? printWin(currentTurn) // Imprime al ganador
          : ''
      }
    </section>
  )
}
