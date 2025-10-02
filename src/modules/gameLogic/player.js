class Player {
    constructor(gameboard, type) {
        this.gameboard = gameboard;
        this.type = type;
    }

    getBoard() {
        return this.gameboard.board;
    }

    getBoardLength() {
        return Object.keys(this.getBoard()).length;
    }
}

export { Player };
