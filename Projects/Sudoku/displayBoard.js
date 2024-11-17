export function displayBoard(byteArray) {
  const boardContainer = document.getElementById('board');
  boardContainer.innerHTML = ''; // Clear existing board

  const height = byteArray[0];
  const width = byteArray[1];
  const boardData = byteArray.slice(2); // Extract the grid data

  for (let row = 0; row < height; row++) {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    for (let col = 0; col < width; col++) {
      const index = row * width + col;
      const cellData = boardData[index];
      const isRevealed = (cellData & 0b00010000) !== 0; // Bit 4 indicates revealed
      const content = cellData & 0b00001111; // Bits 0–3 for bombs/count

      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');

      // Display content if revealed
      if (isRevealed) {
        cellElement.textContent = content;
      }

      // Add flagged appearance (server-side logic should include flag state in the byte array if needed)
      if ((cellData & 0b00100000) !== 0) {
        cellElement.textContent = 'B';
      }

      rowElement.appendChild(cellElement);
    }

    boardContainer.appendChild(rowElement);
  }
}
