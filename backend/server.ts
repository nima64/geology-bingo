import { Server } from "socket.io";
import {
  Player,
  hasBingo,
  gameStates,
  getBoard,
  fmtMat,
  calllist,
} from "./utils";

let playerCount = 0;
let _players: Player[] = [];

//[id, answer]
let answer_stack: [string, string][] = [];

const io = new Server(3000);

// function scrableCallist(callist: [][]) {}
function getPlayerById(id: string) {
  return _players.find((x) => x.id == id);
}

function sendCurrentPlayerBoard(sockId: any, socket: any) {
  let player: Player | undefined = getPlayerById(sockId);
  if (!player)
    throw new Error(`player with id ${sockId} not found in player list`);
  socket.to(sockId).emit("update board", { board: getBoard(player) });
}

io.on("connection", (socket) => {
  console.log(`got a connection from socket ${socket.id}`);

  let player: Player = {
    id: socket.id,
    board_q: {},
    board_idx: {},
    board_size: 5,
  };

  _players.push(player);

  socket.emit("update board", { board: getBoard(player) });

  socket.on("set username", (name: string) => {
    socket.data.username = name;

    console.log(name);
    if (name == "host") {
      socket.join("host");
      socket.emit("getCallList", { calllist: calllist });
    }
  });

  socket.on("message", (msg: string) => {
    console.log(`message ${msg} from ${socket.id}`);
  });

  socket.on("start round", (clue: string) => {
    console.log(`selected clue: ${clue}`);
    socket.emit("message", curr_round_clue);
  });

  socket.on("submit answer", (answer: string) => {
    for (const a of answer_stack) {
      let [id, p_answer] = a;
      //answer already on the stack
      if (id === socket.id) {
        console.log(
          `${socket.data.username} already answered ${p_answer} this round`
        );
        return;
      }
    }
    answer_stack.push([socket.id, answer]);
  });

  socket.on("end round", () => {
    //Todo: move to into Game Object
    while (answer_stack.length > 0) {
      let top = answer_stack.pop();
      if (!top) continue;

      let [top_id, top_answer] = top;
      let player = _players.find((x) => x.id == top_id);

      if (!player) continue;
      let playerSocket = io.sockets.sockets.get(player.id);

      //correct answer then their board gets marked
      //TODO: wrap in function and emit to player updated board state
      if (player && top_answer == curr_round_answer) {
        player.board_q[curr_round_answer] = true;
        console.log(`player ${playerSocket?.data.username} guessed correct`);
        console.log(
          `${playerSocket?.data.username}'s board \n${fmtMat(
            getBoard(player),
            player.board_size
          )}`
        );

        if (hasBingo(player, 5)) {
          console.log(`congrats player ${player.id} won`);
        }
      }
    }
  });
});
