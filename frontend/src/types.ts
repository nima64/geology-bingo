export interface Player {
  id: string;
  board: BoardItem[]; // question answered
  username: string;
  board_size: number;
}

export interface BoardItem {
  question: string;
  answered: boolean;
}
