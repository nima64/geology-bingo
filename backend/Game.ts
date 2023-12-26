import { Player } from "./Player";
import { fmtMat, getBoardAnswers, getPlayerById, hasBingo } from "./utils";

let curr_round_clue =
  "The portion of the Earth composed primarily of iron and believed to be in a solid state.";

let curr_round_answer = "Antarctic Circle";

enum GAME_STATE {
  WAITING,
  PLAYING,
}
// type Srv = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
// type Sock = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export class Game {
  gmState = GAME_STATE.WAITING;
  players: Player[] = [];
  answer_stack: [string, string][] = [];
  //[id, answer]
  answerStack: [string, string][] = [];

  // constructor(players: Player[]) {
  //   // players = players;
  // }
  addPlayer(player: Player) {
    this.players.push(player);
  }

  startRound(clue: string) {
    if (this.gmState == GAME_STATE.WAITING) {
      this.gmState = GAME_STATE.PLAYING;
    }

    curr_round_clue = clue;
  }

  submitAnswer(answer: string, id: string) {
    for (const answer of this.answer_stack) {
      let [id, p_answer] = answer;
      let p_found = this.players.find((p) => p.id == id);

      //answer already on the stack
      if (p_found) {
        console.log(
          `${p_found.username} already answered ${p_answer} this round`
        );
        return;
      }
    }
    console.log(`player ${id} answered ${answer}`);
    this.answer_stack.push([id, answer]);
  }

  endRound(serverSock: any, answer: string) {
    //Todo: move to into Game Object
    while (this.answer_stack.length > 0) {
      let top = this.answer_stack.pop();
      if (!top) continue;

      let [top_id, top_answer] = top;
      let player = getPlayerById(this.players, top_id);

      if (!player) continue;

      if (player && top_answer == curr_round_answer) {
        console.log(`player ${player.username} guessed correct`);

        console.log(
          `${player.username}'s board \n${fmtMat(
            getBoardAnswers(player),
            player.board_size
          )}`
        );

        if (hasBingo(player, player.board_size)) {
          console.log(`congrats player ${player.username} won`);
          break;
        }
      }
    }
  }
}
