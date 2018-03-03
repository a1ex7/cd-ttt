class Game {
  constructor() {
    this.PLAYER = "player";
    this.PLAYER_O = "player1";
    this.PLAYER_X = "player2";
    this.SIZE = 3;
  }

  newGame() {

    if (!this.restoreGame()) {
      for (var i = 0; i < this.SIZE; i++) {
        this.board[i] = new Array(this.SIZE);
      }
    }

    let board = document.createElement("div");
    board.classList.add("board");

    for (var i = 0; i < this.SIZE; i++) {
      for (var j = 0; j < this.SIZE; j++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = i;
        cell.dataset.col = j;

        cell.addEventListener("click", this.set.bind(this));

        if (this.board[i][j]) {
          cell.classList.add(this.board[i][j]);
        }

        board.appendChild(cell);
      }
    }

    this.info = document.createElement("div");
    this.info.classList.add("info");
    this.info.innerHTML =
      this.current === this.PLAYER_O ? "Player: O" : "Player: X";

    board.appendChild(this.info);
    document.getElementById("app").appendChild(board);
  }

  init() {
    this.info = null;
    this.moves = 0;
    this.current = this.PLAYER_O;
    this.winner = null;
    this.board = [];
  }

  set(e) {
    let clickedCell = e.target;

    let row = clickedCell.dataset.row;
    let col = clickedCell.dataset.col;

    if (
      this.board[row][col] === this.PLAYER_O ||
      this.board[row][col] === this.PLAYER_X
    )
      return;

    this.board[row][col] = this.current;
    this.moves++;
    clickedCell.classList.add(this.PLAYER, this.current);

    this.checkWin();
    this.checkDraw();
    this.nextPlayer();
    this.saveGame();
  }

  blockBoard() {
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; ++i) {
      cells[i].addEventListener('click', () => false);
    }
  }

  isNoFreeCells() {
    for (var i = 0; i < this.SIZE; i++) {
      for (var j = 0; j < this.SIZE; j++) {
        if (!this.board[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  checkWin() {
    let b = this.board;

    for (let row = 0; row < this.SIZE; row++) {
      if (
        b[row][0] !== null &&
        b[row][0] === b[row][1] &&
        b[row][1] === b[row][2]
      ) {
        this.winner = b[row][0];
      }
    }

    for (let col = 0; col < this.SIZE; col++) {
      if (
        b[0][col] !== null &&
        b[0][col] === b[1][col] &&
        b[1][col] === b[2][col]
      ) {
        this.winner = b[0][col];
      }
    }

    if (b[0][0] !== null && b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
      this.winner = b[0][0];
    }

    if (b[0][2] !== null && b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
      this.winner = b[0][2];
    }

    if (this.winner) {
      this.clearSavedGame();
      this.showResult();
      this.blockBoard();
      // this.init();
      this.newGame();
    }
  }

  // Draw = Nobody Won
  checkDraw() {
    if (this.isNoFreeCells() && !this.winner) {
      this.info.innerHTML = "Draw";
      this.clearSavedGame();
      // this.init();
      this.newGame();
    }
  }

  nextPlayer() {
    if (this.current === this.PLAYER_O) {
      this.current = this.PLAYER_X;
    } else {
      this.current = this.PLAYER_O;
    }
    this.info.innerHTML =
      this.current === this.PLAYER_O ? "Player: O" : "Player: X";
  }

  showResult() {

    this.info.classList.add(this.winner);
  }

  saveGame() {
    localStorage.setItem("board", JSON.stringify(this.board));
    localStorage.setItem("current", this.current);
  }

  restoreGame() {
    if (localStorage.getItem("board") && localStorage.getItem("current")) {
      this.board = JSON.parse(localStorage.getItem("board"));
      this.current = localStorage.getItem("current");
      return true;
    }

    return false;
  }

  clearSavedGame() {
    localStorage.removeItem("board");
    localStorage.removeItem("current");
  }
}

const game = new Game();
game.init();
game.newGame();
