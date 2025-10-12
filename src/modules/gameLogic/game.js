import { Player } from "./player.js";
import { GameBoard } from "./gameboard.js";

export default class Game {
    constructor() {
        this.gridSize = "10x10";
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

    createPlayer(type) {
        const player = new Player(new GameBoard(this.gridSize), type);
        return player;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    placeShipOnPlayerBoard(
        playerGameboard,
        shipName,
        shipLength,
        coords,
        axis
    ) {
        playerGameboard.placeShip(shipName, shipLength, coords, axis);
    }

    clearPlayerBoard(playerGameboard) {
        playerGameboard.clearBoard();
    }

    allShipsPlacedOnPlayerBoard(playerBoard) {
        return playerBoard.allShipsArePlaced();
    }
}
