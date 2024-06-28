// terminal.js

document.addEventListener('DOMContentLoaded', (event) => {
    var term = new Terminal();
    term.open(document.getElementById('terminal'));
    term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
    let myBuffer = [];

    term.on('key', function(key, e) {
        myBuffer.push(key);
    });

    term.on('lineFeed', function() {
        let keysEntered = myBuffer.join('');  // Or something like that
        
        myBuffer = [];  // Empty buffer
    });
  });


  
  