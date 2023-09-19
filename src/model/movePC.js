import { WIN_COMBINATIONS, CORNERS, MIDDLES } from '../assets/dictionary'

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
    const iTwo = []
    arr.forEach((combo) => {
      let flag = 0
      positions.forEach(p => {
        if (combo.includes(p)) flag++
      })
      if (flag === 2) iTwo.push(combo)
    })

    let toWin = []
    iTwo.forEach(combo => {
      toWin.push(notInclude(combo, positions))
    })
    toWin = toWin.flat()

    toWin = notInclude(toWin, enemyPosition)
    return toWin
  }

  const pcWin = possibleWin(WIN_COMBINATIONS, pcValues, userValues)
  const userWin = possibleWin(WIN_COMBINATIONS, userValues, pcValues)

  const isTrick = (arr, positions, enemyPosition) => {
    const iOne = []
    arr.forEach(combo => {
      const p = include(combo, positions)
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
        combo.forEach(b => {
          if (indexA > indexB && a.includes(b)) moveTrick.push(b)
        })
      })
    })
    moveTrick = notInclude([...moveTrick], positions)

    return moveTrick
  }

  let move
  if (pcValues.length === 0 && userValues.length === 1) {
    if (userValues[0] !== 4) move = 4
    if (userValues[0] === 4) move = selRandom(CORNERS)
  } else if (
    pcValues.length === 1 &&
    userValues.length === 1 &&
    match[4] === assign.current.machine) {
    if (include(userValues, CORNERS)) {
      move = selRandom(notInclude(CORNERS, userValues))
    }
    if (include(userValues, MIDDLES)) {
      move = 8 // Debe ser cualquier menos la contraparte de user
    }
  } else if (pcWin.length > 0) {
    move = selRandom(pcWin)
  } else if (userWin.length > 0) {
    move = selRandom(userWin)
  } else if (isTrick(WIN_COMBINATIONS, userValues, pcValues).length > 1) {
    const pcTrick = isTrick(WIN_COMBINATIONS, userValues, pcValues)
    if (include(pcTrick, CORNERS)) {
      move = selRandom(include(pcTrick, CORNERS))
    } else {
      move = selRandom(pcTrick)
    }
  } else if (isTrick(WIN_COMBINATIONS, pcValues, userValues).length > 1) {
    const userTricks = isTrick(WIN_COMBINATIONS, pcValues, userValues)
    move = selRandom(userTricks)
  } else {
    move = selRandom(nullValues)
  }

  match.splice(move, 1, assign.current.machine)
  return match
}

const include = (ref, positions) => {
  const inc = []
  positions.forEach(v => {
    if (ref.includes(v)) {
      inc.push(v)
    }
  })
  return inc
}

const notInclude = (ref, positions) => {
  const moves = []
  ref.forEach(value => {
    if (!positions.includes(value)) moves.push(value)
  })
  return moves
}

const selRandom = (arr) => {
  const i = Math.floor(Math.random() * arr.length)
  return arr[i]
}
