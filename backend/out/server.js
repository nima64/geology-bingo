"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const Player_1 = require("./Player");
const Game_1 = require("./Game");
const data_1 = require("./data");
// type Sock = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
/** update client board with server board */
const syncBoard = (socket, player) => {
    console.log(`syncing board for ${player.id}`);
    socket.to(player.id).emit("sync_board", { board: player.board });
};
let wordList = data_1.calllist.map((x) => x[0]);
//TODO players are subscribers lists for game state changes
let players = [];
// //[id, answer]
// let answer_stack: [string, string][] = [];
const io = new socket_io_1.Server(3000);
let curr_round_answer = "Inner Core";
let currGame = new Game_1.Game(players);
io.on("connection", (socket) => {
    console.log(`got a connection from socket ${socket.id}`);
    let player = {
        id: socket.id,
        username: "unknown",
        board: [],
        board_size: 5,
    };
    (0, Player_1.fillPlayerBoard)(player, data_1.calllist, false);
    players.push(player);
    // syncBoard(socket, player);
    socket.on("call_list", (callback) => {
        callback({ call_list: data_1.calllist });
    });
    socket.on("set username", (name, callback) => {
        socket.data.username = name;
        player.username = name;
        console.log(name);
        if (name == "host") {
            socket.join("host");
        }
        callback("recieved");
    });
    socket.on("message", (msg) => {
        console.log(`message ${msg} from ${socket.id}`);
    });
    socket.on("start round", (clue) => {
        console.log(`selected clue: ${clue}`);
        currGame.startRound(clue);
        // serverSock.emit("message", curr_round_clue);
    });
    socket.on("submit answer", (answer) => {
        currGame.submitAnswer(answer, socket.id);
        // updateBoard(player, answer, true);
        syncBoard(socket, player);
    });
    socket.on("end round", () => {
        currGame.endRound(socket, curr_round_answer);
        syncBoard(socket, player);
    });
});
//# sourceMappingURL=server.js.map