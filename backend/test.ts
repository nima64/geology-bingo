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
let calllist: any[][] = []

socket.on("message", (msg)=>{
  console.log(`message: ${msg}`);
});

socket.on("getCallList",(data)=>{
  calllist = data.callist;
});

async function hostTest(){
 await socket.emitWithAck("set username", "nima");
 await host_sock.emitWithAck("set username", "host");
  let idx = Math.random()*25;
  let [word, clue] = calllist[idx] ;
  host_sock.emit("start round", clue);
  console.log(clue);
  socket.emit("submit answer", word);
  host_sock.emit("end round");

}

hostTest();

async function clientTest(){
  const it = rl[Symbol.asyncIterator]();
  
  
  console.log("enter your name:");
  // let name = (await it.next()).value;
  let name = "nima";
  socket.emit("set username", name);

  let inp = "";
  socket.emit("start round", "test clue");
  socket.emit("submit answer", "Antarctic Circle");
  socket.emit("end round");
  while(inp != "q"){
    console.log("enter: eventName,arg")
    inp = (await it.next()).value;
    let [eventName, arg] = inp.split(",");
    if (eventName == undefined || eventName.length == 0 || arg == undefined){
      console.log(`not a valid input "${eventName},${arg}" `);
      continue;
    }
    console.log(`emmiting ${eventName}, ${arg}`)
    socket.emit(eventName, arg);
  }

}