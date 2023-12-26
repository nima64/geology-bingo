"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor(timespan) {
        this.players = [];
        this.dateCreated = Date.now();
        this.timespan = timespan;
        this.id = Math.random().toString(36).substring(2, 9);
    }
    requestJoin(player, id) {
        if (id != this.id) {
            return false;
        }
        this.players.push(player);
        return true;
    }
}
//# sourceMappingURL=Room.js.map