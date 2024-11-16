package sudoku;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class DefaultController {

    private MineSweeper mineSweeper = new MineSweeper();

    @GetMapping("/generateBoard")
    public String generateBoard(@RequestParam int difficulty) {
        return mineSweeper.GenerateBoard(difficulty);
    }
}
