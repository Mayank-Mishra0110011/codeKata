decodeMorse = function(morseCode) {
  return morseCode
    .split("   ")
    .map(word => {
      return word.split(" ");
    })
    .map(word => {
      return word.map(chr => {
        return MORSE_CODE[chr];
      });
    })
    .map(word => {
      return word.join("");
    })
    .join(" ")
    .trim();
};
