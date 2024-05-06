import { Server } from "socket.io";
import { Player, fillPlayerBoard } from "./core/Player";
import { GameLogic } from "./core/GameLogic";
import { calllist } from "./data";
import HostBot from "./core/HostBot";
import { sessionMiddleware } from "./authServer";
import { Room, createGameRoomManager } from "./core/Game";
import { syncAllBoards, syncBoard } from "./utils";
import { SessionData } from "express-session";
import { IncomingMessage } from "http";

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

//TODO make POST end point that checks sessionID if logged in and not already in room than add to room

io.engine.use(sessionMiddleware);

io.on("connection", (socket) => {
  // if ("VERBOSE")
  const session = (socket.request as IncomingMessage & { session: SessionData })
    .session;

  console.log(`got a connection from socket ${socket.id}`);

  let player: Player = {
    id: socket.id,
    username: session.user ? session.user : "UNKOWN",
    board: [],
    board_size: 5,
  };

  if (player.username == "host") {
    socket.join("host");
  }
  syncBoard(io, player);
  currGame.addPlayer(player);

  socket.on("call_list", (callback) => {
    callback({ call_list: calllist });
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
