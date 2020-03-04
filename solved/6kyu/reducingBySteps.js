function gcdi(x, y) {
  if (x == 0) return y;
  return Math.abs(gcdi(y % x, x));
}

function lcmu(a, b) {
  return Math.abs((a * b) / gcdi(a, b));
}

function som(a, b) {
  return a + b;
}

function maxi(a, b) {
  return Math.max(a, b);
}

function mini(a, b) {
  return Math.min(a, b);
}

function operArray(fct, arr, init) {
  const arr2 = [];
  for (let i = 0; i < arr.length; i++) {
    if (i == 0) {
      arr2.push(fct(init, arr[0]));
    } else {
      arr2.push(fct(arr2[i - 1], arr[i]));
    }
  }
  return arr2;
}
