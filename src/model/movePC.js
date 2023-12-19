import { WIN_COMBINATIONS, CORNERS, MIDDLES, DIAGONALS, CROSS, SQUARE } from '../assets/dictionary'

// Funcion principal
// Retorna el arreglo con la posicion que elgoritmo seleccionó
// Parametros: match(arreglo) es el tablero del juego, y
// assign(objeto) es la asignacion del simbolo que posee cada jugador
export const movePC = ({ match, assign }) => {
  let copyGame
  // Se evalua si el tablero contiene jugadas
  match.includes('x') || match.includes('o')
    ? copyGame = started(match, assign) // Juego ya iniciado
    : copyGame = startPC(match, assign) // PC inicia

  return copyGame
}

// Selecciona un turno en caso se que el algoritmo sea el primero en jugar
const startPC = (match, assign) => {
  const move = selRandom([4, ...CORNERS]) // Selecciona el centro o una esquina
  match.splice(move, 1, assign.current.machine)
  return match
}

// Selecciona un turno en caso de que el juego ya está iniciado
const started = (match, assign) => {
  // Retorna un areglo de las posiciones en las que se encuentra un elemento
  const values = (turn) => {
    const value = []
    match.forEach((val, index) => {
      if (val === turn) value.push(index)
    })
    return value
  }

  // Se recuperan las posiciones de cada posible valor en el tablero
  const userValues = [...values(assign.current.user)]
  const pcValues = [...values(assign.current.machine)]
  const nullValues = [...values(null)]

  // Retorna un arreglo con las posiciones que puede seleccionar
  // un jugador para ganar
  // En caso de no existir retorna un arreglo vacio
  const possibleWin = (arr, positions, enemyPosition) => {
    let toWin = restOfCombo(arr, positions, 1)
    toWin = notInclude(toWin, enemyPosition)
    return toWin
  }

  // Se recuperan las posiciones ganadoras de la PC y el usuario
  const pcWin = [...possibleWin(WIN_COMBINATIONS, pcValues, userValues)]
  const userWin = [...possibleWin(WIN_COMBINATIONS, userValues, pcValues)]

  // Crea una simulacion de una jugada adelantada donde evalua si esta provoca
  // que se pueda realizar un truco o de lo contrario evalua si el usuario
  // puede crear un truco con un determinado movimineto
  const selectTurn = () => {
    const turn = []
    // Agrega las jugadas que crean un truco
    nullValues.forEach(simulation => {
      isTrick(
        WIN_COMBINATIONS,
        [simulation, ...pcValues],
        userValues
      ) && turn.push(simulation)
    })

    // Si no hay jugadas que pueden crear un truco, agrega las jugadas que el
    // usuario puede hacer con el mismo fin
    if (!turn) {
      nullValues.forEach(simulation => {
        isTrick(
          WIN_COMBINATIONS,
          [simulation, ...userValues],
          pcValues
        ) && turn.push(simulation)
      })
    }

    return turn
  }

  // Se recuperan las posiciones donde existan intersecciones
  // de dos combos basandose en las posiciones donde un jugador
  // posea una posicion de un combo ganador
  // Se utiliza para definir una jugada trampa donde exista mas de una
  // posicion ganadora
  // Solo en posible utilizarla cuando un jugador tenga mas de 1 jugada
  const isTrick = (arr, positions, enemyPosition) => {
    // Se recuperan los combos ganadores donde el usuario posea
    // por lo menos una posicion
    const iOne = []
    arr.forEach(combo => {
      const p = include(positions, combo)
      // Combos donde el usuario tiene jugadas
      if (p.length > 0) iOne.push(combo)
    })

    // Filtra los combos los cuales el enemigo no contenga nunguna jugada
    const isContentCombo = []
    iOne.forEach(trickCombo => {
      if (notInclude(trickCombo, enemyPosition).length === 3) {
        isContentCombo.push(trickCombo) // Combos filtrados
      }
    })

    // Compara si dos de los combos anteriormente filtrados poseen una
    // interseccion entre sí, relizando todas las combinaciones posibles
    // mientras ésta no se repita ni se comparen entre si mismos
    let moveTrick = []
    isContentCombo.forEach((a, indexA) => {
      isContentCombo.forEach((combo, indexB) => {
        if (indexA > indexB) { // Evita comparaciones repetidas o iguales
          combo.forEach(b => {
            if (a.includes(b)) moveTrick.push(b)
          })
        }
      })
    })
    // Se filtran las posiciones donde el jugador no tiene jugadas
    moveTrick = notInclude([...moveTrick], positions)

    return moveTrick
  }

  let move // Jugada de la PC

  // Evalua si la segunda jugada la realizará la computadora
  if (pcValues.length === 0 && userValues.length === 1) {
    // Evalua si el usuario posee el centro del tablero
    if (userValues[0] === 4) {
      move = selRandom(CORNERS) // Selecciona una esquina
    // Evalua si el usuario tiró en una esquina
    } else if (include(CORNERS, userValues).length > 0) {
      move = 4 // Selecciona el centro
    // Evalua si el usuario tiró en un medio
    } else if (include(MIDDLES, userValues).length > 0) {
      // Selecciona cualquier posicion restante de un combo
      // ganador que contenga la posicion del usuario
      const goodTurn = restOfCombo([...CROSS, ...SQUARE], userValues, 2)
      move = selRandom(goodTurn)
    }

  // Evalua si la computadora posee jugadas ganadoras
  } else if (pcWin.length > 0) {
    move = selRandom(pcWin) // Selecciona una jugada ganadora

  // Evalua si el usuario posee jugadas ganadoras
  } else if (userWin.length > 0) {
    move = selRandom(userWin) // Evita que el usuario gane

  // Evalua si la computadora puede realizar una jugada tampa que le
  // permita obtener mas de una jugada ganadora
  } else if (isTrick(WIN_COMBINATIONS, pcValues, userValues).length > 0) {
    const pcTrick = isTrick(WIN_COMBINATIONS, pcValues, userValues)
    move = selRandom(pcTrick) // Selecciona una jugada trampa

  // Evalua si el usuario puede realizar una jugada trampa donde obtenga
  // más de una jugada ganadora
  } else if (isTrick(WIN_COMBINATIONS, userValues, pcValues).length > 0) {
    const userTrick = isTrick(WIN_COMBINATIONS, userValues, pcValues)

    // Evalua si el usuario posee dos posiciones de una diagonal y
    // que la computadora posea el centro
    if (restOfCombo(DIAGONALS, userTrick, 1).length === 1 && match[4] === assign.current.machine) {
      move = selRandom(MIDDLES) // Selecciona cualquier medio
    // Evalua si las posibles jugadas trampa incluyen por lo menos una esquina
    } else if (include(CORNERS, userTrick).length > 0) {
      // Seleciona una esquina valida
      move = selRandom(include(CORNERS, userTrick))
    } else {
      move = selRandom(userTrick) // Selecciona una jugada trampa
    }

  // Se lleva a cabo una simulacion con una jugada adelantada y evalua si en
  // viable realizar una jugada, en caso de no haber jugadas convenientes
  // selecciona una jugada aleatoria en un espacio valido
  } else {
    move = selRandom(selectTurn() || nullValues)
  }

  // Se inserta en el arreglo de la partida la jugada de la computadora
  match.splice(move, 1, assign.current.machine)
  return match
}

