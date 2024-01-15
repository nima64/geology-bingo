"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const readline_1 = __importDefault(require("readline"));
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const PORT = 3000;
let sockets = [];
let socket = (0, socket_io_client_1.io)(`ws://localhost:${PORT}`, { timeout: 5000 });
let host_sock = (0, socket_io_client_1.io)(`ws://localhost:${PORT}`, { timeout: 5000 });
let call_list = [];
socket.on("message", (msg) => {
    console.log(`message: ${msg}`);
});
socket.on("sync_board", (data) => {
    console.log(`sync_board: ${data}`);
});
async function getCallList() {
    let resp = await socket.emitWithAck("call_list");
    return resp.call_list;
}
async function hostTest() {
    await socket.emitWithAck("set username", "nima");
    await host_sock.emitWithAck("set username", "host");
    let idx = Math.round(Math.random() * 25);
    call_list = await getCallList();
    let [word, clue] = call_list[idx];
    console.log(`word: ${word},\n clue: ${clue}`);
    host_sock.emit("start round", clue);
    console.log(clue);
    socket.emit("submit answer", word);
    host_sock.emit("end round");
}
hostTest();
async function clientTest() {
    const it = rl[Symbol.asyncIterator]();
    console.log("enter your name:");
    // let name = (await it.next()).value;
    let name = "nima";
    socket.emit("set username", name);
    let inp = "";
    socket.emit("start round", "test clue");
    socket.emit("submit answer", "Antarctic Circle");
    socket.emit("end round");
    while (inp != "q") {
        console.log("enter: eventName,arg");
        inp = (await it.next()).value;
        let [eventName, arg] = inp.split(",");
        if (eventName == undefined || eventName.length == 0 || arg == undefined) {
            console.log(`not a valid input "${eventName},${arg}" `);
            continue;
        }
        console.log(`emmiting ${eventName}, ${arg}`);
        socket.emit(eventName, arg);
    }
}
//# sourceMappingURL=test.js.map