"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBingo = exports.fmtMat = exports.getBoardAnswers = exports.getBoardQuestions = exports.updateBoard = exports.getPlayerById = void 0;
// // export export function scrableCallist(callist: [][]) {}
function getPlayerById(players, id) {
    return players.find((x) => x.id == id);
}
exports.getPlayerById = getPlayerById;
// export function sendCurrentPlayerBoard(sockId: any, socket: any) {
//   let player: Player | undefined = getPlayerById(sockId);
//   if (!player)
//     throw new Error(`player with id ${sockId} not found in player list`);
//   socket.to(sockId).emit("update board", { board: getBoard(player) });
// }
var gameStates;
(function (gameStates) {
    gameStates[gameStates["WAITING"] = 0] = "WAITING";
    gameStates[gameStates["PLAYING"] = 1] = "PLAYING";
})(gameStates || (gameStates = {}));
// const fillPlayerBoard = (player: Player, call_list: any, freeSpace: boolean) => {
//   call_list.map(([word, clue]: any, i: number) => {
//     //put free space in the middle, assumes call list size is 24
//     if (i == 12) {
//       player.boardp[["Free Space"] = 25;
//       player.board_qa["Free Space"] = false;
//       i = 25;
//     }
//     player.board_idx[word] = i;
//     player.board_qa[word] = false;
//   });
// // };
function updateBoard(player, question, answered) {
    let idx = player.board.findIndex((item) => item.question == question);
    if (idx > -1)
        player.board[idx] = { question: question, answered: answered };
}
exports.updateBoard = updateBoard;
function getBoardQuestions(player) {
    return player.board.flatMap((element) => element.question);
}
exports.getBoardQuestions = getBoardQuestions;
function getBoardAnswers(player) {
    return player.board.flatMap((element) => Number(element.answered));
}
exports.getBoardAnswers = getBoardAnswers;
//gives 2d matrix of a 1d matrix
const fmtMat = (vec, matSize) => {
    let x = "";
    for (let i = 0; i < vec.length; i++) {
        x = x + " " + vec[i].toString();
        if ((i + 1) % matSize == 0)
            x = x + "\n";
    }
    return x;
};
exports.fmtMat = fmtMat;
function hasBingo(player, boardSize) {
    let full_lr_diag = true;
    let full_rl_diag = true;
    let board = getBoardAnswers(player);
    for (let i = 0; i < boardSize; i++) {
        let full_row = true;
        let full_col = true;
        let k = boardSize - 1 - i;
        //mat[i][i] != 1
        if (Number(board[boardSize * i + i]) != 1)
            full_lr_diag = false;
        //mat[k][k] != 1
        if (Number(board[boardSize * k + k]) != 1)
            full_rl_diag = false;
        for (let j = 0; j < boardSize; j++) {
            //mat[i][j] != 1
            if (Number(board[boardSize * i + j]) != 1)
                full_row = false;
            //mat[j][i] != 1
            if (Number(board[boardSize * j + i]) != 1)
                full_col = false;
        }
        if (full_col || full_row) {
            return true;
        }
    }
    if (full_lr_diag || full_rl_diag)
        return true;
    return false;
}
exports.hasBingo = hasBingo;
//# sourceMappingURL=utils.js.map