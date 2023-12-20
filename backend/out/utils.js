"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameStates =
  exports.fmtMat =
  exports.getBoard =
  exports.hasBingo =
    void 0;
var gameStates;
(function (gameStates) {
  gameStates[(gameStates["WAITING"] = 0)] = "WAITING";
  gameStates[(gameStates["PLAYING"] = 1)] = "PLAYING";
})(gameStates || (exports.gameStates = gameStates = {}));
//gives 2d matrix of a 1d matrix
const fmtMat = (vec, matSize) => {
  let x = "";
  for (let i = 0; i < vec.length; i++) {
    x = x + " " + vec[i].toString();
    if ((i + 1) % matSize == 0) x = x + "\n";
  }
  return x;
};
exports.fmtMat = fmtMat;
function getBoard(player) {
  let board = [];
  Object.keys(player.board_idx).map((k) => {
    let idx = player.board_idx[k];
    let board_val = player.board_qa[k];
    board[idx] = board_val ? 1 : 0;
  });
  return board;
}
exports.getBoard = getBoard;
function hasBingo(player, boardSize) {
  let full_lr_diag = true;
  let full_rl_diag = true;
  let board = getBoard(player);
  for (let i = 0; i < boardSize; i++) {
    let full_row = true;
    let full_col = true;
    let k = boardSize - 1 - i;
    //mat[i][i] != 1
    if (board[boardSize * i + i] != 1) full_lr_diag = false;
    //mat[k][k] != 1
    if (board[boardSize * k + k] != 1) full_rl_diag = false;
    for (let j = 0; j < boardSize; j++) {
      //mat[i][j] != 1
      if (board[boardSize * i + j] != 1) full_row = false;
      //mat[j][i] != 1
      if (board[boardSize * j + i] != 1) full_col = false;
    }
    if (full_col || full_row) {
      return true;
    }
  }
  if (full_lr_diag || full_rl_diag) return true;
  return false;
}
exports.hasBingo = hasBingo;
//# sourceMappingURL=utils.js.map
