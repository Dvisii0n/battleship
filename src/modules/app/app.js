import UiHandler from "../ui/uiHandler.js";
import ShipsSelectionEventHandler from "../ui/shipsSelectEvents.js";
import GameEventHandler from "../ui/gameEvents.js";

export default class App {
    #ui = new UiHandler();
    #shipsEvents = new ShipsSelectionEventHandler();
    #gameEvents = new GameEventHandler();
    run() {
        this.#ui.renderMainMenu();

        this.#shipsEvents.setPlayEvents();
        this.#shipsEvents.setKeyEvents();
    }
}
