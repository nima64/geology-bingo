import { useState } from 'react';
import { io, Manager } from "socket.io-client";
import styles from './board.module.css';
import { BoardItem } from './types';
import { Board } from './Board';
import React from 'react';

const SERVER_PORT = 3000;
let socket = io(`ws://localhost:${SERVER_PORT}`, {
  timeout: 5000,
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

let host_sock = io(`ws://localhost:${SERVER_PORT}`, {
  timeout: 5000, withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

let call_list: any[][] = [];
let syncBoardListeners: Function[] = [];
let messageListeners: Function[] = [];

socket.on("message", (msg) => {
  console.log(`message: ${msg}`);
});

socket.on("sync_board", (data) => {
  console.log(`sync_board data -> ${JSON.stringify(data["board"])}`);
  for (let callback of syncBoardListeners) {
    callback(data["board"]);
  }
});

async function getCallList() {
  let resp = await socket.emitWithAck("call_list");
  return resp.call_list;
}

let [word, clue] = ['Holocene', 'This is the Epoch we currently live in.'];
async function hostTest() {
  await socket.emitWithAck("set username", "nima");
  // await host_sock.emitWithAck("set username", "host");

  // let idx = Math.round(Math.random() * 25);
  // call_list = await getCallList();
  // // console.log(`call_list: ${JSON.stringify(call_list)}`);
  // let [word, clue] = call_list[idx];
  // console.log(`word: ${word},\n clue: ${clue}`);
  // host_sock.emit("start round", clue, word);
  // console.log(clue);
  // await socket.emitWithAck("submit answer", word);
  // host_sock.emit("end round");
}

export class GameView extends React.Component<any, { board: BoardItem[], boardWords: string[], matSize: number }> {
  constructor(props: any) {
    super(props);
    this.state = {
      board: [],
      boardWords: [],
      matSize: 5,
    };
    syncBoardListeners.push(this.syncBoardListener);
  }

  syncBoardListener = (data: any) => {
    // let boardWords = data.map((item: BoardItem) => item.question);
    this.setState({ board: data });
  };

  componentDidMount(): void {
  }
  // submitAnswer = (inp: string) => { socket.emit("submit answer", inp) };
  // setUserName = (inp: string) => { socket.emit("set username", inp) };

  onClickWrap(item: BoardItem) {
    return async () => {
      await socket.emitWithAck("submit answer", item.question);
    }
  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        {
          this.state.board.length === 0 ? <div>loading...</div> :
            <Board clue={clue} board={this.state.board} onClickWrap={this.onClickWrap} boardSize={this.state.matSize} />
        }
      </div>
    );
  }
}

document.addEventListener("DOMContentLoaded", (event) => hostTest());