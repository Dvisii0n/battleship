import { MenuFactory } from "./uiBuilder.js";

export default class UiHandler {
    #menuFactory = new MenuFactory();
    #body = document.querySelector("body");

    clearBody() {
        while (this.#body.firstChild) {
            this.#body.removeChild(this.#body.firstChild);
        }
    }

    removeContainer(container) {
        this.#body.removeChild(container);
    }

    renderMainMenu() {
        const mainMenu = this.#menuFactory.buildMainMenu();

        this.#body.appendChild(mainMenu);
    }

    renderPlayMenu(board, ships) {
        const playMenu = this.#menuFactory.buildPlayMenu(board, ships);
        this.clearBody();
        this.#body.appendChild(playMenu);
    }

    renderPlacedShips(board) {
        const boardLength = Object.keys(board).length;
        for (let row = 0; row < boardLength; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const currShip = board[row][col];
                const activeSquare = document.querySelector(`#r${row}c${col}`);
                if (currShip !== 0) {
                    this.#grayOutShip(currShip.name);
                    activeSquare.classList.add("set");
                } else {
                    activeSquare.classList.remove("set");
                }
            }
        }
    }

    #grayOutShip(shipId) {
        const ship = document.querySelector(`#${shipId}`);
        ship.classList.add("placed");
    }

    recolorShips() {
        const ships = document.querySelectorAll(`.ship-sprite`);
        ships.forEach((ship) => {
            ship.classList.remove("placed");
        });
    }

    highlightAvailableSquares(shipLength) {}
}
