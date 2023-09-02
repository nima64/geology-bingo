import { Server } from "socket.io";

const PORT = 8000;
const io = new Server(PORT);

interface Player {
  name: string;
  socket: any;
}
enum gmState {
  WAITING_JOIN,
  WAITING_SELCTION,
  PLAYING,
}

let gameState = gmState.WAITING_JOIN;
let players: Player[];
let playerCount = 0;

//how to pass user name?
io.on("connection", (socket) => {
  console.log(`got a connection from socket ${socket.id}`);

  if (gameState == gmState.WAITING_JOIN) {
    let name = "default_user";
    if (playerCount == 0) {
      name = "techer";
    }
    players.push({ name: name, socket: socket });
    playerCount++;
  }

  socket.on("start game", () => {
    // ...
  });

  // socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });

  // socket.on("hello from client", (...args) => {
  //   // ...
  // });
});