// Retorna un arreglo filtrado de una serie de valores los cuales se encuentran
// en una referencia
// Parametros: positions(arreglo) son los valores a evaluar y
// ref(arreglo) es la referencia con la que se va a comparar
const include = (positions, ref) => {
  const inc = []
  positions.forEach(v => {
    if (ref.includes(v)) inc.push(v)
  })
  return inc
}

// Retorna un arreglo que posee los valores que no se encuentran en una
// referencia
// Parametros: positions(arreglo) son los valores a evaluar y
// ref(arreglo) es la referencia con la que se va a comparar
const notInclude = (positions, ref) => {
  const moves = []
  positions.forEach(value => {
    if (!ref.includes(value)) moves.push(value)
  })
  return moves
}

// Retorna los valores restantes de los combos los cuales incluyen por lo
// menos un valor de una referencia
// La cantidad de estos valores debe ser igual a la indicada
// Parametros: combos(arreglo de dos dimensiones),
// ref(arreglo) es la referencia con la cual se van a evaluar los combos
// length(numero) es la cantidad de valores restantes que debe tener un
// combo una vez
const restOfCombo = (combos, ref, length) => {
  const rest = []
  combos.forEach(combo => {
    const iTwo = notInclude(combo, ref)
    if (iTwo.length === length) rest.push(iTwo)
  })
  return rest.flat()
}

// Retorna aleatoriamente el valor de una posicion de un arreglo
const selRandom = (arr) => {
  const i = Math.floor(Math.random() * arr.length)
  return arr[i]
}
