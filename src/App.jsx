// CHAVEZ ORTIZ SAUL DAVID
// GUTIERREZ TREJO CARLOS ALBERTO
// SALAZAR HERMOSILLO ALAM ABEL

import { useState, useRef } from 'react'
import Create from './components/Create'
import Game from './components/Game'
import './App.css'
import { Hash } from './assets/svg'

function App () {
  // Estado del turno
  const [currentTurn, setTurn] = useState()
  // Estado del simbolo seleccionado por el usuario
  const [symbol, setSymbol] = useState()
  // Estado que define si el usuari ya eligio simbolo y turno
  const start = (symbol && currentTurn)
  // Guarda la asignación del simbolo que tiene cada jugador de acuerdo
  // a la eleccion del usuario
  const assign = useRef({})
  // Guarda el primer turno que seleccionó el usuario
  const firstTurn = useRef()
  return (
    <main className='main'>
      <header>
        <h1 className='title'><Hash></Hash>Gato</h1>
      </header>
      {
        start
          ? <Game // Si el turno y simbolo esta seleccionado
            currentTurn={currentTurn}
            setTurn={setTurn}
            setSymbol={setSymbol}
            assign={assign}
            firstTurn={firstTurn}
          ></Game>
          : <Create // Si aun no se selecciona el turno o usuario
            setTurn={setTurn}
            setSymbol={setSymbol}
            assign={assign}
            firstTurn={firstTurn}
          ></Create>
      }
    </main>
  )
}

export default App
