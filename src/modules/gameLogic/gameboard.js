class Ship {
    constructor(length, shipName) {
        this.name = shipName;
        this.length = length;
        this.hits = 0;
        this.sunk = false;
    }

    hit() {
        return (this.hits += 1);
    }

    isSunk() {
        const sunkedStatus = this.hits === this.length;
        this.sunk = sunkedStatus;
        return sunkedStatus;
    }
}

class GameBoard {
    constructor(size) {
        this.size = size;
        this.board = this.#initializeBoard(this.size);
        this.length = Object.keys(this.board).length;
        this.placedShips = [];
        this.currentMessage = "";
        this.misses = [];
        this.sunkShips = [];
        this.shipCount = 5;
    }

    #initializeBoard(size) {
        const sizeArr = size.split("x");
        const width = sizeArr[0];
        const height = sizeArr[1];

        let board = {};
        for (let row = 0; row < height; row++) {
            board[row] = [];
            for (let col = 0; col < width; col++) {
                board[row][col] = 0;
            }
        }

        return board;
    }

    #getPosition(coordsArr) {
        return { y: coordsArr[0], x: coordsArr[1] };
    }

    #allShipsSunk() {
        return this.sunkShips.length === this.shipCount;
    }

    #isPlaced(shipName) {
        return this.placedShips.find((item) => item === shipName);
    }

    allShipsArePlaced() {
        console.log(this.board);
        return this.placedShips.length === this.shipCount;
    }

    clearCurrentMessage() {
        return (this.currentMessage = "");
    }

    changeCurrentMessage(msg) {
        return (this.currentMessage = msg);
    }

    getCurrentMessage() {
        return this.currentMessage;
    }

    getBoardLength() {
        return this.board.length;
    }

    #calculateSpaceOnAxisY(rowN, colN) {
        let spacesArr = [];
        for (let row = rowN; row < this.length; row++) {
            this.board[row][colN] === 0 ? spacesArr.push(0) : spacesArr.push(1);
        }

        const availableSpace = spacesArr.slice(0, spacesArr.indexOf(1)).length;

        return availableSpace;
    }

    clearBoard() {
        this.board = this.#initializeBoard(this.size);
        this.placedShips = [];
        this.currentMessage = "";
    }

    placeShip(shipName, shipLength, coords, axis) {
        if (this.#isPlaced(shipName)) {
            return this.changeCurrentMessage("Ship already placed");
        }

        const pos = this.#getPosition(coords);
        const col = pos.x;
        const row = pos.y;
        if (this.board[row][col] !== 0) {
            return this.changeCurrentMessage("Space already taken");
        }

        const spaceAvailableOnAxisX = this.board[row].slice(col).length;
        const spaceAvailableOnAxisY = this.#calculateSpaceOnAxisY(row, col);

        const ship = new Ship(shipLength, shipName);

        if (ship.length <= spaceAvailableOnAxisX && axis === "x") {
            this.board[row][col] = ship;
            for (let i = 0; i < ship.length; i++) {
                this.board[row][col + i] = ship;
            }
        } else if (ship.length <= spaceAvailableOnAxisY && axis === "y") {
            this.board[row][col] = ship;
            for (let i = 0; i < ship.length; i++) {
                this.board[row + i][col] = ship;
            }
        } else {
            return this.changeCurrentMessage("Ship doesn't fit in this square");
        }

        this.placedShips.push(ship.name);

        this.changeCurrentMessage(
            `Succesfully added ${ship.name} on axis ${axis}`
        );
    }

    recieveAttack(coords) {
        const pos = this.#getPosition(coords);
        const row = pos.y;
        const col = pos.x;
        const ship = this.board[row][col];
        if (ship !== 0) {
            ship.hit();

            if (ship.isSunk()) {
                this.sunkShips.push(ship);
            }

            if (this.#allShipsSunk()) {
                return this.changeCurrentMessage("All ships are sunk");
            }
        } else {
            return this.misses.push(coords);
        }
    }
}

export { GameBoard };
