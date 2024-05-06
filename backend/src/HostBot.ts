import { GameLogic } from "./GameLogic";
import { Player } from "./Player";

/** update client board with server board */
const syncBoard = (io: any, player: Player) => {
  if ("VERBOSE")
    console.log(`syncing board for ${player.username} ${player.id} `);

  io.to(player.id).emit("sync_board", { board: player.board });
};

const syncAllBoards = (io: any, players: Player[]) => {
  for (const player of players) {
    syncBoard(io, player);
  }
};

class CallListPicker {
  callListRef: string[][];
  callList: string[][];

  constructor(callList: string[][]) {
    this.callListRef = callList;
    this.callList = JSON.parse(JSON.stringify(callList));
  }

  //picks a clue&word from callist then removes it from the list
  pick(): string[] {
    let i = Math.floor(Math.random() * this.callList.length);
    if (this.callList.length > 0) return this.callList.splice(i, 1)[0];
    return [];
  }
}

export default class HostBot {
  game: GameLogic;
  // callList: string[][];
  roundAnswer: string;
  roundClue: string;
  clp: CallListPicker;
  server: any;

  constructor(game: GameLogic, callList: string[][], server: any) {
    this.game = game;
    this.clp = new CallListPicker(callList);
    this.server = server;
    this.run = this.run.bind(this);

    [this.roundAnswer, this.roundClue] = this.clp.pick();
    console.log("Hostbot starting round");
    this.game.startRound(this.roundClue, this.roundAnswer);
  }

  run() {
    if (this.game.answerStack.length > 0) {
      let guessedCorrect = this.game.endRound();
      let i = Math.floor(Math.random() * 24);
      if (guessedCorrect) {
        console.log(`nima correctly guessed ${this.roundAnswer}`);
        [this.roundAnswer, this.roundClue] = this.clp.pick();

        console.log("Host bot starting round");
        this.game.startRound(this.roundClue, this.roundAnswer);
      }
    }
    syncAllBoards(this.server, this.game.players);
  }
}
