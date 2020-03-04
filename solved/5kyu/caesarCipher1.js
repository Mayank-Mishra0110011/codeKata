function movingShift(s, shift) {
  let cipherText = [...s]
    .map(c => {
      let charCode = c.charCodeAt();
      if (charCode >= 65 && charCode <= 90) {
        charCode += shift++;
        while (charCode > 90) {
          charCode = 64 + charCode - 90;
        }
        return String.fromCharCode(charCode);
      } else if (charCode >= 97 && charCode <= 122) {
        charCode += shift++;
        while (charCode > 122) {
          charCode = 96 + charCode - 122;
        }
        return String.fromCharCode(charCode);
      }
      shift++;
      return c;
    })
    .join("");
  let divisions = Math.ceil(cipherText.length / 5);
  const dividedCipherText = [];
  for (let i = 0; i < cipherText.length; i += divisions) {
    dividedCipherText.push(cipherText.slice(i, i + divisions));
  }
  if (dividedCipherText.length != 5) {
    dividedCipherText.push("");
  }
  return dividedCipherText;
}

function demovingShift(arr, shift) {
  return [...arr.join("")]
    .map(c => {
      let charCode = c.charCodeAt();
      if (charCode >= 65 && charCode <= 90) {
        charCode -= shift++;
        while (charCode < 65) {
          charCode = 91 - (65 - charCode);
        }
        return String.fromCharCode(charCode);
      } else if (charCode >= 97 && charCode <= 122) {
        charCode -= shift++;
        while (charCode < 97) {
          charCode = 123 - (97 - charCode);
        }
        return String.fromCharCode(charCode);
      }
      shift++;
      return c;
    })
    .join("");
}
