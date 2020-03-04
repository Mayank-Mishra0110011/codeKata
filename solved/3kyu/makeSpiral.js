var spiralize = function(size) {
  const spiral = new Array(size).fill(0).map(() => new Array(size).fill(0));
  let i = 0,
    j = 0,
    t = size;
  while (true) {
    for (let k = 0; k < 4; k++) {
      let di, dj;
      switch (k) {
        case 0:
          di = 0;
          dj = 1;
          break;
        case 1:
          di = 1;
          dj = 0;
          if (t < size && t >= 2) {
            t -= 2;
          }
          break;
        case 2:
          di = 0;
          dj = -1;
          break;
        case 3:
          di = -1;
          dj = 0;
          if (t >= 2) {
            t -= 2;
          }
          break;
      }
      for (let l = 0; l < t; l++) {
        if (t < 2) {
          spiral[i][j] = 1;
          break;
        }
        spiral[i][j] = 1;
        if (l != t - 1) {
          i += di;
          j += dj;
        }
      }
      if (t <= 2) break;
    }
    if (t <= 2) break;
  }
  return spiral;
};
