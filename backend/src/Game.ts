import { GameLogic } from "./GameLogic";
import { Player } from "./Player";

class GameRoom extends GameLogic{
  id: string;
  dateCreated: number;
  lifespan: number
  // private players: Player[] = []; 
  // addPlayer: boolean;
  
  constructor(id: string, lifespan: number) {
    super();
    this.dateCreated = Date.now();
    this.lifespan = lifespan;
    this.id = id;
  }

  join(player: Player, id: string) : boolean {
    if (id != this.id){
      return false;
    }
    this.addPlayer(player);
    return true;
  }

}
export default GameRoom;