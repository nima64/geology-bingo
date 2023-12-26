"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerById = exports.getBoardAnswers = exports.getBoardQuestions = exports.updateBoard = exports.fillPlayerBoard = void 0;
//Free space then added to the middle of the board
const fillPlayerBoard = (player, callList, freeSpace) => {
    let boardMiddle = Math.floor(player.board_size ** 2 / 2);
    let canInsertFreeSpace = freeSpace && callList.length < player.board_size ** 2;
    let j = 0;
    for (let i = 0; i < player.board_size ** 2; i++) {
        if (canInsertFreeSpace && i == boardMiddle) {
            player.board[i] = { question: "Free Space", answered: false };
            continue;
        }
        let [word, clue] = callList[j];
        player.board[i] = { question: word, answered: false };
        j++;
    }
};
exports.fillPlayerBoard = fillPlayerBoard;
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
// // export export function scrableCallist(callist: [][]) {}
function getPlayerById(players, id) {
    return players.find((x) => x.id == id);
}
exports.getPlayerById = getPlayerById;
//# sourceMappingURL=Player.js.map