import { GameLogic } from "./GameLogic";
import { Player } from "./Player";

class Room {
  dateCreated: number;
  lifespan: number
  id: string;
  private game :GameLogic;
  private players: Player[] = []; 
  
  constructor(lifespan: number) {
    this.dateCreated = Date.now();
    this.lifespan = lifespan;
    this.id = Math.random().toString(36).substring(2, 9);
  }

  handleJoinRequest(player: Player, id: string) : boolean {
    if (id != this.id){
      return false;
    }
    this.players.push(player);
    return true;
  }
}