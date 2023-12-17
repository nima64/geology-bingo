"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});
const PORT = 3000;
let sockets = [];
let host_socket = (0, socket_io_client_1.io)(`ws://localhost:${PORT}`, { timeout: 5000 });
// (() => async () => {
const create_users = () => {
    [...Array(4)].map((v, i) => {
        sockets.push((0, socket_io_client_1.io)(`ws://localhost:${PORT}`, { timeout: 5000 }));
        sockets[i].on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
        let name = "no_name";
        sockets[i].emit("set username", "no_name" + i);
    });
};
create_users();
host_socket.emit("start game");
host_socket.on("host select question", () => {
    readline.question("enter a questin: ", (answer) => {
        host_socket.emit("host selected question", answer);
    });
});
setTimeout(() => {
    console.log(`starting game`);
}, 1500);
// })();
//# sourceMappingURL=client.js.map