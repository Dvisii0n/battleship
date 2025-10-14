import UiHandler from "./uiHandler.js";
import Game from "../gameLogic/game.js";
import GameEventHandler from "./gameEvents.js";

export default class ShipsSelectionEventHandler {
    #ui = new UiHandler();
    #gameEvents = new GameEventHandler();
    #game = new Game();
    #body = document.querySelector("body");
    #axis = "x";
    #axisLabelTxt = ``;
    #currrentPlayer = 0;
    #playerShipsReady = false;

    setDragEvents() {
        const ships = document.querySelectorAll(".ship-sprite");
        const squares = document.querySelectorAll(".grid-square");
        const playerBoard = document.querySelector(".player-board");
        let source = null;

        playerBoard.addEventListener("dragleave", (event) => {
            this.#ui.clearActiveAndForbiddenSquares();
        });

        ships.forEach((ship) => {
            ship.addEventListener("dragstart", (event) => {
                source = event.target;
            });
        });

        squares.forEach((square) => {
            square.addEventListener("dragover", (event) => {
                event.preventDefault();
                this.onDragOver(event, source);
            });

            square.addEventListener("drop", (event) => {
                event.preventDefault();
                this.onDrop(event, source);
            });
        });
    }

    setPlayEvents() {
        const btn = document.querySelector(".play-btn");
        btn.addEventListener("click", () => {
            this.play();
            this.setDragEvents();
            this.setResetBoardEvent();
            this.setReadyPlayerOneEvent();
            //remove after tests
            this.placeShipsForTest();
        });
    }

    setReadyPlayerOneEvent() {
        const btn = document.querySelector(".ready-btn");
        btn.addEventListener("click", () => {
            if (this.#playerShipsReady) {
                this.#ui.clearBody();

                this.play();
                this.setDragEvents();
                this.setResetBoardEvent();
                this.#playerShipsReady = false;
                this.setReadyPlayerTwoEvent();
                //remove after tests
                this.placeShipsForTest();
            } else {
                alert("Current players ships are not ready");
            }
        });
    }

    setReadyPlayerTwoEvent() {
        const btn = document.querySelector(".ready-btn");
        btn.addEventListener("click", () => {
            if (this.#playerShipsReady) {
                this.startGame();
            } else {
                alert("Current players ships are not ready");
            }
        });
    }

    setResetBoardEvent() {
        const btn = document.querySelector(".reset-btn");
        btn.addEventListener("click", () => {
            this.#playerShipsReady = false;
            const player = this.#game.getPlayers()[this.#currrentPlayer - 1];
            this.#game.clearPlayerBoard(player.gameboard);
            this.#ui.recolorShips();
            this.#ui.renderPlacedShips(player.getBoard());
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

    play() {
        this.#currrentPlayer += 1;
        const shipList = this.#game.getShipList();
        const player = this.#game.createPlayer("human");

        this.#game.addPlayer(player);
        this.#ui.renderPlayMenu(
            player.getBoard(),
            shipList,
            this.#currrentPlayer
        );
    }

    onDrop(event, source) {
        const target = event.target;

        if (target.classList.contains("active")) {
            target.classList.remove("active");
        }

        const player = this.#game.getPlayers()[this.#currrentPlayer - 1];
        const coords = target.id.split("");
        const row = coords[1];
        const col = coords[3];
        const coordsArr = JSON.parse(`[${row}, ${col}]`);
        const shipLength = source.getAttribute("ship_length");
        const shipName = source.id;

        this.#game.placeShipOnPlayerBoard(
            player.gameboard,
            shipName,
            shipLength,
            coordsArr,
            this.#axis
        );

        const currentPlayerClass =
            this.#currrentPlayer === 1 ? "player-one" : "player-two";

        this.#ui.renderPlacedShips(player.getBoard(), currentPlayerClass);

        if (this.#game.allShipsPlacedOnPlayerBoard(player.gameboard)) {
            this.#playerShipsReady = true;
            alert("All ships are ready to sail");
        }

        console.log(player.gameboard.getCurrentMessage());
    }

    onDragOver(event, source) {
        this.#ui.clearActiveAndForbiddenSquares();

        const targetSquare = event.target;

        const currShipLength = source.getAttribute("ship_length");
        const size = this.#game.gridSize;

        this.#ui.highlightAvailableSquares(
            currShipLength,
            this.#axis,
            targetSquare,
            size
        );
    }

    startGame() {
        const players = this.#game.getPlayers();

        const playerOne = players[0];
        const playerTwo = players[1];

        this.#ui.renderGameMenu(playerOne.getBoard(), playerTwo.getBoard());
        console.log(players);

        this.#gameEvents.setAttackEvent(this.#game);
    }

    placeShipsForTest() {
        const player = this.#game.getPlayers()[this.#currrentPlayer - 1];

        const ships = this.#game.gamemodeShips;

        const presetCoords = [
            [0, 0],
            [2, 0],
            [4, 0],
            [6, 0],
            [8, 0],
        ];

        for (let i = 0; i < ships.length; i++) {
            this.#game.placeShipOnPlayerBoard(
                player.gameboard,
                ships[i].name,
                ships[i].length,
                presetCoords[i],
                "x"
            );
        }

        const currentPlayerClass =
            this.#currrentPlayer === 1 ? "player-one" : "player-two";

        this.#ui.renderPlacedShips(player.getBoard(), currentPlayerClass);

        if (this.#game.allShipsPlacedOnPlayerBoard(player.gameboard)) {
            this.#playerShipsReady = true;
        }

        console.log(player.gameboard.getCurrentMessage());
    }
}
