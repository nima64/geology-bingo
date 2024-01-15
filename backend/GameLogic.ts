import { Player, updateBoard } from "./Player";
import { fmtMat, getBoardAnswers, getPlayerById, hasBingo } from "./utils";

enum GAME_STATE {
  WAITING,
  PLAYING,
  ENDED,
}

export class GameLogic {
  gmState = GAME_STATE.WAITING;
  players: Player[] = [];
  answerStack: [string, string][] = [];
  roundCounter = 0;
  //[id, answer]
  roundClue =
    "The portion of the Earth composed primarily of iron and believed to be in a solid state.";

  roundAnswer = "Antarctic Circle";

  // constructor(players: Player[]) {
  //   // players = players;
  // }
  addPlayer(player: Player) {
    this.players.push(player);
  }

  removePlayer(player: Player) {
    let idx = this.players.findIndex((v, k) => v.id == player.id);
    if (idx > 0) this.players.splice(idx, 1);
  }

  startRound(clue: string, answer: string) {
    console.log(
      `starting round ${this.roundCounter} clue: ${clue}, answer:${answer}`
    );
    if (this.gmState == GAME_STATE.WAITING) {
      this.gmState = GAME_STATE.PLAYING;
    }

    this.roundClue = clue;
    this.roundAnswer = answer;
  }

  submitAnswer(answer: string, id: string) {
    for (const answer of this.answerStack) {
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
    this.answerStack.push([id, answer]);
  }

  //updates answers on the player boards if they were correct
  // also returns true if anwer was correctly guessed
  endRound() {
    //Todo: move to into Game Object
    this.roundCounter += 1;
    while (this.answerStack.length > 0) {
      let top = this.answerStack.pop();
      if (!top) continue;

      let [top_id, top_answer] = top;
      let player = getPlayerById(this.players, top_id);

      if (!player) continue;

      if (player && top_answer == this.roundAnswer) {
        console.log(`player ${player.username} guessed correct`);

        updateBoard(player, top_answer, true);

        console.log(
          `${player.username}'s board \n${fmtMat(
            getBoardAnswers(player),
            player.board_size
          )}`
        );

        if (hasBingo(player, player.board_size)) {
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
