var decodeBits = function(bits) {
  let dot = "1",
    ddsplit = "",
    chsplit = "000",
    wsplit = "0000000";

  if (bits[0] == "0") {
    let i = bits.indexOf("1");
    let j = bits.lastIndexOf("1");
    bits = bits.slice(i, j + 1);
  }

  let chr = "",
    arr = [];
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] == bits[i + 1]) {
      chr += bits[i];
    } else {
      chr += bits[i];
      if (!arr.includes(chr)) {
        arr.push(chr);
      }
      chr = "";
    }
  }

  for (let chr of arr) {
    if (chr.includes("1")) {
      if (dot == "1") {
        dot = chr;
      } else if (chr.length < dot.length) {
        dot = chr;
      }
    } else {
      if (ddsplit == "") {
        ddsplit = chr;
      } else if (chr.length < ddsplit.length) {
        ddsplit = chr;
      }
    }
  }

  if (ddsplit == "") {
    ddsplit = "0";
  }

  if (dot.length % 3 == 0) {
    if (bits.includes("0")) {
      dot = "1";
    }
  }
  if (ddsplit.length == dot.length) {
    for (let i = 1; i < ddsplit.length; i++) {
      wsplit += "0000000";
      chsplit += "000";
    }
  }

  return bits
    .split(wsplit)
    .map(bits => {
      return bits
        .split(chsplit)
        .map(bits => {
          return bits
            .split(ddsplit)
            .map(bits => {
              return bits == dot ? "." : "-";
            })
            .join("");
        })
        .join(" ");
    })
    .join("   ");
};

var decodeMorse = function(morseCode) {
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
