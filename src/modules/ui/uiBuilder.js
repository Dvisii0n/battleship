class ContainerFactory {
    constructor() {}

    buildElement(element, className, textContent) {
        const el = document.createElement(element);
        el.className = className;
        el.textContent = textContent ? textContent : "";
        return el;
    }

    buildMenuOptions() {
        const container = this.buildElement("div", "menu-options-container");
        const playerBtn = this.buildElement("button", "play-btn", "Play");
        const setSizeBtn = this.buildElement(
            "button",
            "set-grid-size-btn",
            "Set Grid Size"
        );

        container.appendChild(playerBtn);
        container.appendChild(setSizeBtn);

        return container;
    }

    buildSetGridOptions() {
        const container = this.buildElement("div", "set-grid-container");
        const gridSizeInput = this.buildElement("input", "set-grid-input");
        const saveBtn = this.buildElement("button", "save-grid-btn", "Save");
        const label = this.buildElement(
            "div",
            "label",
            "Set preferred grid size e.g (10x10)"
        );
        const cancelBtn = this.buildElement(
            "button",
            "grid-size-cancel-btn",
            "Cancel"
        );

        gridSizeInput.value = "10x10";

        container.appendChild(label);
        container.appendChild(gridSizeInput);
        container.appendChild(saveBtn);
        container.appendChild(cancelBtn);

        container.classList.add("hidden");

        return container;
    }

    #buildColCharsContainer(board) {
        const boardLength = Object.keys(board).length;
        const startDecimalValue = 65; //ascii val for "A"

        const colCharsContainer = this.buildElement("div", "colLetters");
        const emptySquare = this.buildElement("div", "char-square");
        colCharsContainer.appendChild(emptySquare);

        for (let col = 0; col < boardLength; col++) {
            const char = String.fromCharCode(startDecimalValue + col);
            const charSquare = this.buildElement("div", "char-square", char);
            colCharsContainer.appendChild(charSquare);
        }

        return colCharsContainer;
    }

    buildBoard(board) {
        const boardLength = Object.keys(board).length;
        const container = this.buildElement("div", "player-board");
        const colCharsContainer = this.#buildColCharsContainer(board);

        container.appendChild(colCharsContainer);

        for (let row = 0; row < boardLength; row++) {
            const rowNumSquare = this.buildElement(
                "div",
                "row-num-square",
                row + 1
            );
            const rowContainer = this.buildElement("div", "row-container");
            rowContainer.appendChild(rowNumSquare);

            for (let col = 0; col < board[row].length; col++) {
                const gridSquare = this.buildElement("div", "grid-square");
                gridSquare.setAttribute("id", `r${row}c${col}`);
                rowContainer.appendChild(gridSquare);
            }
            container.appendChild(rowContainer);
        }

        return container;
    }

    buildShipsSelectionContainer(ships) {
        const container = this.buildElement("div", "ships-container");

        ships.forEach((ship) => {
            const shipSpriteContainer = this.buildElement("img", "ship-sprite");
            shipSpriteContainer.classList.add(ship.name);
            shipSpriteContainer.setAttribute("ship_length", ship.length);
            shipSpriteContainer.setAttribute("id", ship.name);

            container.appendChild(shipSpriteContainer);
        });

        return container;
    }
}

class MenuFactory {
    #cntrFactory = new ContainerFactory();

    buildMainMenu() {
        const menuContainer = this.#cntrFactory.buildElement(
            "div",
            "main-menu"
        );

        const setGridMenu = this.#cntrFactory.buildSetGridOptions();
        const mainTitle = this.#cntrFactory.buildElement(
            "div",
            "main-title",
            "Battleship"
        );
        const menuOptions = this.#cntrFactory.buildMenuOptions();

        menuContainer.appendChild(setGridMenu);

        menuContainer.appendChild(mainTitle);
        menuContainer.appendChild(menuOptions);

        return menuContainer;
    }

    buildPlayMenu(board, ships) {
        const menuContainer = this.#cntrFactory.buildElement(
            "div",
            "play-menu"
        );
        const boardCntr = this.#cntrFactory.buildBoard(board);
        const shipSelectionCntr =
            this.#cntrFactory.buildShipsSelectionContainer(ships);
        const startBtn = this.#cntrFactory.buildElement(
            "button",
            "start-btn",
            "Start"
        );
        const resetBtn = this.#cntrFactory.buildElement(
            "button",
            "reset-btn",
            "Reset Board"
        );
        const axisLabel = this.#cntrFactory.buildElement(
            "div",
            "axis-label",
            "Axis: X"
        );

        menuContainer.appendChild(axisLabel);
        menuContainer.appendChild(boardCntr);
        menuContainer.appendChild(shipSelectionCntr);
        menuContainer.appendChild(resetBtn);
        menuContainer.appendChild(startBtn);

        return menuContainer;
    }
}

export { ContainerFactory, MenuFactory };
