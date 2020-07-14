/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let isGameOver = false;


/** makeBoard: creates an array skeleton for board */
function makeBoard() {
  for (let x = 0; x < HEIGHT; x++) {
    let row = []
    for (let y = 0; y < WIDTH; y++) { 
      row.push(null)
    }
    board.push(row)
  }

}


/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board");

  // Creates slots at the top where the user will select their move.
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Generates the playing board based.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for (let i = HEIGHT-1; i >= 0; i--) {
    if (board[i][x] === null) {
      return i
    }
  }
  return null
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const selectedTable = document.getElementById(`${y}-${x}`)
  const piece = document.createElement("div")
  piece.classList.add("piece")

  piece.classList.add("player" + currPlayer)

  piece.style.animation = `drop${y} 750ms`;

  selectedTable.appendChild(piece)
}


/** endGame: announce game end */
function endGame(msg) {
  alert(msg)
  isGameOver = true
}


/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  if (!isGameOver) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    placeInTable(y, x);
    board[y][x] = currPlayer;

    // check for win
    if (checkForWin()) {
      return endGame(`Player ${currPlayer} won!`);
    }
    // check for tie
    else if (checkForTie()) {
      return endGame("It's a tie!");
    }


    // switch players
    currPlayer = currPlayer === 1 ? 2 : 1;
  }

  function checkForTie() {
    return board.every(row => {
      return row.every(slot => {
        return slot;
      })
    })
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }


  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //Formula to checks if player has 4 pieces horizontally
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];

      //Formula to checks if player has 4 pieces vertically
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];

      //Formula to checks if player has 4 pieces diagonal (going right = /)
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      //Formula to checks if player has 4 pieces diagonal (going left = \)
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      //Ends the game if either return true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
