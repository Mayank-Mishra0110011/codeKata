const Compiler = require("./main");

function simulate(asm, args) {
  var r0 = undefined;
  var r1 = undefined;
  var stack = [];
  asm.forEach(function(instruct) {
    var match = instruct.match(/(IM|AR)\s+(\d+)/) || [0, instruct, 0];
    var ins = match[1];
    var n = match[2] | 0;

    if (ins == "IM") {
      r0 = n;
    } else if (ins == "AR") {
      r0 = args[n];
    } else if (ins == "SW") {
      var tmp = r0;
      r0 = r1;
      r1 = tmp;
    } else if (ins == "PU") {
      stack.push(r0);
    } else if (ins == "PO") {
      r0 = stack.pop();
    } else if (ins == "AD") {
      r0 += r1;
    } else if (ins == "SU") {
      r0 -= r1;
    } else if (ins == "MU") {
      r0 *= r1;
    } else if (ins == "DI") {
      r0 /= r1;
    }
  });
  return r0;
}

var prog = "[ x y z ] ( 2*3*x + 5*y - 3*z ) / (1 + 3 + 2*2)";
var t1 = JSON.stringify({
  op: "/",
  a: {
    op: "-",
    a: {
      op: "+",
      a: {
        op: "*",
        a: { op: "*", a: { op: "imm", n: 2 }, b: { op: "imm", n: 3 } },
        b: { op: "arg", n: 0 }
      },
      b: { op: "*", a: { op: "imm", n: 5 }, b: { op: "arg", n: 1 } }
    },
    b: { op: "*", a: { op: "imm", n: 3 }, b: { op: "arg", n: 2 } }
  },
  b: {
    op: "+",
    a: { op: "+", a: { op: "imm", n: 1 }, b: { op: "imm", n: 3 } },
    b: { op: "*", a: { op: "imm", n: 2 }, b: { op: "imm", n: 2 } }
  }
});
var t2 = JSON.stringify({
  op: "/",
  a: {
    op: "-",
    a: {
      op: "+",
      a: { op: "*", a: { op: "imm", n: 6 }, b: { op: "arg", n: 0 } },
      b: { op: "*", a: { op: "imm", n: 5 }, b: { op: "arg", n: 1 } }
    },
    b: { op: "*", a: { op: "imm", n: 3 }, b: { op: "arg", n: 2 } }
  },
  b: { op: "imm", n: 8 }
});

var c = new Compiler();
test("Able to construct compiler", () => {
  expect(c);
});

var p1 = c.pass1(prog);
test("Pass1", () => {
  expect(JSON.stringify(p1) === t1);
});

var p2 = c.pass2(p1);
test("Pass2", () => {
  expect(JSON.stringify(p2) === t2);
});

var p3 = c.pass3(p2);
test("prog(4,0,0) == 3", () => {
  expect(simulate(p3, [4, 0, 0]) === 3);
});

test("prog(4,8,0) == 8", () => {
  expect(simulate(p3, [4, 8, 0]) === 8);
});

test("prog(4,8,6) == 2", () => {
  expect(simulate(p3, [4, 8, 16]) === 2);
});
