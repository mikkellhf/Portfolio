export class MinesweeperLogic {
  constructor(boardString) {
    this.board = this.parseBoard(boardString); // Convert string to a 2D array
    this.revealed = this.createEmptyRevealedState(); // Track revealed cells
    this.flags = this.createEmptyRevealedState(); // Track flagged cells
    this.totalBombs = this.countBombs(); // Count total bombs on the board
  }

  parseBoard(boardString) {
    return boardString
      .trim()
      .split('\n')
      .map((row) => row.trim().split(/\s+/));
  }

  createEmptyRevealedState() {
    return this.board.map((row) => row.map(() => false));
  }

  countBombs() {
    return this.board.flat().filter((cell) => cell === 'B').length;
  }

  toggleFlag(row, col) {
    if (!this.isInBounds(row, col) || this.revealed[row][col]) {
      return; // Ignore out-of-bounds or already revealed cells
    }
    this.flags[row][col] = !this.flags[row][col]; // Toggle flag state
  }

  revealCell(row, col) {
    if (!this.isInBounds(row, col) || this.revealed[row][col] || this.flags[row][col]) {
      return; // Ignore out-of-bounds, already revealed, or flagged cells
    }

    this.revealed[row][col] = true;

    if (this.board[row][col] === 'B') {
      alert('Game Over! You hit a bomb!'); // Game over logic
    } else if (this.board[row][col] === '0') {
      // Reveal all adjacent cells if the cell is empty
      this.revealAdjacentCells(row, col);
    }
  }

  revealAdjacentCells(row, col) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], /*current*/ [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      if (this.isInBounds(newRow, newCol) && !this.revealed[newRow][newCol]) {
        this.revealCell(newRow, newCol);
      }
    }
  }

  isInBounds(row, col) {
    return row >= 0 && row < this.board.length && col >= 0 && col < this.board[0].length;
  }

  getDisplayBoard() {
    return this.board.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (this.flags[rowIndex][colIndex]) {
          return 'B'; // Display a flag
        } else if (this.revealed[rowIndex][colIndex]) {
          return cell; // Display the cell value if revealed
        }
        return ''; // Cell is hidden
      })
    );
  }

  getFlaggedCount() {
    return this.flags.flat().filter((flag) => flag).length; // Count flagged cells
  }

  checkWin() {
    const correctlyFlaggedBombs = this.board.flat().filter(
      (cell, index) => cell === 'B' && this.flags.flat()[index]
    ).length;

    return correctlyFlaggedBombs === this.totalBombs;
  }
}
