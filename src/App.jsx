import { useState, useRef } from 'react'
import Create from './components/Create'
import Game from './components/Game'
import './App.css'
import { Hash } from './assets/svg'

function App () {
  const [currentTurn, setTurn] = useState()
  const [symbol, setSymbol] = useState()
  const start = (symbol && currentTurn)
  const assign = useRef({})
  const firstTurn = useRef()
  return (
    <>
      <header>
        <h1><Hash></Hash>Gato</h1>
      </header>
      {
        start
          ? <Game
            currentTurn={currentTurn}
            setTurn={setTurn}
            setSymbol={setSymbol}
            assign={assign}
            firstTurn={firstTurn}
          ></Game>
          : <Create
            setTurn={setTurn}
            setSymbol={setSymbol}
            assign={assign}
            firstTurn={firstTurn}
          ></Create>
      }
    </>
  )
}

export default App
