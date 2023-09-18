const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

export const movePC = ({ match, assign }) => {
  let copyGame
  match.includes('x') || match.includes('o')
    ? copyGame = started(match, assign)
    : copyGame = startPC(match, assign)

  return copyGame
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

  const noIntersections = (forWin, enemyPosition) => {
    const moves = []
    forWin.forEach(value => {
      if (!enemyPosition.includes(value)) moves.push(value)
    })
    return moves
  }

  const possibleWin = (arr, positions, enemyPosition) => {
    const iTwo = []
    arr.forEach((combo, index) => {
      let flag = 0
      positions.forEach(p => {
        if (combo.includes(p)) flag++
      })
      if (flag === 2) iTwo.push(index)
    })

    let forWin = []
    iTwo.forEach(i => {
      positions.forEach(p => {
        arr[i].forEach(v => {
          if (v !== p) forWin.push(v)
        })
      })
    })
    forWin = noIntersections(forWin, enemyPosition)
    return forWin
  }

  const pcWin = possibleWin(WIN_COMBINATIONS, pcValues, userValues)
  const userWin = possibleWin(WIN_COMBINATIONS, userValues, pcValues)

  const include = (arr, positions) => {
    let inc

    positions.forEach(v => {
      if (Array.isArray(arr[0])) {
        arr.forEach((combo, index) => {
          if (combo.includes(v)) {
            inc.push(index)
            return inc
          }
        })
      } else if (arr.includes(v)) {
        inc = true
        return inc
      }
    })
    return inc
  }

  const selRandom = (arr) => {
    const i = Math.floor(Math.random() * arr.length)
    return arr[i]
  }

  let move
  if (pcValues.length === 0 && userValues.length === 1) {
    if (userValues[0] !== 4) move = 4
    if (userValues[0] === 4) move = selRandom([0, 2, 6, 8])
  } else if (
    pcValues.length === 1 &&
    userValues.length === 1 &&
    match[4] === assign.current.machine) {
    if (include(userValues, [0, 2, 6, 8])) {
      move = selRandom(noIntersections([0, 2, 6, 8], userValues))
    }
    if (include(userValues, [1, 3, 5, 7])) {
      move = 8 // Debe ser cualquier menos la contraparte de user
    }
  } else if (pcWin.length > 0) {
    move = selRandom(pcWin)
  } else if (userWin.length > 0) {
    move = selRandom(userWin)
  }

  match.splice(move, 1, assign.current.machine)
  return match
}

const startPC = (match, assign) => {
  match[4] = assign.current.machine // Debe ser aleatorio entre esquina y centro
  return match
}
