import { ContainerFactory, MenuFactory } from "./uiBuilder.js";

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

    renderPlayMenu(board, ships, currentPlayer) {
        const playMenu = this.#menuFactory.buildPlayMenu(
            board,
            ships,
            currentPlayer
        );
        this.clearBody();
        this.#body.appendChild(playMenu);
    }

    renderPlacedShips(board, playerClassName) {
        const boardLength = Object.keys(board).length;
        for (let row = 0; row < boardLength; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const currShip = board[row][col];
                const activeSquare = document.querySelector(
                    `.${playerClassName} > .row-container > #r${row}c${col}`
                );
                if (currShip !== 0) {
                    if (document.querySelector(`#${currShip.name}`)) {
                        this.#grayOutShip(currShip.name);
                    }

                    activeSquare.classList.add("set");
                } else {
                    activeSquare.classList.remove("set");
                }
                activeSquare.classList.remove("active");
                activeSquare.classList.remove("forbidden");
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

    highlightAvailableSquares(currShipLength, axis, targetSquare, size) {
        const targetCoords = targetSquare.id.split("");
        const targetRow = parseInt(targetCoords[1]);
        const targetCol = parseInt(targetCoords[3]);
        const length = parseInt(currShipLength);
        const maxSize = parseInt(size.split("x")[0]);

        for (let i = 0; i < currShipLength; i++) {
            let availableSquare = null;
            let nextCol = targetCol + i;
            let nextRow = targetRow + i;
            let exceedsSpaceOnX =
                axis === "x" ? targetCol + length > maxSize : false;
            let exceedsSpaceOnY =
                axis === "y" ? targetRow + length > maxSize : false;

            if (axis === "x") {
                if (nextCol >= maxSize) {
                    return;
                }
                availableSquare = document.querySelector(
                    `#r${targetRow}c${nextCol}`
                );
            } else {
                if (nextRow >= maxSize) {
                    return;
                }
                availableSquare = document.querySelector(
                    `#r${nextRow}c${targetCol}`
                );
            }

            if (
                availableSquare.classList.contains("set") ||
                exceedsSpaceOnX ||
                exceedsSpaceOnY
            ) {
                availableSquare.classList.add("forbidden");
            } else {
                availableSquare.classList.add("active");
            }
        }
    }

    clearActiveAndForbiddenSquares() {
        const squares = document.querySelectorAll(".grid-square");
        squares.forEach((square) => {
            square.classList.remove("active");
            square.classList.remove("forbidden");
        });
    }

    renderGameMenu(playerOneBoard, playerTwoBoard) {
        this.clearBody();

        const cntr = this.#menuFactory.buildGameMenu(
            playerOneBoard,
            playerTwoBoard
        );

        this.#body.appendChild(cntr);

        this.renderPlacedShips(playerOneBoard, "player-one");
        this.renderPlacedShips(playerTwoBoard, "player-two");
    }

    renderHits(hitList, playerClassname) {
        hitList.forEach((hit) => {
            const row = hit[0];
            const col = hit[1];
            const square = document.querySelector(
                `.${playerClassname} > .row-container > #r${row}c${col}`
            );

            square.classList.add("hit");
        });
    }
}
