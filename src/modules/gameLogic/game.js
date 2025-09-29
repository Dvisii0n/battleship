import { Player } from "./player.js";
import { GameBoard } from "./gameboard.js";

export default class Game {
    constructor() {
        this.players = [];
        this.gamemodeShips = [
            { name: "carrier", length: 5 },
            { name: "battleship", length: 4 },
            { name: "destroyer", length: 3 },
            { name: "submarine", length: 3 },
            { name: "patrol_boat", length: 2 },
        ];
    }

    getPlayers() {
        return this.players;
    }

    getShipList() {
        return this.gamemodeShips;
    }

    createPlayer(type, gameboardSize) {
        const player = new Player(new GameBoard(gameboardSize), type);
        return player;
    }

    addPlayer(player) {
        this.players.push(player);
    }
}
