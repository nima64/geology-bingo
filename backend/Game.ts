import { Player } from "./utils";

let curr_round_clue =
  "The portion of the Earth composed primarily of iron and believed to be in a solid state.";

let curr_round_answer = "Antarctic Circle";

enum GAME_STATE {
  WAITING,
  PLAYING,
}

export class Game {
  currenState = GAME_STATE.WAITING;
  players: Player[] = [];
  constructor() {}
}
