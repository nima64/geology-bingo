let calllist = [
  ["oceanic", "the heavier, denser, basaltic crust."],
  [
    "asthenosphere",
    "This is where slow, convective currents occur and is  believed to be the engine that drives Plate Tectonics.",
  ],
  [
    "inner core,,",
    "The portion of the Earth composed primarily of iron and believed to be in a solid state.",
  ],
  [
    "Mohorovocic Discontinuity",
    "This separates the uppermost mantle from the crust.",
  ],
  ["continental", "The lighter, less dense, granitic crust."],
  [
    "outer core",
    "This is believed to be in a liquid/molten state and composed of an iron alloy.",
  ],
  [
    "S-Waves",
    "These do not travel through molten rock. [They arrive at the seismic station second].",
  ],
  [
    "lithosphere",
    "This is the rigid outer part of the earth, consisting of the crust and upper mantle.",
  ],
  ["focus", "The point within the Earth where original slippage occurs."],
  ["tectonic", "These processes result in mountain building & earthquakes."],
  [
    "P-Waves",
    "These transmit through all types of material. [They arrive at the seismic station first].",
  ],
  ["Precambrian", "This Eon accounts for over 88% of Earth’s history."],
  ["epicenter", "The place on Earth’s surface directly above the focus."],
  [
    "gradational",
    "These processes serve to smooth the landscape by wearing down and filling in.",
  ],
  [
    "Love",
    "These move horizontally and perpendicular to the direction of the wave.",
  ],
  [
    "Uniformitarianism",
    "The theory that landforms are a result of ongoing processes that have always been at work. ",
  ],
  ["fault", "A crack, fracture or breakage zone in the Earth’s crust."],
  ["Exogenic", "This system derives its energy from the Sun."],
  ["Rayleigh ", "These waves move vertically and give a rolling effect."],
  [
    "Catastrophism",
    "The belief that landforms were created by short-term events.",
  ],
  ["Holocene", "This is the Epoch we currently live in. [last ~11.5 kya]"],
  ["Endogenic", "This system derives its energy from within the Earth."],
  ["geomorphology", "This is the study of Earth’s landforms."],
  ["Cenozoic", "This is our current Era, which means “new life”."],
];

enum gameStates {
  WAITING,
  PLAYING,
}

interface Board {}
//TODO: add Player Class
interface Player {
  id: string;
  board_q: { [key: string]: boolean };
  board_idx: { [key: string]: number };
  board_size: number;
}

//gives 2d matrix of a 1d matrix
const fmtMat = (vec: number[], matSize: number) => {
  let x = "";
  for (let i = 0; i < vec.length; i++) {
    x = x + " " + vec[i].toString();
    if ((i + 1) % matSize == 0) x = x + "\n";
  }
  return x;
};

const fillPlayerBoard = (player: any, callList: any, freeSpace: boolean) => {
  callList.map(([word, clue]: any, i: number) => {
    //put free space in the middle, assumes call list size is 24
    if (i == 12) {
      player.board_idx["Free Space"] = 25;
      player.board_q["Free Space"] = false;
      i = 25;
    }

    player.board_idx[word] = i;
    player.board_q[word] = false;
  });
};

function getBoard(player: Player) {
  let board: number[] = [];
  Object.keys(player.board_idx).map((k) => {
    let idx = player.board_idx[k];
    let board_val = player.board_q[k];
    board[idx] = board_val ? 1 : 0;
  });
  return board;
}

function hasBingo(player: Player, boardSize: number) {
  let full_lr_diag = true;
  let full_rl_diag = true;
  let board = getBoard(player);

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
export { hasBingo, getBoard, fmtMat, gameStates, Player, Board, calllist };
