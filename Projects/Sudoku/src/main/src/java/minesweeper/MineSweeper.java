package sudoku;

import java.util.Random;

public class MineSweeper {

    private Random rand = new Random();

    public String GenerateBoard(int difficulty) {
        int height, width, bombs;

        // Determine board dimensions and number of bombs based on difficulty
        switch (difficulty) {
            case 1: // Easy
                height = 9;
                width = 9;
                bombs = 10;
                break;
            case 2: // Medium
                height = 16;
                width = 16;
                bombs = 40;
                break;
            case 3: // Hard
                height = 16;
                width = 30;
                bombs = 99;
                break;
            default: // Invalid difficulty
                return "Invalid difficulty level. Please choose 1, 2, or 3.";
        }

        // Initialize grid
        int[][] grid = new int[height][width];

        // Fill the grid with bombs and numbers
        grid = fillGrid(grid, bombs);

        // Convert the grid to a string representation for display
        return gridToString(grid);
    }

    private int[][] fillGrid(int[][] grid, int bombs) {
        int height = grid.length;
        int width = grid[0].length;

        // Place bombs randomly
        while (bombs > 0) {
            int randRow = rand.nextInt(height);
            int randCol = rand.nextInt(width);

            // Place bomb if the cell is empty
            if (grid[randRow][randCol] != -1) {
                grid[randRow][randCol] = -1; // -1 represents a bomb
                bombs--;

                // Increment numbers around the bomb
                for (int i = -1; i <= 1; i++) {
                    for (int j = -1; j <= 1; j++) {
                        int newRow = randRow + i;
                        int newCol = randCol + j;
                        if (isInBounds(newRow, newCol, height, width) && grid[newRow][newCol] != -1) {
                            grid[newRow][newCol]++;
                        }
                    }
                }
            }
        }
        return grid;
    }

    private boolean isInBounds(int row, int col, int height, int width) {
        return row >= 0 && row < height && col >= 0 && col < width;
    }

    private String gridToString(int[][] grid) {
        StringBuilder sb = new StringBuilder();
        for (int[] row : grid) {
            for (int cell : row) {
                if (cell == -1) {
                    sb.append("B "); // Represent bombs as 'B'
                } else {
                    sb.append(cell).append(" ");
                }
            }
            sb.append("\n");
        }
        return sb.toString();
    }
}