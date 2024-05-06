import { Server } from "socket.io";
import { Player, fillPlayerBoard } from "./Player";
import { GameLogic } from "./GameLogic";
import { calllist } from "./data";
import HostBot from "./HostBot";
import { Room, createGameRoomManager } from "./Game";

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

let players: Player[] = [];

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

const roomManager = createGameRoomManager();

let roomIds: string[] = [];
roomIds.push(roomManager.createRoom());

const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("available game rooms " + roomManager.getRoomIds() + " ");

//TODO make POST end point that checks sessionID if logged in and not already in room than add to room
// app.post("/joinRoom", (req, res) => {
//   type sessionAlt = session.Session &
//     Partial<SessionData> & { roomID: string };
//   let session = req.session as sessionAlt;
//   session.count = (session.count || 0) + 1;
//   res.status(200).end("" + session.count);
// });

rl.question(`what room do you want to join?`, (myRoomId: any) => {
  // console.log(`Hi ${name}!`);

  if (!roomManager.getRoomIds().includes(myRoomId))
    console.log("not an avaiable room");
  else console.log("joining room " + myRoomId);

  rl.close();
});

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

  //TODO
  // Move this into http server as http end point
  socket.on("new username", (name: string, callback) => {
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

  socket.on("start round", (clue: string, answer: string) => {
    console.log("check if this overrides or just adds a callback ");
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
