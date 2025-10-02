import UiHandler from "./uiHandler.js";
import Game from "../gameLogic/game.js";

export default class EventHandler {
    #ui = new UiHandler();
    #game = new Game();
    #body = document.querySelector("body");
    #axis = "x";
    #axisLabelTxt = ``;
    setShowGridSize() {
        const btn = document.querySelector(".set-grid-size-btn");
        btn.addEventListener("click", () => this.toggleHiddenGridMenu());
    }

    setCloseGridMenu() {
        const btn = document.querySelector(".grid-size-cancel-btn");
        btn.addEventListener("click", () => this.toggleHiddenGridMenu());
    }

    setDragEvents() {
        const ships = document.querySelectorAll(".ship-sprite");
        const squares = document.querySelectorAll(".grid-square");

        let source = null;

        ships.forEach((ship) => {
            ship.addEventListener("dragstart", (event) => {
                source = event.target;
            });
        });

        squares.forEach((square) => {
            square.addEventListener("dragover", (event) => {
                event.preventDefault();
            });

            square.addEventListener("dragenter", (event) => {
                this.onDragEnter(event);
            });

            square.addEventListener("dragleave", (event) => {
                this.onDragLeave(event);
            });

            square.addEventListener("drop", (event) => {
                event.preventDefault();
                this.onDrop(event, source);
            });
        });
    }

    setPlayEvents() {
        const btn = document.querySelector(".play-btn");
        btn.addEventListener("click", () => {
            this.play();
            this.setDragEvents();
            this.setResetBoardEvent();
        });
    }

    setResetBoardEvent() {
        const btn = document.querySelector(".reset-btn");
        btn.addEventListener("click", () => {
            const player = this.#game.getPlayers()[0];
            this.#game.clearPlayerBoard(player.gameboard);
            this.#ui.recolorShips();
            this.#ui.renderPlacedShips(player.getBoard());
        });
    }

    setKeyEvents() {
        this.#body.addEventListener("keydown", (event) => {
            if (event.key === "r") {
                this.#axis === "x" ? (this.#axis = "y") : (this.#axis = "x");
                this.#axisLabelTxt = `Axis: ${this.#axis.toUpperCase()}`;
                const axisLabel = document.querySelector(".axis-label");
                axisLabel.textContent = this.#axisLabelTxt;
            }
        });
    }

    toggleHiddenGridMenu() {
        const container = document.querySelector(".set-grid-container");
        container.classList.toggle("hidden");
    }

    play() {
        const sizeInput = document.querySelector(".set-grid-input");
        const shipList = this.#game.getShipList();
        const player = this.#game.createPlayer("human", sizeInput.value);

        this.#game.addPlayer(player);
        this.#ui.renderPlayMenu(player.getBoard(), shipList);
    }

    onDrop(event, source) {
        const target = event.target;

        if (target.classList.contains("active")) {
            target.classList.remove("active");
        }

        const player1 = this.#game.getPlayers()[0];
        const coords = target.id.split("");
        const row = coords[1];
        const col = coords[3];
        const coordsArr = JSON.parse(`[${row}, ${col}]`);
        const shipLength = source.getAttribute("ship_length");
        const shipName = source.id;

        this.#game.placeShipOnPlayerBoard(
            player1.gameboard,
            shipName,
            shipLength,
            coordsArr,
            this.#axis
        );

        this.#ui.renderPlacedShips(player1.getBoard());

        if (this.#game.allShipsPlacedOnPlayerBoard(player1.gameboard)) {
            alert("All ships are ready to sail");
        }
    }

    onDragEnter(event) {
        const targetClassList = event.target.classList;
        targetClassList.add("active");
    }

    onDragLeave(event) {
        const targetClassList = event.target.classList;
        targetClassList.remove("active");
    }
}
