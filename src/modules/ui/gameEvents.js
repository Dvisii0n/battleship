import UiHandler from "./uiHandler.js";

export default class GameEventHandler {
    #ui = new UiHandler();
    #playerOneClassName = "player-one";
    #playerTwoClassName = "player-two";

    constructor(game) {
        this.game = game;
    }
    setAttackEvent() {
        const squares = document.querySelectorAll(".grid-square");

        squares.forEach((square) => {
            square.addEventListener("click", (event) => {
                const coordsId = event.target.id;

                this.setAttackLogic(square, coordsId);
            });
        });
    }

    setAttackLogic(square, coordsId) {
        const playerOne = this.game.getPlayerOne();
        const playerTwo = this.game.getPlayerTwo();

        const playerOneHitsStr = this.game
            .getHits(this.#playerOneClassName)
            .join("-");
        const playerTwoHitsStr = this.game
            .getHits(this.#playerTwoClassName)
            .join("-");

        const parentBoard = square.parentNode.parentNode;

        const coordsArr = this.getCoordsArrFromId(coordsId);

        if (parentBoard.classList.contains(this.#playerOneClassName)) {
            if (!playerOneHitsStr.includes(`${coordsArr}`)) {
                this.attack(
                    playerOne.gameboard,
                    this.#playerOneClassName,
                    coordsArr
                );
            }
        } else if (parentBoard.classList.contains(this.#playerTwoClassName)) {
            if (!playerTwoHitsStr.includes(`${coordsArr}`)) {
                this.attack(
                    playerTwo.gameboard,
                    this.#playerTwoClassName,
                    coordsArr
                );
            }
        }

        this.checkForWin(playerOne, playerTwo);

        console.log(this.game.getPlayers());
    }

    attack(playerGameboard, playerClassName, coordsArr) {
        playerGameboard.receiveAttack(coordsArr);
        const currentHits = this.game.getHits(playerClassName);
        const currentMisses = this.game.getMisses(playerClassName);
        this.#ui.renderHits(currentHits, playerClassName);
        this.#ui.renderMisses(currentMisses, playerClassName);
        this.#ui.renderSunkHits(playerGameboard.board, playerClassName);
        this.changeMsg(playerGameboard.getCurrentMessage());
    }

    checkForWin(playerOne, playerTwo) {
        let msg = "";

        if (playerOne.gameboard.allShipsSunk()) {
            msg = "GAME OVER: Player Two Wins";
        } else if (playerTwo.gameboard.allShipsSunk()) {
            msg = "GAME OVER: Player One Wins";
        } else {
            return;
        }

        const p1className = this.game.playerOneClassName;
        const p2className = this.game.playerTwoClassName;

        this.#ui.clearBody();
        this.#ui.renderGameMenu(playerOne.getBoard(), playerTwo.getBoard());
        this.#ui.renderHits(this.game.getHits(p1className), p1className);
        this.#ui.renderHits(this.game.getHits(p2className), p2className);

        this.#ui.renderMisses(this.game.getMisses(p1className), p1className);
        this.#ui.renderMisses(this.game.getMisses(p2className), p2className);

        this.#ui.renderSunkHits(playerOne.getBoard(), p1className);
        this.#ui.renderSunkHits(playerTwo.getBoard(), p2className);
        this.changeMsg(msg);
    }

    getCoordsArrFromId(coordsId) {
        const coords = coordsId.split("");
        const row = coords[1];
        const col = coords[3];
        return JSON.parse(`[${row}, ${col}]`);
    }

    clearMsg() {
        const msgCntr = document.querySelector(".msg-cntr");
        msgCntr.textContent = "";
    }

    changeMsg(msg) {
        const msgCntr = document.querySelector(".msg-cntr");
        msgCntr.textContent = msg;
    }
}
