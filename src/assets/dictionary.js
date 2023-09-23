export const SYMBOLS = Object.freeze({
  x: 'x',
  o: 'o'
})

export const TURNS = Object.freeze({
  User: 'user',
  Machine: 'machine'
})

export const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
export const DIAGONALS = [
  [0, 4, 8],
  [2, 4, 6]
]
export const CROSS = [
  [1, 4, 7],
  [3, 4, 5]
]
export const SQUARE = [
  [0, 1, 2],
  [0, 3, 6],
  [2, 5, 8],
  [6, 7, 8]
]

export const CORNERS = [0, 2, 6, 8]
export const MIDDLES = [1, 3, 5, 7]
