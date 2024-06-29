
# Have a functio that clears the terminal
# Have a class of functions that draws the game board (depending on the game)
    # These functions should call the clear terminal function


def clear_terminal():
    print("\033c", end="")
    return

def draw_game_board():
    clear_terminal()
    print("Drawing the game board...")
    print("This is the game board")
    print("-----------------------")
    print("|     |     |     |")
    print("-----------------------")
    pass

def main():
    print("HEY")
    while (1):
        if (input() == "q"):
            break
        else :
            draw_game_board()
    pass

main()