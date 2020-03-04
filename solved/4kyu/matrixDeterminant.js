function determinant(m) {
  if (m.length == 1) {
    return m[0][0];
  } else if (m.length == 2 && m[0].length == 2) {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  }
  let sum = 0;
  for (let i = 0; i < m[0].length; i++) {
    if (i % 2 == 0) {
      sum += m[0][i] * determinant(minorMatrix(m, 0, i));
    } else {
      sum += -1 * m[0][i] * determinant(minorMatrix(m, 0, i));
    }
  }
  return sum;
}

function minorMatrix(m, _i, _j) {
  const minor = [];
  for (let i = 0; i < m.length; i++) {
    const array = [];
    for (let j = 0; j < m[i].length; j++) {
      if (i != _i && j != _j) {
        array.push(m[i][j]);
      }
    }
    if (array.length != 0) {
      minor.push(array);
    }
  }
  return minor;
}
