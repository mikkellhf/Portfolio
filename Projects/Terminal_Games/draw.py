from pynput import keyboard

# Setup
initBoard = [['  -  ','  -  ','  -  '],['  -  ','  -  ','  -  '],['  -  ','  -  ','  -  ']]
size = {'length': 3, 'height': 3}
tile = [['|','¯¯¯¯¯','|'],['|','   ','|'],['|','_____','|']]
initPos = [0,0]
players = ["  X  ", "  O  "]

def drawBoard(board, sizeMap, tile, pos, players, winning_indicies=[]):
    # Clear board
    print("\033c")

    # Add top buffer
    # Create an empty map using a nested list comprehension
    map = [[[
        [cell for cell in row] for row in tile
    ] for _ in range(sizeMap['height'])] for _ in range(sizeMap['length'])]

    # Get board dimensions
    boardDim = (len(board), len(board[0]))

    # Find middle of map, and place middle of board there
    middle = (sizeMap['length'] // 2, sizeMap['height'] // 2)

    # Calculate top-left position to place the board
    start_i = middle[0] - boardDim[0] // 2
    start_j = middle[1] - boardDim[1] // 2

    # Place the board in the map
    for i in range(boardDim[0]):
        for j in range(boardDim[1]):
            # Replace the center part of the tile with the board character
            

            if [i,j] == pos:
                if board[i][j] == players[1]:
                    map[start_i + i][start_j + j][1][1] = '\033[93m' + players[1] + '\033[0m'
                else:
                    map[start_i + i][start_j + j][1][1] = '\033[32;5m' + players[0] + '\033[0m'
            else:
                map[start_i + i][start_j + j][1][1] = board[i][j]
            for winning_indicie in winning_indicies:
                if [i,j] == winning_indicie:
                    map[start_i + i][start_j + j][1][1] = '\033[32;5m' + board[i][j] + '\033[0m'
                    winning_indicies.remove(winning_indicie)
    # Print the map
     # Print the map
    for row in map:
        for tile_row in range(len(tile)):
            print(''.join(''.join(row[i][tile_row]) for i in range(len(row))))

def movefunc(board, move, pos, player):
    if (pos[0] + move[0] < 0) or (pos[0] + move[0] > len(board)-1) or (pos[1] + move[1] < 0) or (pos[1] + move[1] > len(board[0])-1):
        return [board, pos, player]
    
    newPos = [pos[0] + move[0], pos[1] + move[1]]
    return [board, newPos, player]

def make_move(board, pos, player):
    if board[pos[0]][pos[1]] == '  -  ':
        board[pos[0]][pos[1]] = player[0]
        return [board, [player[1], player[0]]]
    else:
        return [board, player]

def check_winner(board):
    n = len(board)
    
    def check_line(line):
        return all(cell == line[0] and cell != '  -  ' for cell in line)

    # Check rows
    for row in board:
        if check_line(row):
            return [[row, j] for j in range(n)]

    # Check columns
    for col in range(n):
        if check_line([board[row][col] for row in range(n)]):
            return [[i, col] for i in range(n)]

    # Check main diagonal
    if check_line([board[i][i] for i in range(n)]):
        return [[i, i] for i in range(n)]

    # Check anti-diagonal
    if check_line([board[i][n - 1 - i] for i in range(n)]):
        return [[i, n - 1 - i] for i in range(n)]
    if all(cell != '  -  ' for row in board for cell in row):
        return ["Tie"]
    # No winner
    return []

def main(board, pos, players):
    game_running = True
    sBoard = [row[:] for row in board]
    sPos = pos[:]
    drawBoard(board, size, tile, pos, players)

    def on_press(key):
        nonlocal board, pos, players, game_running
        move = None
        if key == keyboard.Key.esc:
                print("\033c")
                return False
        elif hasattr(key, 'char') and key.char == ('r'):
            pos = sPos[:]
            board = [row[:] for row in sBoard]
            game_running = True
            drawBoard(board, size, tile, pos, players)
        if game_running:
            if key == keyboard.Key.right:
                move = [0, 1]
            elif key == keyboard.Key.left:
                move = [0, -1]
            elif key == keyboard.Key.up:
                move = [-1, 0]
            elif key == keyboard.Key.down:
                move = [1, 0]
            elif key == keyboard.Key.enter:
                board, players = make_move(board, pos, players)
                if check_winner(board) != []:
                    game_running = False

                    if check_winner(board) == ["Tie"]:
                        drawBoard(board, size, tile, pos, players)
                        print("There is a tie")
                    else:
                        drawBoard(board, size, tile, pos, players, check_winner(board))
                        print("Winner is:" + players[1])
                    print("Press R to restart or ecs to exit")
                else: 
                    drawBoard(board, size, tile, pos, players)
                    
                return 
            if move:
                res = movefunc(board, move, pos, players)
                if pos != res[1]: #ie nothing happend, illegal move
                    board = res[0]
                    pos = res[1]
                    players = res[2]
                    drawBoard(board, size, tile, pos, players)

            
        
    with keyboard.Listener(on_press=on_press,suppress=True) as listener:
        listener.join()

main(initBoard, initPos, players)
