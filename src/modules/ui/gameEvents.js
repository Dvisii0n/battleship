import UiHandler from "./uiHandler.js";

export default class GameEventHandler {
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

        const playerOneHits = game.getHits("player-one").join("-");
        const playerTwoHits = game.getHits("player-two").join("-");

        const parentBoard = square.parentNode.parentNode;

        const coordsArr = this.getCoordsArrFromId(coordsId);

        if (parentBoard.classList.contains("player-one")) {
            if (!playerOneHits.includes(`${coordsArr}`)) {
                playerOne.gameboard.receiveAttack(coordsArr);
            }
        } else if (parentBoard.classList.contains("player-two")) {
            if (!playerTwoHits.includes(`${coordsArr}`)) {
                playerTwo.gameboard.receiveAttack(coordsArr);
            }
        }

        console.log(game.getPlayers());
    }

    getCoordsArrFromId(coordsId) {
        const coords = coordsId.split("");
        const row = coords[1];
        const col = coords[3];
        return JSON.parse(`[${row}, ${col}]`);
    }
}
