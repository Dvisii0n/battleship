class ContainerFactory {
    constructor() {}

    buildElement(element, className, textContent) {
        const el = document.createElement(element);
        el.className = className;
        el.textContent = textContent ? textContent : "";
        return el;
    }

    buildArtistLink() {
        const cntr = this.buildElement("div", "artist");

        const anchor = this.buildElement(
            "a",
            "artist-link",
            "Background made by PxSprite"
        );
        anchor.setAttribute("href", "https://www.artstation.com/pxsprite");

        cntr.appendChild(anchor);

        return cntr;
    }

    buildMenuOptions() {
        const container = this.buildElement("div", "menu-options-container");
        const playerBtn = this.buildElement("button", "play-btn", "Play");

        container.appendChild(playerBtn);

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

        const mainTitle = this.#cntrFactory.buildElement(
            "div",
            "main-title",
            "Battleship"
        );

        const menuOptions = this.#cntrFactory.buildMenuOptions();

        const artistCntr = this.#cntrFactory.buildArtistLink();

        menuContainer.appendChild(mainTitle);
        menuContainer.appendChild(menuOptions);
        menuContainer.appendChild(artistCntr);

        return menuContainer;
    }

    buildPlayMenu(board, ships, currentPlayer) {
        const menuContainer = this.#cntrFactory.buildElement(
            "div",
            "play-menu"
        );
        const playerLabel = this.#cntrFactory.buildElement(
            "div",
            "player-label",
            `Player ${currentPlayer}`
        );
        const boardCntr = this.#cntrFactory.buildBoard(board);
        const currentPlayerClass =
            currentPlayer === 1 ? "player-one" : "player-two";

        boardCntr.classList.add(currentPlayerClass);
        const shipSelectionCntr =
            this.#cntrFactory.buildShipsSelectionContainer(ships);

        const readyBtn = this.#cntrFactory.buildElement(
            "button",
            "ready-btn",
            "Ready"
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

        menuContainer.appendChild(playerLabel);
        menuContainer.appendChild(axisLabel);
        menuContainer.appendChild(boardCntr);
        menuContainer.appendChild(shipSelectionCntr);
        menuContainer.appendChild(resetBtn);
        menuContainer.appendChild(readyBtn);

        return menuContainer;
    }

    buildGameMenu(playerOneBoard, playerTwoBoard) {
        const boardsCntr = this.#cntrFactory.buildElement(
            "div",
            "player-boards-container"
        );

        const playerOneGrid = this.#cntrFactory.buildBoard(playerOneBoard);
        playerOneGrid.classList.add("player-one");
        const playerTwoGrid = this.#cntrFactory.buildBoard(playerTwoBoard);
        playerTwoGrid.classList.add("player-two");

        boardsCntr.appendChild(playerOneGrid);
        boardsCntr.appendChild(playerTwoGrid);

        return boardsCntr;
    }
}

export { ContainerFactory, MenuFactory };
