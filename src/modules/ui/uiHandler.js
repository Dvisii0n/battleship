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
}
