class AST {
  constructor() {
    this.root = {};
    this.tempPtr = null;
    this.parenthesesBalanced = true;
  }
  parenthesesOpen() {
    this.tempPtr = this.root;
    this.root = new AST();
    this.parenthesesBalanced = false;
  }
  parenthesesClose() {
    if (this.root.tempPtr) {
      this.root.root = this.root.tempPtr;
    }
    if (!this.tempPtr.a) {
      this.tempPtr.a = this.root.root;
    } else if (!this.tempPtr.b) {
      this.tempPtr.b = this.root.root;
    }
    this.root = this.tempPtr;
    this.tempPtr = null;
    this.parenthesesBalanced = true;
  }
  insertOperator(operator) {
    if (!this.parenthesesBalanced) {
      this.root.insertOperator(operator);
    } else {
      if (!this.root.op) {
        this.root.op = operator;
      } else {
        if (hasGreaterPrecedence(operator, this.root.op)) {
          this.root.b = { op: operator, a: this.root.b };
          this.tempPtr = this.root;
          this.root = this.root.b;
        } else {
          if (!hasEqualPrecedence(operator, this.root.op) && this.tempPtr) {
            this.tempPtr.b = this.root;
            this.root = this.tempPtr;
            this.tempPtr = null;
          }
          this.root = {
            op: operator,
            a: this.root
          };
        }
      }
    }
  }
  insertOperand(operandType, operand) {
    if (!this.parenthesesBalanced) {
      this.root.insertOperand(operandType, operand);
    } else {
      if (!this.root.a) {
        this.root.a = {
          op: operandType,
          n: operand
        };
      } else if (!this.root.b) {
        this.root.b = {
          op: operandType,
          n: operand
        };
      }
    }
  }
}

function setOrder(root) {
  if (root.op && root.a && root.b) {
    root = {
      op: root.op,
      a: root.a,
      b: root.b
    };
    root.a = setOrder(root.a);
    root.b = setOrder(root.b);
  }
  return root;
}

function reduceConst(root) {
  if (root.a && root.b) {
    if (root.a.op === "imm" && root.b.op === "imm") {
      let value;
      switch (root.op) {
        case "+":
          value = root.a.n + root.b.n;
          break;
        case "-":
          value = root.a.n - root.b.n;
          break;
        case "*":
          value = root.a.n * root.b.n;
          break;
        case "/":
          value = root.a.n / root.b.n;
          break;
      }
      root = { op: "imm", n: value };
    } else {
      root.a = reduceConst(root.a);
      root.b = reduceConst(root.b);
      if (root.a.op == "imm" && root.b.op == "imm") root = reduceConst(root);
    }
  }
  return root;
}

function assemblyInstructions(root, instr = []) {
  if (root.a) assemblyInstructions(root.a, instr);
  if (root.b) assemblyInstructions(root.b, instr);
  if (root.op == "imm") {
    instr.push(`IM ${root.n}`);
    instr.push("PU");
  } else if (root.op == "arg") {
    instr.push(`AR ${root.n}`);
    instr.push("PU");
  }
  if (/\+|-|\*|\//.test(root.op)) {
    instr.push("PO");
    instr.push("SW");
    instr.push("PO");
    if (root.op == "+") {
      instr.push("AD");
    } else if (root.op == "-") {
      instr.push("SU");
    } else if (root.op == "*") {
      instr.push("MU");
    } else if (root.op == "/") {
      instr.push("DI");
    }
    instr.push("PU");
  }
}

function hasEqualPrecedence(a, b) {
  if (
    a == b ||
    (a == "*" && b == "/") ||
    (a == "/" && b == "*") ||
    (a == "+" && b == "-") ||
    (a == "-" && b == "+")
  )
    return true;
  return false;
}

function hasGreaterPrecedence(a, b) {
  if ((b == "+" || b == "-") && (a == "*" || a == "/")) return true;
  return false;
}

function Compiler() {
  this.argList = [];
}

Compiler.prototype.compile = function(program) {
  return this.pass3(this.pass2(this.pass1(program)));
};

Compiler.prototype.tokenize = function(program) {
  var regex = /\s*([-+*/\(\)\[\]]|[A-Za-z]+|[0-9]+)\s*/g;
  return program
    .replace(regex, ":$1")
    .substring(1)
    .split(":")
    .map(function(tok) {
      return isNaN(tok) ? tok : tok | 0;
    });
};

Compiler.prototype.pass1 = function(program) {
  var tokens = this.tokenize(program);
  const ast = new AST();
  tokens.forEach(token => {
    if (/[a-z]/.test(token)) {
      if (this.argList.includes("[")) {
        this.argList.push(token);
      } else {
        ast.insertOperand("arg", this.argList.indexOf(token));
      }
    } else if (/[0-9]/.test(token)) {
      ast.insertOperand("imm", token);
    } else if (/\+|-|\*|\//.test(token)) {
      ast.insertOperator(token);
    } else if (/\[/.test(token)) {
      this.argList.push(token);
    } else if (/\]/.test(token)) {
      this.argList.shift();
    } else if (/\(/.test(token)) {
      ast.parenthesesOpen();
    } else if (/\)/.test(token)) {
      ast.parenthesesClose();
    }
  });
  if (ast.tempPtr) {
    ast.tempPtr.b = ast.root;
    ast.root = ast.tempPtr;
    ast.tempPtr = null;
  }
  ast.root = setOrder(ast.root);
  this.argList = [];
  return ast.root;
};

Compiler.prototype.pass2 = function(ast) {
  return reduceConst(JSON.parse(JSON.stringify(ast)));
};

Compiler.prototype.pass3 = function(ast) {
  const asm = [];
  assemblyInstructions(ast, asm);
  asm.push("PO");
  return asm;
};
