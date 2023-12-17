"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const utils_1 = require("./utils");
// let players: Player[] = [];
let gameState = utils_1.gameStates.WAITING;
let playerCount = 0;
// {player_id: board{board_tile:boolean}}
// let playerBoard = ;
// let players: Record<string, Array<Number>> = {};
let _players = [];
// Dummy Data players
// players = {{"nima": [0,0,0,0,0,0,0,0,0] }}
//[id, answer]
let answer_stack = [];
const io = new socket_io_1.Server(3000);
let curr_round_clue = "The portion of the Earth composed primarily of iron and believed to be in a solid state.";
let curr_round_answer = "Antarctic Circle";
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
function scrableCallist(callist) {
}
io.on("connection", (socket) => {
    console.log(`got a connection from socket ${socket.id}`);
    let player = {
        id: socket.id,
        board_q: {},
        board_idx: {},
        board_size: 5,
    };
    calllist.map(([word, clue], i) => {
        //place freespace in the middle
        if (i == 12) {
            player.board_idx["Free Space"] = 25;
            player.board_q["Free Space"] = false;
            i = 25;
        }
        player.board_idx[word] = i;
        player.board_q[word] = false;
    });
    _players.push(player);
    socket.on("set username", (name) => {
        socket.data.username = name;
        console.log(name);
        if (name == "host") {
            socket.join("host");
            socket.emit("getCallList", { calllist: calllist });
        }
    });
    socket.on("message", (msg) => {
        console.log(`message ${msg} from ${socket.id}`);
    });
    socket.on("start round", (clue) => {
        console.log(`selected clue: ${clue}`);
        // curr_round_clue = clue;
        socket.emit("message", curr_round_clue);
    });
    socket.on("submit answer", (answer) => {
        for (const a of answer_stack) {
            let [id, p_answer] = a;
            //answer already on the stack
            if (id === socket.id) {
                console.log(`${socket.data.username} already answered ${p_answer} this round`);
                return;
            }
        }
        answer_stack.push([socket.id, answer]);
    });
    socket.on("end round", () => {
        while (answer_stack.length > 0) {
            let top = answer_stack.pop();
            if (!top)
                continue;
            let [top_id, top_answer] = top;
            let player = _players.find((x) => x.id == top_id);
            if (!player)
                continue;
            let playerSocket = io.sockets.sockets.get(player.id);
            //correct answer then their board gets marked
            if (player && top_answer == curr_round_answer) {
                player.board_q[curr_round_answer] = true;
                console.log(`player ${playerSocket === null || playerSocket === void 0 ? void 0 : playerSocket.data.username} guessed correct`);
                console.log(`${playerSocket === null || playerSocket === void 0 ? void 0 : playerSocket.data.username}'s board \n${(0, utils_1.fmtMat)((0, utils_1.getBoard)(player), player.board_size)}`);
                if ((0, utils_1.hasBingo)(player, 5)) {
                    console.log(`congrats player ${player.id} won`);
                    // gameState = gameStates.WAITING;
                }
            }
        }
    });
    // io.emit(){}
});
//# sourceMappingURL=server.js.map