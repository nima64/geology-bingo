enum gameS {
  WAITING,
  PLAYING,
}

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

let gameState = gameS.WAITING;
type Players = Record<string, Array<number>>;

// let Game:any = {
//   players:{},
//   state: gameS.WAITING
// };

// let playerCount = 0;

let players: Players = {};

// ["a", "b", "c", "d"].map((p) => {
//   players[p] = Array<number>(25).fill(0);
//   Game.players[p] = Array<number>(25).fill(0);
// });

function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function simulateGuesses(players: Players, maxNum: number): [string, number][] {
  let answer_stack: [string, number][] = [];
  let players_names = Object.entries(players).map(([k, v]) => k);
  shuffleArray(players_names);

  players_names.map((name) => {
    const guess = Math.floor(Math.random() * maxNum);
    answer_stack.push([name, guess]);
  });

  return answer_stack;
}

//gives 2d matrix of a 1d matrix
const fmtMat = (vec: number[] | boolean[], matSize: number) => {
  let x = "";
  for (let i = 0; i < vec.length; i++) {
    x = x + " " + vec[i].toString();
    if ((i + 1) % matSize == 0) x = x + "\n";
  }
  return x;
};

function round() {
  const answer = Math.floor(Math.random() * 7);
  const answer_idx = Math.floor(Math.random() * 25);
  let guess_stack = simulateGuesses(players, 7);
  // console.log(answer);
  // console.log(guess_stack);
  while (guess_stack.length > 0) {
    const g = guess_stack.pop();
    if (g != undefined && answer == g[1]) {
      //mark tile on their bingo board
      let [p_name, p_board] = [g[0], players[g[0]]];
      p_board[answer_idx] = 1;
      if (hasBingo(p_board, 5)) {
        console.log(`${p_name} has bingo`);
        console.log(fmtMat(p_board, 5));
        return p_name;
      }
    }
  }
  return 0;
}

function hasBingo(board: number[], boardSize: number) {
  let full_lr_diag = true;
  let full_rl_diag = true;
  for (let i = 0; i < boardSize; i++) {
    let full_row = true;
    let full_col = true;
    let k = boardSize - 1 - i;

    //mat[i][i] != 1
    if (board[boardSize * i + i] != 1) full_lr_diag = false;

    //mat[k][k] != 1
    if (board[boardSize * k + k] != 1) full_rl_diag = false;

    for (let j = 0; j < boardSize; j++) {
      //mat[i][j] != 1
      if (board[boardSize * i + j] != 1) full_row = false;

      //mat[j][i] != 1
      if (board[boardSize * j + i] != 1) full_col = false;
    }
    if (full_col || full_row) {
      return true;
    }
  }
  if (full_lr_diag || full_rl_diag) return true;

  return false;
}

// function game() {
//   console.log("hellworold");
//   Game.gameState = gameS.PLAYING;
//   for (let i = 0; i < 200; i++) {
//     let winner = round();
//     if (winner != 0) {
//       Game.gameState = gameS.WAITING;
//       // console.log(`player ${winner} won!`);
//       console.log(Game.gameState);
//       break;
//     }
//   }
//   console.log("waiting for players to join room");
// }

// game();

module.exports = hasBingo;
