function hasGreaterOrEqualPrecedence(a, b) {
  if (a == b || b == "/" || b == "*") return true;
  return false;
}

function evaluate(a, op, b) {
  switch (op) {
    case "+":
      return a + b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    case "-":
      return a - b;
  }
}

var calc = function(expression) {
  const stack = [],
    output = [];
  const tokens = expression
    .split("(")
    .join(" ( ")
    .split(")")
    .join(" ) ")
    .split("+")
    .join(" + ")
    .split("-")
    .join(" -")
    .split("*")
    .join(" * ")
    .split("/")
    .join(" / ")
    .split(" ")
    .filter(chr => chr != "");
  for (let i = 0; i < tokens.length; i++) {
    if (i < tokens.length - 1) {
      let a = parseFloat(tokens[i]);
      let b = parseFloat(tokens[i + 1]);
      if (
        typeof a == "number" &&
        typeof b == "number" &&
        !isNaN(a) & !isNaN(b)
      ) {
        tokens.splice(i + 1, 0, "+");
      }
    }
  }
  tokens.forEach((token, i, arr) => {
    if (/[0-9]/.test(token)) {
      output.push(parseFloat(token));
    } else if (/\+|-|\*|\//.test(token)) {
      if (
        i < arr.length - 1 &&
        i > 0 &&
        /\(|\+|-|\*|\//.test(arr[i - 1]) &&
        /\(|\+|-|\*|\//.test(arr[i + 1])
      ) {
        stack.push("~");
        return;
      }
      while (
        hasGreaterOrEqualPrecedence(token, stack[stack.length - 1]) &&
        stack[stack.length - 1] != "("
      ) {
        let op = stack.pop();
        let a = output.pop();
        let b = output.pop();
        output.push(evaluate(b, op, a));
      }
      stack.push(token);
    } else if (token == "(") {
      stack.push(token);
    } else if (token == ")") {
      while (stack[stack.length - 1] != "(") {
        let op = stack.pop();
        let a = output.pop();
        let b = output.pop();
        output.push(evaluate(b, op, a));
      }
      if (stack[stack.length - 1] == "(") stack.pop();
      if (stack[stack.length - 1] == "~") {
        stack.pop();
        output.push(output.pop() * -1);
      }
    }
  });
  if (output.length == 1) {
    if (stack.length == 1) return -output[0];
    return output[0];
  }
  while (stack.length > 0) {
    let op = stack.shift();
    let a = output.shift();
    let b = output.shift();
    output.unshift(evaluate(a, op, b));
  }
  return output[0];
};
