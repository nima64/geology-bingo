const hasbingo = require("../out/game.js");

let lr_diag = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
];

test("left-right diag should be true", () => {
  expect(hasbingo(lr_diag, 5)).toBe(true);
});

let rl_diag = [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0, 
    0, 0, 1, 0, 0, 
    0, 0, 0, 1, 0,
    0, 0, 0, 0, 1,
];

test("righ-left diag should be true", () => {
  expect(hasbingo(lr_diag, 5)).toBe(true);
});

let full_col = [
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0, 
    0, 0, 1, 0, 0, 
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
];

test("full col should be true", () => {
  expect(hasbingo(full_col, 5)).toBe(true);
});

let full_row = [
    0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 
    0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
];
test("full row should be true", () => {
  expect(hasbingo(full_col, 5)).toBe(true);
});

let mat = [
  1,1,0,0,0,
  1,1,1,1,1,
  1,1,1,1,1,
  1,1,1,0,1,
  1,1,1,1,1,
]

test("full mat should be true", () => {
  expect(hasbingo(mat, 5)).toBe(true);
});