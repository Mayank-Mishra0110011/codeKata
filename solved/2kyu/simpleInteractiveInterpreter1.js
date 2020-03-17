function Interpreter() {
  this.vars = {};
  this.functions = {};
}

Interpreter.prototype.tokenize = function(program) {
  if (program === "") return [];
  var regex = /\s*([-+*\/\%=\(\)]|[A-Za-z_][A-Za-z0-9_]*|[0-9]*\.?[0-9]+)\s*/g;
  return program.split(regex).filter(function(s) {
    return !s.match(/^\s*$/);
  });
};

function hasGreaterOrEqualPrecedence(a, b) {
  if (a == b || b == "/" || b == "*" || b == "%") return true;
  return false;
}

function evalExpr(a, op, b) {
  switch (op) {
    case "+":
      return a + b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    case "-":
      return a - b;
    case "%":
      return a % b;
  }
}

function evaluate(tokens, vars) {
  const stack = [],
    output = [];
  tokens.forEach(token => {
    if (/[0-9]/.test(token)) {
      output.push(parseFloat(token));
    } else if (/[a-z]/.test(token)) {
      output.push(parseFloat(vars[token]));
    } else if (/\%|\+|-|\*|\//.test(token)) {
      while (
        hasGreaterOrEqualPrecedence(token, stack[stack.length - 1]) &&
        stack[stack.length - 1] != "("
      ) {
        let op = stack.pop();
        let a = output.pop();
        let b = output.pop();
        output.push(evalExpr(b, op, a));
      }
      stack.push(token);
    } else if (token == "(") {
      stack.push(token);
    } else if (token == ")") {
      while (stack[stack.length - 1] != "(") {
        let op = stack.pop();
        let a = output.pop();
        let b = output.pop();
        output.push(evalExpr(b, op, a));
      }
      if (stack[stack.length - 1] == "(") stack.pop();
    }
  });
  if (output.length == 1) {
    if (stack.length == 1) return -output[0];
    return output[0];
  }
  while (stack.length > 0) {
    let op = stack.pop();
    let a, b;
    if (op == "-" || op == "/" || op == "%") {
      a = output.shift();
      b = output.shift();
    } else {
      a = output.pop();
      b = output.pop();
    }
    output.unshift(evalExpr(a, op, b));
  }
  return output[0];
}

Interpreter.prototype.input = function(expr) {
  var tokens = this.tokenize(expr);
  if (tokens.length == 0) return "";
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    if (/[a-z]/.test(token)) {
      if (tokens.length == 1) {
        if (tokens[i + 1] != "=" && !Object.keys(this.vars).includes(token)) {
          throw new Error(
            `Invalid identifier. No variable with name '${token}' was found.`
          );
        }
        return this.vars[token];
      } else if (tokens[i + 1] == "=") {
        this.vars[tokens[i]] = evaluate(
          tokens.slice(i + 1, tokens.length),
          this.vars
        );
        return this.vars[tokens[i]];
      }
    } else {
      if (i > 0) return evaluate(tokens.slice(i - 1, tokens.length), this.vars);
      return evaluate(tokens.slice(i, tokens.length), this.vars);
    }
  }
};
