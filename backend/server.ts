import { Server } from "socket.io";
import {
  BoardItem,
  Player,
  updateBoard,
  getBoardAnswers,
  getBoardQuestions,
  getPlayerById,
} from "./utils";

//[id, answer]
let answer_stack: [string, string][] = [];

const io = new Server(3000);

const syncBoard = (socket: any, player: Player) => {
  socket.to(player.id).emit("updated board", { board: player.board });
};

const updateBoardSynced = (socket: any, player: Player, answer: string) => {
  updateBoard(player, answer, true);
  syncBoard(socket, player);
};

//TODO players are subscribers lists for game state changes
let _players: Player[] = [];

let curr_round_answer = "Inner Core";

io.on("connection", (serverSock) => {
  console.log(`got a connection from socket ${serverSock.id}`);

  let player: Player = {
    id: serverSock.id,
    board: [],
    board_size: 5,
  };

  _players.push(player);

  syncBoard(serverSock, player);

  serverSock.on("set username", (name: string) => {
    serverSock.data.username = name;

    console.log(name);
    if (name == "host") {
      serverSock.join("host");
      serverSock.emit("getCallList", { calllist: calllist });
    }
  });

  serverSock.on("message", (msg: string) => {
    console.log(`message ${msg} from ${serverSock.id}`);
  });

  serverSock.on("start round", (clue: string) => {
    console.log(`selected clue: ${clue}`);
    // serverSock.emit("message", curr_round_clue);
  });

  // socket.on("submit answer", (answer: string) => {
  //   for (const a of answer_stack)
  //     let [id, p_answer] = a;
  //     //answer already on the stack
  //     if (id === socket.id) {
  //       console.log(
  //         `${socket.data.username} already answered ${p_answer} this round`
  //       );
  //       return;
  //     }
  //   }
  //   answer_stack.push([socket.id, answer]);
  // });

  serverSock.on("end round", () => {
    //Todo: move to into Game Object
    while (answer_stack.length > 0) {
      let top = answer_stack.pop();
      if (!top) continue;

      let [top_id, top_answer] = top;

      let player = getPlayerById(_players, top_id);

      if (!player) continue;
      let playerSocket = io.sockets.sockets.get(player.id);

      //correct answer then their board gets marked
      //TODO: wrap in function and emit to player updated board state
      if (player && top_answer == curr_round_answer) {
        updateBoardSynced(serverSock, player, curr_round_answer);

        console.log(`player ${playerSocket?.data.username} guessed correct`);

        console.log(
          `${playerSocket?.data.username}'s board \n${fmtMat(
            getBoardAnswers(player),
            player.board_size
          )}`
        );

        if (hasBingo(getBoardAnswers(player), player.board_size)) {
          console.log(`congrats player ${player.id} won`);
        }
      }
    }
  });
});
