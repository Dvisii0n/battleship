class Ship {
    constructor(length, shipClass) {
        this.shipClass = shipClass;
        this.length = length;
        this.hits = 0;
        this.sunk = false;
        this.currentMessage = "";
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
        this.misses = [];
        this.sunkShips = [];
        this.shipCount = 5;
    }

    #initializeBoard(size) {
        const sizeArr = size.split("x");
        const width = sizeArr[0];
        const height = sizeArr[1];

        let board = {};
        for (let col = 0; col < width; col++) {
            board[col] = [];
            for (let row = 0; row < height; row++) {
                board[col][row] = 0;
            }
        }

        return board;
    }

    #getPosition(coordsArr) {
        return { x: coordsArr[0], y: coordsArr[1] };
    }

    #allShipsSunk() {
        return this.sunkShips.length === this.shipCount;
    }

    placeShip(ship, coords) {
        const pos = this.#getPosition(coords);
        if (this.board[pos.x][pos.y] !== 0) {
            return this.changeCurrentMessage("Space already taken");
        }

        const spaceAvailable = this.board[pos.x].slice(pos.y).length;

        if (ship.length <= spaceAvailable) {
            this.board[pos.x][pos.y] = ship;
            for (let i = 0; i < ship.length; i++) {
                this.board[pos.x][pos.y + i] = ship;
            }
        } else {
            return this.changeCurrentMessage("Ship doesn't fit in this square");
        }
    }

    recieveAttack(coords) {
        const pos = this.#getPosition(coords);
        const ship = this.board[pos.x][pos.y];
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

export { Ship, GameBoard };
