import UiHandler from "./uiHandler.js";
import shotAudio from "../../assets/audio/shot.wav";
import missAudio from "../../assets/audio/miss.mp3";
import explosionAudio from "../../assets/audio/explosion.wav";
import winAudio from "../../assets/audio/win.wav";
import boardReadyAudio from "../../assets/audio/boardReady.wav";
import errorAudio from "../../assets/audio/error.wav";

export default class GameEventHandler {
    #ui = new UiHandler();
    #playerOneClassName = "player-one";
    #playerTwoClassName = "player-two";
    #currentTurn = "Player 1";
    #playerOneSetSquares = [];
    #playerTwoSetSquares = [];
    #ready = true;
    #winner = false;
    #attacking = true;

    #shotSound = new Audio(shotAudio);
    #missSound = new Audio(missAudio);
    #explosionSound = new Audio(explosionAudio);
    #winSound = new Audio(winAudio);
    #boardReadySound = new Audio(boardReadyAudio);
    #errorSound = new Audio(errorAudio);

    constructor(game) {
        this.game = game;
    }

    setInitialEvents() {
        this.saveSetSquares();
        this.changeMsg(`${this.#currentTurn}: It's your turn.`);
        this.#ui.hideShips(this.#playerTwoSetSquares);
        this.setAttackEvent();
        this.setTurnReadyEvent();
    }

    saveSetSquares() {
        this.#playerOneSetSquares = document.querySelectorAll(
            `.${this.#playerOneClassName} > .row-container > .set`
        );

        this.#playerTwoSetSquares = document.querySelectorAll(
            `.${this.#playerTwoClassName} > .row-container > .set`
        );
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

    setTurnReadyEvent() {
        const readyBtns = document.querySelectorAll(".turn-ready-btn");

        readyBtns.forEach((btn) => {
            btn.addEventListener("click", (event) => {
                this.onReady(btn);
            });
        });
    }

    onReady(btn) {
        if (this.#winner) {
            return;
        }
        this.#boardReadySound.play();
        this.changeMsg(`${this.#currentTurn}: It's your turn.`);
        if (this.#currentTurn === "Player 1") {
            this.#ui.showShips(this.#playerOneSetSquares);
            this.#ui.hideShips(this.#playerTwoSetSquares);
        } else if (this.#currentTurn === "Player 2") {
            this.#ui.showShips(this.#playerTwoSetSquares);
            this.#ui.hideShips(this.#playerOneSetSquares);
        }

        this.#ready = true;

        btn.classList.toggle("hidden");
    }

    setAttackLogic(square, coordsId) {
        if (!this.#ready) {
            return;
        }

        const parentBoard = square.parentNode.parentNode;

        if (
            parentBoard.classList.contains("player-two") &&
            this.#currentTurn === "Player 2"
        ) {
            this.changeMsg(
                `${
                    this.#currentTurn
                }: Friendly Fire will not be tolerated, click the opponent's board.`
            );
            this.#errorSound.play();
            return;
        } else if (
            parentBoard.classList.contains("player-one") &&
            this.#currentTurn === "Player 1"
        ) {
            this.changeMsg(
                `${
                    this.#currentTurn
                }: Friendly Fire will not be tolerated, click the opponent's board.`
            );
            this.#errorSound.play();
            return;
        }

        const playerOne = this.game.getPlayerOne();
        const playerTwo = this.game.getPlayerTwo();

        const playerOneHitsStr = this.game
            .getHits(this.#playerOneClassName)
            .join("-");
        const playerTwoHitsStr = this.game
            .getHits(this.#playerTwoClassName)
            .join("-");

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

        if (!this.#attacking) {
            this.#ready = false;
            this.changeTurn();

            this.#ui.hideShips(this.#playerOneSetSquares);
            this.#ui.hideShips(this.#playerTwoSetSquares);
        }

        this.checkForWin(playerOne, playerTwo);

        if (!this.#winner && !this.#attacking) {
            setTimeout(
                () => this.changeMsg(`${this.#currentTurn}: Get ready!`),
                750
            );
        }

        console.log(this.game.getPlayers());
    }

    attack(playerGameboard, playerClassName, coordsArr) {
        playerGameboard.receiveAttack(coordsArr);
        const currentHits = this.game.getHits(playerClassName);
        const currentMisses = this.game.getMisses(playerClassName);
        this.#ui.renderHits(currentHits, playerClassName);
        this.#ui.renderMisses(currentMisses, playerClassName);
        this.#ui.renderSunkHits(playerGameboard.board, playerClassName);
        const currentMessage = playerGameboard.getCurrentMessage();

        this.changeMsg(currentMessage);

        if (currentMessage === "Hit!") {
            this.#attacking = true;
            this.#ready = true;
            const overlappedShot = new Audio(shotAudio);
            overlappedShot.play();

            this.changeMsg(`${this.#currentTurn}: Hit, Keep attacking!`);
        } else if (currentMessage === "Ship destroyed!") {
            this.#attacking = true;
            this.#ready = true;
            const overlappedExplosion = new Audio(explosionAudio);
            overlappedExplosion.play();
        } else if (currentMessage === "Miss!") {
            this.#attacking = false;
            this.#missSound.play();
        }
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

        this.#winner = true;

        this.#winSound.play();

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

    toggleReadyBtn() {
        const playerClassName =
            this.#currentTurn === "Player 1"
                ? this.#playerOneClassName
                : this.#playerTwoClassName;
        const btn = document.querySelector(
            `.turn-ready-btn.${playerClassName}`
        );

        btn.classList.toggle("hidden");
    }

    changeTurn() {
        this.#currentTurn =
            this.#currentTurn === "Player 1" ? "Player 2" : "Player 1";

        if (this.#currentTurn === "Player 1") {
            this.toggleReadyBtn(this.#playerTwoClassName);
        } else if (this.#currentTurn === "Player 2") {
            this.toggleReadyBtn(this.#playerOneClassName);
        }
    }
}
