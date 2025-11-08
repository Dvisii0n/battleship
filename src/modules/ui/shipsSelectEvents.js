import UiHandler from "./uiHandler.js";
import Game from "../gameLogic/gameUtils.js";
import GameEventHandler from "./gameEvents.js";
import menuAudio from "../../assets/audio/menu.mp3";
import clickAudio from "../../assets/audio/click.mp3";
import changeAxisAudio from "../../assets/audio/change.mp3";
import dropAudio from "../../assets/audio/drop.mp3";

export default class ShipsSelectionEventHandler {
    #ui = new UiHandler();
    #game = new Game();
    #gameEvents = new GameEventHandler(this.#game);
    #body = document.querySelector("body");
    #axis = "x";
    #axisLabelTxt = ``;
    #currrentPlayer = 0;
    #currentPlayerClassName = "";
    #playerShipsReady = false;
    #dragsource = null;

    // #menuMusic = new Audio(menuAudio);
    #clickSound = new Audio(clickAudio);
    #changeSound = new Audio(changeAxisAudio);
    #dropSound = new Audio(dropAudio);

    setInitialEvents() {
        this.setPlayEvents();
        this.setKeyEvents();
        this.setMenuAudio();
    }

    setMenuAudio() {
        // this.#menuMusic.play();
        this.setButtonAudio();
    }

    setButtonAudio() {
        const btns = document.querySelectorAll("button");
        btns.forEach((el) => {
            el.addEventListener("click", (event) => {
                this.#clickSound.play();
            });
        });
    }

    setDragEvents() {
        const ships = document.querySelectorAll(".ship-sprite");
        const squares = document.querySelectorAll(".grid-square");
        const playerBoard = document.querySelector(".player-board");

        playerBoard.addEventListener("dragleave", (event) => {
            this.#ui.clearActiveAndForbiddenSquares();
        });

        ships.forEach((ship) => {
            ship.addEventListener("dragstart", (event) => {
                this.#dragsource = event.target;
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/html", event.target.id);
            });
        });

        squares.forEach((square) => {
            square.addEventListener("dragover", (event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                this.onDragOver(event, this.#dragsource);
            });

            square.addEventListener("drop", (event) => {
                event.preventDefault();
                this.onDrop(event, this.#dragsource);
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
            this.#clickSound.play();
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
                this.changePlayerMsg("Ships are not ready");
                this.resetMsg(1000);
            }
        });
    }

    setReadyPlayerTwoEvent() {
        const btn = document.querySelector(".ready-btn");
        btn.addEventListener("click", () => {
            this.#clickSound.play();
            if (this.#playerShipsReady) {
                this.startGame();
            } else {
                this.changePlayerMsg("Ships are not ready");
                this.resetMsg(1000);
            }
        });
    }

    setResetBoardEvent() {
        const btn = document.querySelector(".reset-btn");
        btn.addEventListener("click", () => {
            this.#clickSound.play();
            this.#playerShipsReady = false;
            const player = this.#game.getPlayers()[this.#currrentPlayer - 1];
            this.#game.clearPlayerBoard(player.gameboard);
            this.#ui.recolorShips();
            this.#ui.renderPlacedShips(
                player.getBoard(),
                this.#currentPlayerClassName
            );
            this.resetMsg(0);
        });
    }

    setKeyEvents() {
        this.#body.addEventListener("keydown", (event) => {
            if (document.querySelector(".axis-label") === null) {
                return;
            }
            if (event.key === "r") {
                this.#changeSound.play();
                this.#axis === "x" ? (this.#axis = "y") : (this.#axis = "x");
                this.#axisLabelTxt = `Axis: ${this.#axis.toUpperCase()}`;
                const axisLabel = document.querySelector(".axis-label");
                axisLabel.textContent = this.#axisLabelTxt;
            }
        });
    }

    play() {
        this.#currrentPlayer += 1;
        this.#currentPlayerClassName =
            this.#currrentPlayer === 1 ? "player-one" : "player-two";
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

        this.#ui.renderPlacedShips(
            player.getBoard(),
            this.#currentPlayerClassName
        );

        if (this.#game.allShipsPlacedOnPlayerBoard(player.gameboard)) {
            this.#playerShipsReady = true;
            this.changePlayerMsg("All ships are ready for battle");
        }

        this.#dropSound.play();
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

        this.#gameEvents.setInitialEvents();
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

        this.#ui.renderPlacedShips(
            player.getBoard(),
            this.#currentPlayerClassName
        );

        if (this.#game.allShipsPlacedOnPlayerBoard(player.gameboard)) {
            this.#playerShipsReady = true;
        }

        console.log(player.gameboard.getCurrentMessage());
    }

    resetMsg(delay) {
        setTimeout(
            () =>
                this.changePlayerMsg(
                    `Player ${
                        this.#currrentPlayer
                    }: Drag your ships to the board, press R to change axis.`
                ),
            delay
        );
    }

    changePlayerMsg(msg, reset) {
        const playerLabel = document.querySelector(".player-label");
        playerLabel.textContent = msg;
    }
}
