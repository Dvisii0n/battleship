import { Ship, GameBoard } from "./gameboard.js";
import { Player } from "./player.js";

const player1 = new Player(new GameBoard("10x10"), "human");

const player2 = new Player(new GameBoard("10x10"), "computer");

player1.gameboard.placeShip(new Ship(2, "patrol"), [0, 0]);

player2.gameboard.placeShip(new Ship(2, "patrol"), [0, 1]);

player1.printBoard();
