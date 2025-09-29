import UiHandler from "../ui/uiHandler.js";
import EventHandler from "../ui/eventHandler.js";

export default class App {
    #ui = new UiHandler();
    #events = new EventHandler();
    run() {
        this.#ui.renderMainMenu();

        this.#events.setShowGridSize();
        this.#events.setCloseGridMenu();
        this.#events.setPlayEvent();
        this.#events.setKeyEvents();
    }
}
