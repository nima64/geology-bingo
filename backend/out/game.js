"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const utils_1 = require("./utils");
let curr_round_clue = "The portion of the Earth composed primarily of iron and believed to be in a solid state.";
let curr_round_answer = "Antarctic Circle";
var GAME_STATE;
(function (GAME_STATE) {
    GAME_STATE[GAME_STATE["WAITING"] = 0] = "WAITING";
    GAME_STATE[GAME_STATE["PLAYING"] = 1] = "PLAYING";
})(GAME_STATE || (GAME_STATE = {}));
// type Srv = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
// type Sock = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
class Game {
    constructor(players) {
        this.gmState = GAME_STATE.WAITING;
        this.players = [];
        this.answer_stack = [];
        //[id, answer]
        this.answerStack = [];
        players = players;
    }
    startRound(clue) {
        if (this.gmState == GAME_STATE.WAITING) {
            this.gmState = GAME_STATE.PLAYING;
        }
        curr_round_clue = clue;
    }
    submitAnswer(answer, id) {
        for (const answer of this.answer_stack) {
            let [id, p_answer] = answer;
            let p_found = this.players.find((p) => p.id == id);
            //answer already on the stack
            if (p_found) {
                console.log(`${p_found.username} already answered ${p_answer} this round`);
                return;
            }
        }
        console.log(`player ${id} answered ${answer}`);
        this.answer_stack.push([id, answer]);
    }
    endRound(serverSock, answer) {
        //Todo: move to into Game Object
        while (this.answer_stack.length > 0) {
            let top = this.answer_stack.pop();
            if (!top)
                continue;
            let [top_id, top_answer] = top;
            let player = (0, utils_1.getPlayerById)(this.players, top_id);
            if (!player)
                continue;
            if (player && top_answer == curr_round_answer) {
                console.log(`player ${player.username} guessed correct`);
                console.log(`${player.username}'s board \n${(0, utils_1.fmtMat)((0, utils_1.getBoardAnswers)(player), player.board_size)}`);
                if ((0, utils_1.hasBingo)(player, player.board_size)) {
                    console.log(`congrats player ${player.username} won`);
                    break;
                }
            }
        }
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map