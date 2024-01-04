import { io, Manager } from "socket.io-client";
import readline from "readline";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const PORT = 3000;
let sockets = [];
let socket = io(`ws://localhost:${PORT}`, { timeout: 5000 });
let host_sock = io(`ws://localhost:${PORT}`, { timeout: 5000 });
let call_list: any[][] = [];

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
