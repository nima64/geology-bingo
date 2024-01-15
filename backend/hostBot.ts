import { GameLogic } from "./GameLogic";
import { Player } from "./Player";

class hostBot {
  game: GameLogic;
  constructor(game: GameLogic, callList: string[]) {
    this.game = game;
  }
  run(player: Player, serverSock: any) {
    let playerAnswered = this.game.players.findIndex(
      (v, i) => v.id == player.id
    );

    if (playerAnswered) {
      this.game.endRound();
    }
  }
}
