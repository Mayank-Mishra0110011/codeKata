function reverse(str) {
  const strArr = str.trim().split(" ");
  for (let i = 0; i < strArr.length; i++) {
    if (i % 2 != 0) {
      strArr[i] = strArr[i]
        .split("")
        .reverse()
        .join("");
    }
  }
  return strArr.join(" ");
}
