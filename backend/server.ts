import { Server } from "socket.io";
import { Player, fillPlayerBoard } from "./Player";
import { Game } from "./Game";
import { calllist } from "./data";

// type Sock = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

/** update client board with server board */
const syncBoard = (io: any, player: Player) => {
  console.log(`syncing board for ${player.id}`);
  io.to(player.id).emit("sync_board", { board: player.board });
};

let wordList = calllist.map((x) => x[0]);

//TODO players are subscribers lists for game state changes
let players: Player[] = [];

// //[id, answer]
// let answer_stack: [string, string][] = [];

const io = new Server(3000);

let curr_round_answer = "Inner Core";
let currGame = new Game();

io.on("connection", (socket) => {
  console.log(`got a connection from socket ${socket.id}`);

  let player: Player = {
    id: socket.id,
    username: "unknown",
    board: [],
    board_size: 5,
  };

  fillPlayerBoard(player, calllist, false);
  currGame.addPlayer(player);
  // players.push(player);

  // syncBoard(socket, player);

  socket.on("call_list", (callback) => {
    callback({ call_list: calllist });
  });

  socket.on("set username", (name: string, callback) => {
    socket.data.username = name;
    player.username = name;

    console.log(name);
    if (name == "host") {
      socket.join("host");
    }
    callback("recieved");
  });

  socket.on("message", (msg: string) => {
    console.log(`message ${msg} from ${socket.id}`);
  });

  socket.on("start round", (clue: string) => {
    console.log(`selected clue: ${clue}`);
    currGame.startRound(clue);
    // serverSock.emit("message", curr_round_clue);
  });

  socket.on("submit answer", (answer: string) => {
    currGame.submitAnswer(answer, socket.id);
    // updateBoard(player, answer, true);
    syncBoard(io, player);
  });

  socket.on("end round", () => {
    currGame.endRound(socket, curr_round_answer);
    syncBoard(io, player);
  });
});
