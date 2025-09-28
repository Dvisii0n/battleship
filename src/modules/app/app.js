import Ui from "../ui/uiRenderer.js";
import EventHandler from "../ui/eventHandler.js";

export default class App {
    #ui = new Ui();
    #events = new EventHandler();
    run() {
        this.#ui.renderMenu();
        this.#ui.renderGridSizeMenu();

        this.#events.setShowGridSize();
        this.#events.setCloseGridSizeMenu();
    }
}
