class Player {
    constructor(gameboard, type) {
        this.gameboard = gameboard;
        this.type = type;
    }

    getBoard() {
        return this.gameboard.board;
    }
}

export { Player };
