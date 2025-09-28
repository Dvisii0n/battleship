import ContainerFactory from "./containerFactory.js";

export default class Ui {
    #cntrFactory = new ContainerFactory();
    #body = document.querySelector("body");

    renderMenu() {
        this.#body.appendChild(this.#cntrFactory.buildMenu());
    }

    renderGridSizeMenu() {
        this.#body.appendChild(this.#cntrFactory.buildSetGridMenu());
    }

    renderSetPlayerMenu() {}

    renderGrid(gameboard) {}
}
