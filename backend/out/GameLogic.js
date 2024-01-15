"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLogic = void 0;
const Player_1 = require("./Player");
const utils_1 = require("./utils");
var GAME_STATE;
(function (GAME_STATE) {
    GAME_STATE[GAME_STATE["WAITING"] = 0] = "WAITING";
    GAME_STATE[GAME_STATE["PLAYING"] = 1] = "PLAYING";
    GAME_STATE[GAME_STATE["ENDED"] = 2] = "ENDED";
})(GAME_STATE || (GAME_STATE = {}));
class GameLogic {
    constructor() {
        this.gmState = GAME_STATE.WAITING;
        this.players = [];
        this.answerStack = [];
        this.roundCounter = 0;
        //[id, answer]
        this.roundClue = "The portion of the Earth composed primarily of iron and believed to be in a solid state.";
        this.roundAnswer = "Antarctic Circle";
    }
    // constructor(players: Player[]) {
    //   // players = players;
    // }
    addPlayer(player) {
        this.players.push(player);
    }
    removePlayer(player) {
        let idx = this.players.findIndex((v, k) => v.id == player.id);
        if (idx > 0)
            this.players.splice(idx, 1);
    }
    startRound(clue, answer) {
        console.log(`starting round ${this.roundCounter} clue: ${clue}, answer:${answer}`);
        if (this.gmState == GAME_STATE.WAITING) {
            this.gmState = GAME_STATE.PLAYING;
        }
        this.roundClue = clue;
        this.roundAnswer = answer;
    }
    submitAnswer(answer, id) {
        for (const answer of this.answerStack) {
            let [id, p_answer] = answer;
            let p_found = this.players.find((p) => p.id == id);
            //answer already on the stack
            if (p_found) {
                console.log(`${p_found.username} already answered ${p_answer} this round`);
                return;
            }
        }
        console.log(`player ${id} answered ${answer}`);
        this.answerStack.push([id, answer]);
    }
    //updates answers on the player boards if they were correct
    // also returns true if anwer was correctly guessed
    endRound() {
        //Todo: move to into Game Object
        this.roundCounter += 1;
        while (this.answerStack.length > 0) {
            let top = this.answerStack.pop();
            if (!top)
                continue;
            let [top_id, top_answer] = top;
            let player = (0, utils_1.getPlayerById)(this.players, top_id);
            if (!player)
                continue;
            if (player && top_answer == this.roundAnswer) {
                console.log(`player ${player.username} guessed correct`);
                (0, Player_1.updateBoard)(player, top_answer, true);
                console.log(`${player.username}'s board \n${(0, utils_1.fmtMat)((0, utils_1.getBoardAnswers)(player), player.board_size)}`);
                if ((0, utils_1.hasBingo)(player, player.board_size)) {
                    console.log(`congrats player ${player.username} won`);
                    this.gmState = GAME_STATE.WAITING;
                    break;
                }
                return true;
            }
        }
        return false;
    }
}
exports.GameLogic = GameLogic;
//# sourceMappingURL=GameLogic.js.map