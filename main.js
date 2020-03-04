function hasGreaterPrecedence(a, b) {
  if ((b == "+" || b == "-") && (a == "*" || a == "/")) return true;
  return false;
}

function Compiler() {
  this.argList = [];
  this.insertToken = (token, AST) => {
    let nodeA, nodeB;
    if (/[a-z]/.test(token)) {
      if (AST["a"] && AST["b"]) {
        nodeA = AST["a"];
        nodeB = AST["b"];
        if (!nodeA["n"]) {
          if (!nodeA["a"]) {
            nodeA["a"] = { op: "arg", n: this.argList.indexOf(token) };
            return AST;
          } else if (!nodeA["b"]) {
            nodeA["b"] = { op: "arg", n: this.argList.indexOf(token) };
            return AST;
          }
        }
        if (!nodeB["n"]) {
          if (!nodeB["a"]) {
            nodeB["a"] = { op: "arg", n: this.argList.indexOf(token) };
            return AST;
          } else if (!nodeB["b"]) {
            nodeB["b"] = { op: "arg", n: this.argList.indexOf(token) };
            return AST;
          }
        }
        AST = { a: AST };
      } else if (!AST["a"]) {
        AST["a"] = { op: "arg", n: this.argList.indexOf(token) };
      } else if (!AST["b"]) {
        AST["b"] = { op: "arg", n: this.argList.indexOf(token) };
      }
    } else if (/[0-9]/.test(token)) {
      if (AST["a"] && AST["b"]) {
        nodeA = AST["a"];
        nodeB = AST["b"];
        if (!nodeA["n"]) {
          if (!nodeA["a"]) {
            nodeA["a"] = { op: "imm", n: token };
            return AST;
          } else if (!nodeA["b"]) {
            nodeA["b"] = { op: "imm", n: token };
            return AST;
          }
        }
        if (!nodeB["n"]) {
          if (!nodeB["a"]) {
            nodeB["a"] = { op: "imm", n: token };
            return AST;
          } else if (!nodeB["b"]) {
            nodeB["b"] = { op: "imm", n: token };
            return AST;
          }
        }
        AST = { a: AST };
      } else if (!AST["a"]) {
        AST["a"] = { op: "imm", n: token };
      } else if (!AST["b"]) {
        AST["b"] = { op: "imm", n: token };
      }
    } else if (/\+|-|\*|\//.test(token)) {
      if (AST["op"]) {
        nodeA = AST["a"];
        nodeB = AST["b"];
        if (!nodeA["op"]) {
          nodeA["op"] = token;
        } else if (!nodeB["op"]) {
          nodeB["op"] = token;
        } else {
          if (hasGreaterPrecedence(token, AST["op"])) {
            if (nodeA["n"]) {
              AST["a"] = {
                op: token,
                a: nodeA
              };
            } else if (nodeB["n"]) {
              AST["b"] = {
                op: token,
                a: nodeB
              };
            } else {
              AST = { op: token, a: AST };
            }
          } else {
            AST = {
              op: token,
              a: AST
            };
          }
        }
      } else {
        AST["op"] = token;
      }
    }
    return AST;
  };
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
  let AST = {},
    head;
  tokens.forEach(token => {
    if (/[a-z]/.test(token)) {
      if (this.argList.includes("[")) {
        this.argList.push(token);
      } else {
        AST = this.insertToken(token, AST);
      }
    } else if (/[0-9]/.test(token)) {
      AST = this.insertToken(token, AST);
    } else if (/\+|-|\*|\//.test(token)) {
      AST = this.insertToken(token, AST);
    } else if (/\[/.test(token)) {
      this.argList.push(token);
    } else if (/\]/.test(token)) {
      this.argList.shift();
    } else if (/\(/.test(token)) {
      if (Object.keys(AST).length != 0) {
        AST.b = {};
        head = AST;
        AST = AST.b;
      }
    } else if (/\)/.test(token)) {
      if (head) {
        head.b = AST;
        AST = head;
      }
    }
  });
  return AST;
};

Compiler.prototype.pass2 = function(ast) {
  // return AST with constant expressions reduced
};

Compiler.prototype.pass3 = function(ast) {
  // return assembly instructions
};

const t1 = Date.now();
const c = new Compiler();
// var prog = "[ x y z ] ( 2*3*x + 5*y - 3*z ) / (1 + 3 + 2*2)";
var prog2 = "[ x y ] ( x + y ) / 2";
console.log(c.pass1(prog2));
const t2 = Date.now();
let exTime;
if (t2 - t1 > 1000) {
  exTime = (t2 - t1) / 1000 + "s";
} else {
  exTime = t2 - t1 + "ms";
}
console.log(`Execution Finished in ${exTime}`);

module.exports = Compiler;
