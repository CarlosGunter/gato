import Table from './Table'
import { X, Circle } from '../assets/svg.jsx'

export default function Game ({ currentTurn, setTurn, assign }) {
  return (
    <>
      <Table currentTurn={currentTurn} setTurn={setTurn} assign={assign} ></Table>
      <section>
        <h2>Turno</h2>
        <div className='turn'>
          <div className={assign.current.x === currentTurn ? 'cell_turn cell_turn-select' : 'cell_turn'}>
            <X></X>
          </div>
          <div className={assign.current.o === currentTurn ? 'cell_turn cell_turn-select' : 'cell_turn'}>
            <Circle></Circle>
          </div>
        </div>
      </section>
    </>
  )
}
