"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const Player_1 = require("./Player");
const GameLogic_1 = require("./GameLogic");
const data_1 = require("./data");
// type Sock = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
/** update client board with server board */
const syncBoard = (io, player) => {
    console.log(`syncing board for ${player.username} ${player.id} `);
    io.to(player.id).emit("sync_board", { board: player.board });
};
const syncAllBoards = (io, players) => {
    for (const player of players) {
        syncBoard(io, player);
    }
};
class CallListPicker {
    constructor(callList) {
        this.callListRef = callList;
        this.callList = JSON.parse(JSON.stringify(callList));
    }
    //picks a clue&word from callist then removes it from the list
    pick() {
        let i = Math.floor(Math.random() * this.callList.length);
        if (this.callList.length > 0)
            return this.callList.splice(i, 1)[0];
        return [];
    }
}
class HostBot {
    constructor(game, callList, server) {
        this.game = game;
        this.clp = new CallListPicker(callList);
        this.server = server;
        this.run = this.run.bind(this);
        [this.roundAnswer, this.roundClue] = this.clp.pick();
        this.game.startRound(this.roundClue, this.roundAnswer);
    }
    run() {
        if (this.game.answerStack.length > 0) {
            let guessedCorrect = this.game.endRound();
            let i = Math.floor(Math.random() * 24);
            if (guessedCorrect) {
                console.log(`nima correctly guessed ${this.roundAnswer}`);
                [this.roundAnswer, this.roundClue] = this.clp.pick();
                this.game.startRound(this.roundClue, this.roundAnswer);
            }
        }
        syncAllBoards(this.server, this.game.players);
    }
}
let wordList = data_1.calllist.map((x) => x[0]);
let players = [];
// //[id, answer]
// let answer_stack: [string, string][] = [];
const PORT = 3000;
const io = new socket_io_1.Server(PORT, {
    cors: {
        origin: `http://localhost:3001`,
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});
let curr_round_answer = "oceanic";
let currGame = new GameLogic_1.GameLogic();
let hostBot = new HostBot(currGame, data_1.calllist, io);
setInterval(hostBot.run, 1000);
console.log(`Game state: ${currGame.gmState}`);
io.on("connection", (socket) => {
    console.log(`got a connection from socket ${socket.id}`);
    let player = {
        id: socket.id,
        username: "unknown",
        board: [],
        board_size: 5,
    };
    (0, Player_1.fillPlayerBoard)(player, data_1.calllist, true);
    currGame.addPlayer(player);
    // players.push(player);
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
        syncBoard(io, player);
        callback("recieved");
    });
    socket.on("message", (msg) => {
        console.log(`message ${msg} from ${socket.id}`);
    });
    socket.on("start round", (clue, answer) => {
        console.log("round started");
        console.log(`selected clue: ${clue}`);
        currGame.startRound(clue, answer);
        // serverSock.emit("message", curr_round_clue);
    });
    socket.on("submit answer", (answer, callback) => {
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
//# sourceMappingURL=server.js.map