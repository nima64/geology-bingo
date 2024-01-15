"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class hostBot {
    constructor(game, callList) {
        this.game = game;
    }
    run(player, serverSock) {
        let playerAnswered = this.game.players.findIndex((v, i) => v.id == player.id);
        if (playerAnswered) {
            this.game.endRound();
        }
    }
}
//# sourceMappingURL=hostBot.js.map