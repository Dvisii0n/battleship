import { GameBoard, Ship } from "../modules/gameLogic/gameboard.js";
import { Player } from "../modules/gameLogic/player.js";

test("player ships get properly placed on different rows", () => {
    const player = new Player(new GameBoard("10x10"), "human");

    const ships = {
        carrier: [new Ship("5", "carrier"), [0, 0]],
        battleship: [new Ship("4", "battleship"), [1, 0]],
        destroyer: [new Ship("3", "destroyer"), [2, 0]],
        submarine: [new Ship("3", "submarine"), [3, 0]],
        patrolBoat: [new Ship("2", "patrol_boat"), [4, 0]],
    };

    for (let ship in ships) {
        const shipObj = ships[ship][0];
        const coords = ships[ship][1];
        player.gameboard.placeShip(shipObj, coords);
    }
    const formation = player.gameboard.board;

    const expectedFormation = {
        0: [
            ships.carrier[0],
            ships.carrier[0],
            ships.carrier[0],
            ships.carrier[0],
            ships.carrier[0],
            0,
            0,
            0,
            0,
            0,
        ],
        1: [
            ships.battleship[0],
            ships.battleship[0],
            ships.battleship[0],
            ships.battleship[0],
            0,
            0,
            0,
            0,
            0,
            0,
        ],
        2: [
            ships.destroyer[0],
            ships.destroyer[0],
            ships.destroyer[0],
            0,
            0,
            0,
            0,
            0,
            0,
            0,
        ],
        3: [
            ships.submarine[0],
            ships.submarine[0],
            ships.submarine[0],
            0,
            0,
            0,
            0,
            0,
            0,
            0,
        ],
        4: [ships.patrolBoat[0], ships.patrolBoat[0], 0, 0, 0, 0, 0, 0, 0, 0],
        5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };

    expect(formation).toEqual(expectedFormation);
});
