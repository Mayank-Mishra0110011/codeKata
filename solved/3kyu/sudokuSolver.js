function sudoku(puzzle) {
  solve(puzzle);
  return puzzle;
}

function solve(puzzle) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] == 0) {
        for (let k = 1; k <= 9; k++) {
          if (isValid(puzzle, i, j, k)) {
            puzzle[i][j] = k;
            if (solve(puzzle)) {
              return true;
            } else {
              puzzle[i][j] = 0;
            }
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(puzzle, i, j, num) {
  if (
    !checkGrid(puzzle, i, j, num) &&
    !checkColumn(puzzle, j, num) &&
    !checkRow(puzzle, i, num)
  ) {
    return true;
  }
  return false;
}

function checkGrid(puzzle, row, col, num) {
  const r = row - (row % 3);
  const c = col - (col % 3);
  for (let i = r; i < r + 3; i++) {
    for (let j = c; j < c + 3; j++) {
      if (puzzle[i][j] == num) {
        return true;
      }
    }
  }
  return false;
}

function checkRow(puzzle, row, num) {
  for (let i = 0; i < 9; i++) {
    if (puzzle[row][i] == num) {
      return true;
    }
  }
  return false;
}

function checkColumn(puzzle, col, num) {
  for (let i = 0; i < 9; i++) {
    if (puzzle[i][col] == num) {
      return true;
    }
  }
  return false;
}
