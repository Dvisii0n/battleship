export default class ContainerFactory {
    constructor() {}

    buildElement(element, className) {
        const el = document.createElement(element);
        el.className = className;
        return el;
    }

    buildMenu() {
        const container = this.buildElement("div", "menu-container");
        const playerBtn = this.buildElement("button", "play-btn");
        const setSizeBtn = this.buildElement("button", "set-grid-size-btn");

        playerBtn.textContent = "Play";
        setSizeBtn.textContent = "Set Grid Size";

        container.appendChild(playerBtn);
        container.appendChild(setSizeBtn);

        return container;
    }

    buildSetGridMenu() {
        const container = this.buildElement("div", "set-grid-container");
        const gridSizeInput = this.buildElement("input", "set-grid-input");
        const saveBtn = this.buildElement("button", "save-grid-btn");
        const label = this.buildElement("div", "label");
        const cancelBtn = this.buildElement("button", "grid-size-cancel-btn");

        gridSizeInput.value = "10x10";

        label.textContent = "Set preferred grid size e.g (10x10)";
        saveBtn.textContent = "Save";
        cancelBtn.textContent = "Cancel";

        container.appendChild(label);
        container.appendChild(gridSizeInput);
        container.appendChild(saveBtn);
        container.appendChild(cancelBtn);

        container.classList.add("hidden");

        return container;
    }

    buildPlayMenu() {}
}
