function posAverage(s) {
  let equalPositions = 0;
  function compare(a, b) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] == b[i]) {
        equalPositions++;
      }
    }
  }
  const subStrings = s.split(", ");
  const combinations = (subStrings.length * (subStrings.length - 1)) / 2;
  const totalPositions = subStrings[0].length * combinations;
  for (let i = 0; i < subStrings.length; i++) {
    for (let j = i + 1; j < subStrings.length; j++) {
      compare(subStrings[i], subStrings[j]);
    }
  }
  return (equalPositions / totalPositions) * 100;
}
