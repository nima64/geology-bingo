import { Socket } from "socket.io";
import { io, Manager } from "socket.io-client";

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const PORT = 3000;
let sockets: any = [];
let host_socket = io(`ws://localhost:${PORT}`, { timeout: 5000 });

// (() => async () => {
const create_users = () => {
  [...Array(4)].map((v, i) => {
    sockets.push(io(`ws://localhost:${PORT}`, { timeout: 5000 }));

    sockets[i].on("connect_error", (err: any) => {
      console.log(`connect_error due to ${err.message}`);
    });

    let name = "no_name";

    sockets[i].emit("set username", "no_name" + i);
  });
};

create_users();
host_socket.emit("start game");

host_socket.on("host select question", () => {
  readline.question("enter a questin: ", (answer: String) => {
    host_socket.emit("host selected question", answer);
  });
});

setTimeout(() => {
  console.log(`starting game`);
}, 1500);

// })();
