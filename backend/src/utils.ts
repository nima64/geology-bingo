import { BoardItem, Player } from "./core/Player";

// // export export function scrableCallist(callist: [][]) {}
export function getPlayerById(players: Player[], id: string) {
  return players.find((x) => x.id == id);
}

// export function sendCurrentPlayerBoard(sockId: any, socket: any) {
//   let player: Player | undefined = getPlayerById(sockId);
//   if (!player)
//     throw new Error(`player with id ${sockId} not found in player list`);
//   socket.to(sockId).emit("update board", { board: getBoard(player) });
// }

enum gameStates {
  WAITING,
  PLAYING,
}

// const fillPlayerBoard = (player: Player, call_list: any, freeSpace: boolean) => {
//   call_list.map(([word, clue]: any, i: number) => {
//     //put free space in the middle, assumes call list size is 24
//     if (i == 12) {
//       player.boardp[["Free Space"] = 25;
//       player.board_qa["Free Space"] = false;
//       i = 25;
//     }

//     player.board_idx[word] = i;
//     player.board_qa[word] = false;
//   });
// // };

/** update client board with server board */
export const syncBoard = (io: any, player: Player) => {
  if ("VERBOSE")
    console.log(`syncing board for ${player.username} ${player.id} `);

  io.to(player.id).emit("sync_board", { board: player.board });
};

export const syncAllBoards = (io: any, players: Player[]) => {
  for (const player of players) {
    syncBoard(io, player);
  }
};

export function updateBoard(
  player: Player,
  question: string,
  answered: boolean
) {
  let idx = player.board.findIndex((item) => item.question == question);
  if (idx > -1) player.board[idx] = { question: question, answered: answered };
}

export function getBoardQuestions(player: Player): string[] {
  return player.board.flatMap((element: BoardItem) => element.question);
}

export function getBoardAnswers(player: Player): number[] {
  return player.board.flatMap((element: BoardItem) => Number(element.answered));
}

//gives 2d matrix of a 1d matrix
export const fmtMat = (vec: number[], matSize: number) => {
  let x = "";
  for (let i = 0; i < vec.length; i++) {
    x = x + " " + vec[i].toString();
    if ((i + 1) % matSize == 0) x = x + "\n";
  }
  return x;
};

export function hasBingo(player: Player, boardSize: number): boolean {
  let full_lr_diag = true;
  let full_rl_diag = true;
  let board = getBoardAnswers(player);

  for (let i = 0; i < boardSize; i++) {
    let full_row = true;
    let full_col = true;
    let k = boardSize - 1 - i;

    //mat[i][i] != 1
    if (Number(board[boardSize * i + i]) != 1) full_lr_diag = false;

    //mat[k][k] != 1
    if (Number(board[boardSize * k + k]) != 1) full_rl_diag = false;

    for (let j = 0; j < boardSize; j++) {
      //mat[i][j] != 1
      if (Number(board[boardSize * i + j]) != 1) full_row = false;

      //mat[j][i] != 1
      if (Number(board[boardSize * j + i]) != 1) full_col = false;
    }
    if (full_col || full_row) {
      return true;
    }
  }
  if (full_lr_diag || full_rl_diag) return true;

  return false;
}
