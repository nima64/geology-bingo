import { Server } from "socket.io";
import { Player, fillPlayerBoard } from "./Player";
import { GameLogic } from "./GameLogic";
import { calllist } from "./data";

/** update client board with server board */
const syncBoard = (io: any, player: Player) => {
  if ("VERBOSE")
    console.log(`syncing board for ${player.username} ${player.id} `);

  io.to(player.id).emit("sync_board", { board: player.board });
};

const syncAllBoards = (io: any, players: Player[]) => {
  for (const player of players) {
    syncBoard(io, player);
  }
};

let wordList = calllist.map((x) => x[0]);

let players: Player[] = [];

// //[id, answer]
// let answer_stack: [string, string][] = [];
const PORT = 3000;
const io = new Server(PORT, {
  cors: {
    origin: `http://localhost:3001`,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let curr_round_answer = "oceanic";
let currGame = new GameLogic();
let hostBot = new HostBot(currGame, calllist, io);

setInterval(hostBot.run, 1000);

console.log(`Game state: ${currGame.gmState}`);

io.on("connection", (socket) => {
  // if ("VERBOSE")
  console.log(`got a connection from socket ${socket.id}`);

  let player: Player = {
    id: socket.id,
    username: "unknown",
    board: [],
    board_size: 5,
  };

  fillPlayerBoard(player, calllist, true);
  currGame.addPlayer(player);

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
    syncBoard(io, player);
    callback("recieved");
  });

  socket.on("message", (msg: string) => {
    console.log(`message ${msg} from ${socket.id}`);
  });

  socket.on("start round", (clue: string, answer: string) => {
    console.log("round started");
    console.log(`selected clue: ${clue}`);
    currGame.startRound(clue, answer);
  });

  socket.on("submit answer", (answer: string, callback) => {
    currGame.submitAnswer(answer, socket.id);
    syncBoard(io, player);
    callback("recieved");
  });

  socket.on("end round", () => {
    currGame.endRound();
    syncAllBoards(io, currGame.players);
  });

  socket.on("disconnect", (reason) => {
    currGame.removePlayer(player);
  });
});
