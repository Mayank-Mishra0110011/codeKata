function isIsogram(str) {
  str = str.toLowerCase();
  for (let i = 0; i < str.length; i++) {
    if (str.includes(str[i], i + 1)) {
      return false;
    }
  }
  return true;
}
