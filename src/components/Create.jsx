import { TURNS, SYMBOLS } from '../assets/dictionary.js'
import { User, Machine, X, Circle } from '../assets/svg.jsx'

export default function Create ({
  currentTurn,
  setTurn,
  symbol,
  setSymbol,
  assign,
  firstTurn
}) {
  // Define la asignacion de simbolos de acuerdo al simbolo elegido
  // por el usuario
  function click (symb) {
    if (symb === SYMBOLS.x) { // En caso de que el usuario elija 'x'
      assign.current = {
        x: TURNS.User,
        user: SYMBOLS.x,
        o: TURNS.Machine,
        machine: SYMBOLS.o
      }
    } else if (symb === SYMBOLS.o) { // En caso de que el usuario elija 'o'
      assign.current = {
        x: TURNS.Machine,
        machine: SYMBOLS.x,
        o: TURNS.User,
        user: SYMBOLS.o
      }
    }
  }

  return (
    <>
      <h2>¿Quién iniciará la partida?</h2>
      <section className='turn'>
        <div className={`cell_turn ${currentTurn === TURNS.User ? 'active' : ''}`}
        onClick={() => { // El usuario comenzará la partida
          firstTurn.current = TURNS.User
          setTurn(TURNS.User)
        }}>
          <User />
        </div>
        <div className={`cell_turn ${currentTurn === TURNS.Machine ? 'active' : ''}`}
        onClick={() => { // La computadora comenzará la partida
          firstTurn.current = TURNS.Machine
          setTurn(TURNS.Machine)
        }}>
          <Machine />
        </div>
      </section>
      <h2>Elige tu símbolo:</h2>
      <section className="turn">
        <div className={`cell_turn ${symbol === SYMBOLS.x ? 'active' : ''}`}
        onClick={() => { // El usuario elije 'x'
          setSymbol(SYMBOLS.x)
          click(SYMBOLS.x)
        }}>
          <X />
        </div>
        <div className={`cell_turn ${symbol === SYMBOLS.o ? 'active' : ''}`}
        onClick={() => { // El usuario elije 'o'
          setSymbol(SYMBOLS.o)
          click(SYMBOLS.o)
        }}>
          <Circle />
        </div>
      </section>
    </>
  )
}
