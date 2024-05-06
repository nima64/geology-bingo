import { GameLogic } from "./GameLogic";
import { Player } from "./Player";

class GameRoom extends GameLogic {
  id: string;
  dateCreated: number;
  lifespan: Date;
  // private players: Player[] = [];
  // addPlayer: boolean;

  constructor(id: string, lifespan: Date) {
    super();
    this.dateCreated = Date.now();
    this.lifespan = lifespan;
    this.id = id;
  }

  join(player: Player, id: string): boolean {
    if (id != this.id) {
      return false;
    }
    this.addPlayer(player);
    return true;
  }
}

export type Room = {
  [key: string]: GameRoom;
};

export const createGameRoomManager = () => {
  let rooms: Room = {};
  return {
    // returns room id
    getRoomIds: (): string[] => {
      return Object.keys(rooms);
    },
    createRoom: (): string => {
      const randomLetter = () =>
        String.fromCharCode(0 | (Math.random() * 26 + 97));

      const randomLineOfLetters = (lineSize: number) => () =>
        Array(lineSize).fill("").map(randomLetter).join("");

      //generate the id
      let id = randomLineOfLetters(6)();

      //keep generating new ids if duplicate
      while (rooms[id] == null) {
        id = randomLineOfLetters(6)();
        let nextTwoHours = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
        rooms[id] = new GameRoom(id, nextTwoHours);
      }
      return id;
    },
  };
};

// let rooms: { };

// export function createRoom
// }

export default GameRoom;
