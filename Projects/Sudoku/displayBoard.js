import { MinesweeperLogic } from './minesweeperLogic.js';

let game; // To store the MinesweeperLogic instance

export function displayBoard(boardString) {
    game = new MinesweeperLogic(boardString); // Initialize the game logic
    renderBoard(game.getDisplayBoard()); // Render the initial board
    updateFlagCount(); // Update the flag count display

}

function renderBoard(displayBoard) {
  const boardContainer = document.getElementById('board');
  boardContainer.innerHTML = ''; // Clear the existing board

  displayBoard.forEach((row, rowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');

      // Display the cell content only if revealed or flagged
      cellElement.textContent = cell;

      // Add classes for flagged cells
      if (game.flags[rowIndex][colIndex]) {
        cellElement.classList.add('flagged');
      }

      // Attach a left-click event listener to reveal cells
      cellElement.addEventListener('click', () => {
        if (!game.flags[rowIndex][colIndex]) { // Only reveal if not flagged
          game.revealCell(rowIndex, colIndex);
          renderBoard(game.getDisplayBoard());
          updateFlagCount();
        }
        if (game.checkWin()) {
          document.getElementById('message').innerText = 'Congratulations, You Won!';
        }
      });

      // Attach a right-click event listener to toggle flags
      cellElement.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Prevent the default context menu
        game.toggleFlag(rowIndex, colIndex);
        renderBoard(game.getDisplayBoard());
      });

      rowElement.appendChild(cellElement);
    });

    boardContainer.appendChild(rowElement);
  });
}
function updateFlagCount() {
  const flaggedCount = game.getFlaggedCount();
  document.getElementById('flagCount').innerText = `Flags: ${flaggedCount} / ${game.totalBombs}`;
}