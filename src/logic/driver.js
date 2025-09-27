import { Ship, GameBoard } from "./gameLogic.js";

const gameBoard = new GameBoard("10x10");
gameBoard.placeShip(new Ship(4, "battleship"), [0, 2]);
gameBoard.placeShip(new Ship(2, "patrol boat"), [0, 8]);

gameBoard.recieveAttack([0, 8]);
gameBoard.recieveAttack([0, 9]);

console.log(gameBoard.board);
console.log("Misses:", gameBoard.misses);
console.log("Sunk Ships:", gameBoard.sunkShips);
