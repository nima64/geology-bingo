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
  board_size: number;
}

const fillPlayerBoard = (player: any, callList: any, freeSpace: boolean) => {
  callList.map(([word, clue]: any, i: number) => {
    //put free space in the middle, assumes call list size is 24
    if (i == 12) {
      player.board_idx["Free Space"] = 25;
      player.board_qa["Free Space"] = false;
      i = 25;
    }

    player.board_idx[word] = i;
    player.board_qa[word] = false;
  });
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
