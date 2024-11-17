const backendUrl = "https://sudoku-589270754733.europe-central2.run.app/";
let currentGrid = null; // Store the current grid globally

// Generate the board based on difficulty
export async function generateBoard(difficulty) {
  const boardContainer = document.getElementById('board');
  boardContainer.innerText = "Loading board..."; // Feedback while loading

  try {
    const response = await fetch(`${backendUrl}generateBoard?difficulty=${difficulty}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as an ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer); // Convert to Uint8Array
    currentGrid = byteArray; // Store the grid globally

    // Render the board
    mineSweeperLogic(byteArray);
  } catch (error) {
    console.error('Error fetching data:', error);
    boardContainer.innerText = "Error loading board.";
  }
  document.getElementById('message').innerHTML = "";

}

function mineSweeperLogic(byteArray) {
  const boardContainer = document.getElementById('board');
  boardContainer.innerHTML = ''; // Clear existing board
  const header_size = 3;
  const bombRevealed = byteArray[0];
  const height = byteArray[1];
  const width = byteArray[2];
  const boardData = byteArray.slice(3); // Extract the grid data

  for (let row = 0; row < height; row++) {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    for (let col = 0; col < width; col++) {
      const squareIndex = row * width + col; // Skip metadata
      const cellData = boardData[squareIndex];
      const isRevealed = (cellData & 0b00010000) !== 0; // Bit 4 indicates revealed
      const content = cellData & 0b00001111; // Bits 0–3 for bombs/count
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');

      // Display content if revealed


      // Add flagged appearance (server-side logic should include flag state in the byte array if needed)
      if ((cellData & 0b00100000) !== 0) {
        cellElement.classList.add('flagged');
        cellElement.textContent = '🚩';
      } else if (isRevealed) {
        cellElement.classList.add('revealed');
        if (content == 9) {
          cellElement.textContent = '💣';
          cellElement.classList.add('revealed-bomb');
        } else if (content != 0) {
          cellElement.textContent = content;
          cellElement.classList.add(`num-${content}`)
        }
      } else if (bombRevealed && content == 9) {
        cellElement.classList.add('revealed');
        cellElement.textContent = '💣';
      } else {
        cellElement.classList.add('blank');
      }
      cellElement.addEventListener('click', () =>
          handleLeftClick(squareIndex, "Reveal")
      );
      cellElement.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Prevent default right-click menu
        handleRightClick(squareIndex);
      });
      rowElement.appendChild(cellElement);
    }
    boardContainer.appendChild(rowElement);
  }
  console.log(bombRevealed);

  if (bombRevealed === 0b1) {
    document.getElementById('message').innerHTML = "GAME OVER";
    }
}

async function handleLeftClick(squareIndex) {
  if (currentGrid[0] === 0b1) {
    return;
  }
  try {
    const response = await fetch(`${backendUrl}updateBoard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grid: Array.from(currentGrid), // Convert Uint8Array to an Array for JSON serialization
        square: squareIndex,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const updatedArrayBuffer = await response.arrayBuffer();
    const updatedGrid = new Uint8Array(updatedArrayBuffer);
    currentGrid = updatedGrid; // Update the current grid

    // Re-render the updated board
    mineSweeperLogic(updatedGrid);
  } catch (error) {
    console.error('Error updating board:', error);
  }
}

async function handleRightClick(squareIndex) {
  if (currentGrid[0] === 0b1) {
    return;
  }
  try {
    const response = await fetch(`${backendUrl}flagSquare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grid: Array.from(currentGrid), // Convert Uint8Array to an Array for JSON serialization
        square: squareIndex,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const updatedArrayBuffer = await response.arrayBuffer();
    const updatedGrid = new Uint8Array(updatedArrayBuffer);
    currentGrid = updatedGrid; // Update the current grid

    // Re-render the updated board
    mineSweeperLogic(updatedGrid);
  } catch (error) {
    console.error('Error updating board:', error);
  }
}

