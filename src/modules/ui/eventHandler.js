import UiHandler from "./uiHandler.js";
import Game from "../gameLogic/game.js";
import { Ship } from "../gameLogic/gameboard.js";

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

    setPlayEvent() {
        const btn = document.querySelector(".play-btn");
        btn.addEventListener("click", () => {
            this.play();
            this.setDragEvents();
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
        const player1 = this.#game.getPlayers()[0];
        const coords = JSON.parse(target.id);
        const shipLength = source.getAttribute("ship_length");
        const shipName = source.id;

        console.log(shipLength, shipName, coords);

        player1.gameboard.placeShip(
            new Ship(shipLength, shipName),
            coords,
            this.#axis
        );
        console.log(player1.gameboard);
    }

    onDragEnter(event) {
        const targetClassList = event.target.classList;
        if (!targetClassList.contains("active")) {
            targetClassList.add("active");
        }
    }

    onDragLeave(event) {
        const targetClassList = event.target.classList;
        if (targetClassList.contains("active")) {
            targetClassList.remove("active");
        }
    }
}
