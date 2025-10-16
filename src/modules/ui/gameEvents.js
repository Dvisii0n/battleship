import UiHandler from "./uiHandler.js";

export default class GameEventHandler {
    #ui = new UiHandler();
    #playerOneClassName = "player-one";
    #playerTwoClassName = "player-two";
    setAttackEvent(game) {
        const squares = document.querySelectorAll(".grid-square");

        squares.forEach((square) => {
            square.addEventListener("click", (event) => {
                const coordsId = event.target.id;

                this.setAttackLogic(square, game, coordsId);
            });
        });
    }

    setAttackLogic(square, game, coordsId) {
        const playerOne = game.getPlayerOne();
        const playerTwo = game.getPlayerTwo();

        const playerOneHitsStr = game
            .getHits(this.#playerOneClassName)
            .join("-");
        const playerTwoHitsStr = game
            .getHits(this.#playerTwoClassName)
            .join("-");

        const parentBoard = square.parentNode.parentNode;

        const coordsArr = this.getCoordsArrFromId(coordsId);

        if (parentBoard.classList.contains(this.#playerOneClassName)) {
            if (!playerOneHitsStr.includes(`${coordsArr}`)) {
                playerOne.gameboard.receiveAttack(coordsArr);
                const currentHits = game.getHits(this.#playerOneClassName);
                const currentMisses = game.getMisses(this.#playerOneClassName);
                this.#ui.renderHits(currentHits, this.#playerOneClassName);
                this.#ui.renderMisses(currentMisses, this.#playerOneClassName);
            }
        } else if (parentBoard.classList.contains(this.#playerTwoClassName)) {
            if (!playerTwoHitsStr.includes(`${coordsArr}`)) {
                playerTwo.gameboard.receiveAttack(coordsArr);

                const currentHits = game.getHits(this.#playerTwoClassName);
                const currentMisses = game.getMisses(this.#playerTwoClassName);
                this.#ui.renderHits(currentHits, this.#playerTwoClassName);
                this.#ui.renderMisses(currentMisses, this.#playerTwoClassName);
            }
        }

        console.log(
            `${
                this.#playerOneClassName
            }: ${playerOne.gameboard.getCurrentMessage()}`
        );
        console.log(
            `${
                this.#playerTwoClassName
            }: ${playerTwo.gameboard.getCurrentMessage()}`
        );
        console.log(game.getPlayers());
    }

    getCoordsArrFromId(coordsId) {
        const coords = coordsId.split("");
        const row = coords[1];
        const col = coords[3];
        return JSON.parse(`[${row}, ${col}]`);
    }
}
