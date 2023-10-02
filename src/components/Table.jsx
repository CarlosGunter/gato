import { useEffect } from 'react'
import { X, Circle } from '../assets/svg'
import { TURNS, SYMBOLS } from '../assets/dictionary'
import { movePC } from '../model/movePC'
import './table.css'

export default function Table ({ currentTurn, setTurn, assign, match, setMatch, win, setWinner }) {
  // Bloque de codigo que define cuando la computadora le toca hacer
  // su movimiento
  useEffect(() => {
    // En caso de ser turno del usuario o ya existe un ganador no jecuta nada
    if (currentTurn === TURNS.User || win) return
    setTimeout(() => {
      // Se invoca la funcion donde se define el movimiento de la computadora
      const gameMachine = movePC({ match, assign })
      setMatch(gameMachine) // Se actualiza el estado del juego
      const isWin = checkWin(gameMachine) // Se evalua si hay un ganador
      if (isWin === 1) setWinner(1) // Se evalua y define si hay empate
      // En caso de que un jugador gane se actualiza el estado ganador
      // caso contrario se le transfiere el turno al usuario
      isWin ? setWinner(isWin) : setTurn(TURNS.User)
    }, 750) // El movimiento de la computadora tiene un delay de 750 ms

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurn, win]) // Se ejecuta cada vez que un Turno y el ganador cambie

  // Se ejecuta cuando el usuarioo hace click en una casilla
  const moveUser = (isValid, index) => {
    // Si la casiila esta ocupada, es turno de la computadora, o hay un
    // ganador no se ejecuta nada
    if (isValid || currentTurn === TURNS.Machine || win) return
    const copyGame = [...match]
    copyGame[index] = assign.current.user
    setMatch(copyGame) // Se actualiza estado del juego
    const isWin = checkWin(copyGame) // Se evalua si hay un ganador
    if (isWin === 1) setWinner(1) // Se evalua y define si hay empate
    // En caso de que un jugador gane se actualiza el estado ganador
    // caso contrario se le transfiere el turno al la computadora
    isWin ? setWinner(isWin) : setTurn(TURNS.Machine)
  }

  // Funcion que evalua si hay un ganador
  const checkWin = (game) => {
    // Evalua todas las posibles combinaciones ganadoras que contengan
    // el centro del tablero
    if (game[4]) {
      for (let i = 4; i > 0; i--) {
        if (game[4] === game[4 - i] && game[4] === game[4 + i]) return game[4]
      }
    }
    // Evalua todas las posible combinaciones ganadoras que contengan los extremos izquierdo y superior del tablero
    if (game[0] && (
      (game[0] === game[1] && game[1] === game[2]) ||
      (game[0] === game[3] && game[3] === game[6])
    )) return game[0]
    // Evalua todas las posible combinaciones ganadoras que contenga los lados derecho e inferior del tablero
    if (game[8] && (
      (game[8] === game[2] && game[8] === game[5]) ||
      (game[8] === game[6] && game[8] === game[7])
    )) return game[8]
    // En caso de que todo el tablero se encuentre ocupado sin un ganador
    // retorna 1 definiendo como empate el juego
    if (!game.includes(null)) return 1
    return false
  }

  // Imprime el simbolo correspondiente a la casilla
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
              <div
              key={index}
              onClick={() => { moveUser(isValid, index) }}
              className="cell scale-in-center">
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
