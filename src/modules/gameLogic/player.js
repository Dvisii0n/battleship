class Player {
    constructor(gameboard, type) {
        this.gameboard = gameboard;
        this.type = type;
    }

    printBoard() {
        console.log(this.type + ":");
        console.log(this.gameboard);
    }
}

export { Player };
