// export function sendCurrentPlayerBoard(sockId: any, socket: any) {
//   let player: Player | undefined = getPlayerById(sockId);
//   if (!player)
//     throw new Error(`player with id ${sockId} not found in player list`);
//   socket.to(sockId).emit("update board", { board: getBoard(player) });
// }
export interface BoardItem {
  question: string;
  answered: boolean;
}

export interface Player {
  id: string;
  board: BoardItem[]; // question answered
  username: string;
  board_size: number;
}

//Free space then added to the middle of the board
export const fillPlayerBoard = (
  player: Player,
  callList: string[][],
  freeSpace: boolean
) => {
  let boardMiddle = Math.floor(player.board_size ** 2 / 2);
  let canInsertFreeSpace =
    freeSpace && callList.length < player.board_size ** 2;

  for (let i = 0; i < callList.length; i++) {
    if (canInsertFreeSpace && i == boardMiddle) {
      player.board[boardMiddle] = { question: "Free Space", answered: false };
      continue;
    }

    let [word, clue] = callList[i];
    player.board[i] = { question: word, answered: false };
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

// // export export function scrableCallist(callist: [][]) {}
export function getPlayerById(players: Player[], id: string) {
  return players.find((x) => x.id == id);
}
