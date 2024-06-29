// terminal.js

document.addEventListener('DOMContentLoaded', (event) => {
    var term = new Terminal();
    term.open(document.getElementById('terminal'));
    let myBuffer = [];
    let acceptedCommands = {
        Help: ["help", "Help"],
        NaughtNCross: ["XandO", "XO,", "xo", "krydsogbolle", "KrydsOgbolle", "NaughtAndCrosses", 'NaughtNCross']
      };
    term.write('$ ')
    
    //Take the given command (after enter was pressed on xterminal) and convert it to 
    //the corrosponding server command
    const commandHandlers = {
        Help: () => {
          return 'Available commands: help, NaughtNCross';
        }
      };
    
    const executeCommand = async (input) => {
        for (let command in acceptedCommands) {
            if (acceptedCommands[command].includes(input)) {
                try {
                    const output = await commandHandlers[command]();
                    term.write('\n\x1B[F\n' + output + '\n\x1B[F\n$ ');
                } catch (err) {
                    term.write('\n\x1B[F\n' +'Error: ' + err.toString() + '\n\x1B[F\n$ ');
                }
                return;  
            }
        }

        term.write('\n\x1B[F\n'+ 'Command not recognized: ' + input + '\n\x1B[F\n$ ');
    };

  
   term.onKey(async (e) => {
    console.log(e);
    const char = e.key;
    if (char === '\r') {
      const command = myBuffer.trim();
      term.write('\n'); // Move to the next line before executing the command
      await executeCommand(command);
      myBuffer = '';
    } else if (char === '\u007F') { // Handle backspace
      if (myBuffer.length > 0) {
        myBuffer = myBuffer.slice(0, -1);
        term.write('\b \b');
      }
    } else {
      myBuffer += char;
      term.write(char);
    }
  });

  
});