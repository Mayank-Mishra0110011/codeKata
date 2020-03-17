const Interpreter = require("./main");

var interpreter = new Interpreter();
// Basic arithmetic
test(`Test 1`, () => {
  expect(interpreter.input("1 + 1")).toBe(2);
});
test(`Test 2`, () => {
  expect(interpreter.input("2 - 1")).toBe(1);
});
test(`Test 3`, () => {
  expect(interpreter.input("2 * 3")).toBe(6);
});
test(`Test 4`, () => {
  expect(interpreter.input("8 / 4")).toBe(2);
});
test(`Test 5`, () => {
  expect(interpreter.input("7 % 4")).toBe(3);
});

//Variables
test(`Test 6`, () => {
  expect(interpreter.input("x = 1")).toBe(1);
});
test(`Test 7`, () => {
  expect(interpreter.input("x")).toBe(1);
});
test(`Test 8`, () => {
  expect(interpreter.input("x + 3")).toBe(4);
});
test(`Test 9`, () => {
  expect(interpreter.input("y")).toBeInstanceOf(Error);
});
