function encodeRailFenceCipher(string, numberRails) {
  if (string == "") {
    return string;
  }
  let top = "",
    bottom = "",
    middle = new Array(numberRails - 2).fill(""),
    j = 0,
    k;
  for (let i = 0; i < string.length; i++) {
    if (i % (numberRails + (numberRails - 2)) == 0) {
      top += string[i];
      k = 1;
      j = 0;
    } else if (i % (numberRails - 1) == 0) {
      bottom += string[i];
      k = -1;
      j = middle.length - 1;
    } else {
      middle[j] += string[i];
      j += k;
    }
  }
  return top + middle.join("") + bottom;
}

function decodeRailFenceCipher(string, numberRails) {
  if (string == "") {
    return string;
  }
  let top = "",
    bottom = "",
    middle = new Array(numberRails - 2).fill(""),
    j = 0,
    k;
  for (let i = 0; i < string.length; i++) {
    if (i % (numberRails + (numberRails - 2)) == 0) {
      top += string[i];
      k = 1;
      j = 0;
    } else if (i % (numberRails - 1) == 0) {
      bottom += string[i];
      k = -1;
      j = middle.length - 1;
    } else {
      middle[j] += string[i];
      j += k;
    }
  }
  top = string.substr(0, top.length);
  let _middle = string.substr(top.length, middle.join("").length);
  let l = 0;
  for (let i = 0; i < middle.length; i++) {
    if (i == 0) {
      middle[i] = _middle.substr(0, middle[i].length);
    } else {
      middle[i] = _middle.substr(l, middle[i].length);
    }
    l += middle[i].length;
  }
  bottom = string.substr(l + top.length, string.length);
  let text = "",
    i = 0;
  while (top.length > 0 || bottom.length > 0) {
    if (i % 2 == 0) {
      text += top.slice(0, 1);
      top = top.slice(1, top.length);
      for (let i = 0; i < middle.length; i++) {
        text += middle[i].slice(0, 1);
        middle[i] = middle[i].slice(1, middle[i].length);
      }
    } else {
      text += bottom.slice(0, 1);
      bottom = bottom.slice(1, bottom.length);
      for (let i = middle.length - 1; i >= 0; i--) {
        text += middle[i].slice(0, 1);
        middle[i] = middle[i].slice(1, middle[i].length);
      }
    }
    i++;
  }
  return text;
}
