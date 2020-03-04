let dShift;

function encodeStr(s, shift) {
  dShift = shift;
  let firstChar = 0;
  let cipherText = [...s]
    .map(c => {
      let charCode = c.charCodeAt();
      if (charCode >= 65 && charCode <= 90) {
        charCode += shift;
        while (charCode > 90) {
          charCode = 64 + charCode - 90;
        }
        if (firstChar == 0) {
          let fc = c.toLowerCase();
          let fcc = fc.charCodeAt();
          if (fcc >= 65 && fcc <= 90) {
            fcc += shift;
            while (fcc > 90) {
              fcc = 64 + fcc - 90;
            }
          } else if (fcc >= 97 && fcc <= 122) {
            fcc += shift;
            while (fcc > 122) {
              fcc = 96 + fcc - 122;
            }
          }
          let sc = String.fromCharCode(fcc);
          firstChar++;
          return fc + sc + String.fromCharCode(charCode);
        }
        return String.fromCharCode(charCode);
      } else if (charCode >= 97 && charCode <= 122) {
        charCode += shift;
        while (charCode > 122) {
          charCode = 96 + charCode - 122;
        }
        if (firstChar == 0) {
          let fc = c.toLowerCase();
          let fcc = fc.charCodeAt();
          if (fcc >= 65 && fcc <= 90) {
            fcc += shift;
            while (fcc > 90) {
              fcc = 64 + fcc - 90;
            }
          } else if (fcc >= 97 && fcc <= 122) {
            fcc += shift;
            while (fcc > 122) {
              fcc = 96 + fcc - 122;
            }
          }
          let sc = String.fromCharCode(fcc);
          firstChar++;
          return fc + sc + String.fromCharCode(charCode);
        }
        return String.fromCharCode(charCode);
      }
      return c;
    })
    .join("");
  let divisions = Math.ceil(cipherText.length / 5);
  const dividedCipherText = [];
  for (let i = 0; i < cipherText.length; i += divisions) {
    dividedCipherText.push(cipherText.slice(i, i + divisions));
  }
  return dividedCipherText;
}

function decode(arr) {
  let message = [...arr.join("")].map(c => {
    let charCode = c.charCodeAt();
    if (charCode >= 65 && charCode <= 90) {
      charCode -= dShift;
      while (charCode < 65) {
        charCode = 91 - (65 - charCode);
      }
      return String.fromCharCode(charCode);
    } else if (charCode >= 97 && charCode <= 122) {
      charCode -= dShift;
      while (charCode < 97) {
        charCode = 123 - (97 - charCode);
      }
      return String.fromCharCode(charCode);
    }
    return c;
  });
  message.splice(0, 2);
  return message.join("");
}
