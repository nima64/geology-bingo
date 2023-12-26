import { io, Manager } from "socket.io-client";
const SERVER_PORT = 3000;

let socket = io(`ws://localhost:${SERVER_PORT}`, {
  timeout: 5000,
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});


export const getRoomList = async (roomName: string) => {
    let resp = await socket.emitWithAck("get room list", roomName);
    return resp;
} 
