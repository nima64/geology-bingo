import { Server } from "socket.io";

// interface Player {
//   name: string;
//   socket: any;
// }

enum gameS {
  WAITING,
  PLAYING,
}

// let gameState = gmState.WAITING_JOIN;
// let game = {
//   players: [],
// };

// let players: Player[] = [];
let gameState = gameS.WAITING;

let playerCount = 0;

let con_pool: any = [];

function add_con(con: any) {
  con_pool.push(con);
}

const io = new Server(3000);

io.of("/").adapter.on("create-room", (room) => {
  console.log(`room ${room} was created`);
});

io.on("connection", (socket) => {
  console.log(`got a connection from socket ${socket.id}`);

  // if (gameState == gmState.WAITING_JOIN) {
  //   let name = "default_user";
  //   if (playerCount == 0) {
  //     name = "techer";
  //   }
  //   players.push({ name: name, socket: socket });
  //   playerCount++;
  // }

  socket.on("start game", () => {
    console.log("starting game\nusers in game: ");
    con_pool.map((con: String) => console.log);
    gameS.PLAYING;
    io.emit("host select question");
  });

  socket.on("host selected question", (question: String) => {
    console.log(`selected question ${question}`);
  });

  // socket.to("host").emit("select");

  socket.on("set username", (name: String) => {
    socket.data.username = name;

    console.log(name);
    if (name == "host") {
      socket.join("host");
    } else {
      socket.join("game");
    }
  });
});
