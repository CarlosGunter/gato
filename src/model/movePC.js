import { WIN_COMBINATIONS, CORNERS, MIDDLES, DIAGONALS, CROSS, SQUARE } from '../assets/dictionary'

export const movePC = ({ match, assign }) => {
  let copyGame
  match.includes('x') || match.includes('o')
    ? copyGame = started(match, assign)
    : copyGame = startPC(match, assign)

  return copyGame
}

const startPC = (match, assign) => {
  const move = selRandom([4, ...CORNERS])
  match.splice(move, 1, assign.current.machine)
  return match
}

const started = (match, assign) => {
  const values = (turn) => {
    const value = []
    match.forEach((val, index) => {
      if (val === turn) value.push(index)
    })
    return value
  }

  const userValues = [...values(assign.current.user)]
  const pcValues = [...values(assign.current.machine)]
  const nullValues = [...values(null)]

  const possibleWin = (arr, positions, enemyPosition) => {
    let toWin = restOfCombo(arr, positions, 1)
    toWin = notInclude(toWin, enemyPosition)
    return toWin
  }

  const pcWin = [...possibleWin(WIN_COMBINATIONS, pcValues, userValues)]
  const userWin = [...possibleWin(WIN_COMBINATIONS, userValues, pcValues)]

  const isTrick = (arr, positions, enemyPosition) => {
    const iOne = []
    arr.forEach(combo => {
      const p = include(positions, combo)
      if (p.length > 0) iOne.push(combo)
    })

    const isContentCombo = []
    iOne.forEach(trickCombo => {
      if (notInclude(trickCombo, enemyPosition).length === 3) {
        isContentCombo.push(trickCombo)
      }
    })

    let moveTrick = []
    isContentCombo.forEach((a, indexA) => {
      isContentCombo.forEach((combo, indexB) => {
        if (indexA > indexB) {
          combo.forEach(b => {
            if (a.includes(b)) moveTrick.push(b) // revisar
          })
        }
      })
    })
    moveTrick = notInclude([...moveTrick], positions)

    return moveTrick
  }

  let move
  if (pcValues.length === 0 && userValues.length === 1) {
    if (userValues[0] === 4) {
      move = selRandom(CORNERS)
    } else if (include(CORNERS, userValues).length > 0) {
      move = 4
    } else if (include(MIDDLES, userValues).length > 0) {
      const goodTurn = restOfCombo([...CROSS, ...SQUARE], userValues, 2)
      move = selRandom(goodTurn)
    }
  } else if (
    pcValues.length === 1 &&
    userValues.length === 1) {
    if (match[4] === assign.current.machine) {
      if (include(CORNERS, userValues).length > 0) {
        move = selRandom(nullValues)
      } else {
        const badTurn = restOfCombo(CROSS, [4, ...userValues], 1)
        const middle = notInclude(MIDDLES, badTurn)
        move = selRandom([...CORNERS, ...middle])
      }
    } else if (match[4] === assign.current.user) {
      const goodTurn = restOfCombo(DIAGONALS, [4, ...pcValues], 1)
      move = goodTurn[0]
    } else if (include(CORNERS, userValues).length > 0) {
      move = selRandom(include(CORNERS, nullValues))
    } else if (include(MIDDLES, userValues).length > 0) {
      if (restOfCombo(SQUARE, nullValues, 1).length === 1) {
        let goodTurn = restOfCombo(SQUARE, pcValues, 2)
        goodTurn = notInclude(goodTurn, userValues)
        move = selRandom([4, ...goodTurn])
      } else {
        move = selRandom(restOfCombo(DIAGONALS, pcValues, 3))
      }
    }
  } else if (pcWin.length > 0) {
    move = selRandom(pcWin)
  } else if (userWin.length > 0) {
    move = selRandom(userWin)
  } else if (isTrick(WIN_COMBINATIONS, pcValues, userValues).length > 0) {
    const pcTrick = isTrick(WIN_COMBINATIONS, pcValues, userValues)
    move = selRandom(pcTrick)
  } else if (isTrick(WIN_COMBINATIONS, userValues, pcValues).length > 0) {
    const userTrick = isTrick(WIN_COMBINATIONS, userValues, pcValues)
    if (restOfCombo(DIAGONALS, userTrick, 1).length === 1 && match[4] === assign.current.machine) {
      move = selRandom(MIDDLES)
    } else if (include(CORNERS, userTrick).length > 0) {
      move = selRandom(include(CORNERS, userTrick))
    } else {
      move = selRandom(userTrick)
    }
  } else {
    move = selRandom(nullValues)
  }

  match.splice(move, 1, assign.current.machine)
  return match
}

const include = (positions, ref) => {
  const inc = []
  positions.forEach(v => {
    if (ref.includes(v)) inc.push(v)
  })
  return inc
}

const notInclude = (positions, ref) => {
  const moves = []
  positions.forEach(value => {
    if (!ref.includes(value)) moves.push(value)
  })
  return moves
}

const restOfCombo = (combos, ref, length) => {
  const rest = []
  combos.forEach(combo => {
    const iTwo = notInclude(combo, ref)
    if (iTwo.length === length) rest.push(iTwo)
  })
  return rest.flat()
}

const selRandom = (arr) => {
  const i = Math.floor(Math.random() * arr.length)
  return arr[i]
}
