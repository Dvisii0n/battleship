import { Player } from "../gameLogic/player.js";
import { GameBoard } from "../gameLogic/gameboard.js";

export default class EventHandler {
    setShowGridSize() {
        const btn = document.querySelector(".set-grid-size-btn");
        const container = document.querySelector(".set-grid-container");
        btn.addEventListener("click", (e) => {
            container.classList.toggle("hidden");
        });
    }

    setCloseGridSizeMenu() {
        const btn = document.querySelector(".grid-size-cancel-btn");
        const container = document.querySelector(".set-grid-container");
        btn.addEventListener("click", (e) => {
            container.classList.toggle("hidden");
        });
    }
}
