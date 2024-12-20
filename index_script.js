const inputElement = document.getElementById('input');
const terminalElement = document.getElementById('terminal');
const outputContainer = document.getElementById('output-container');
const initialMessage = document.getElementById('initial-message');


let commandHistory = [];
let currentCommandIndex = -1;
let projectsList = ['flowfields', 'fractal'];

// Ensure projects are loaded before any command handling
window.addEventListener('load', async () => {
    displayMessage(displayWelcome());
});

function displayMessage(message) {
    const resultNode = document.createElement('p');
    resultNode.innerHTML = message.replace(/\n/g, '<br>');
    outputContainer.appendChild(resultNode);
    inputElement.value = '';
    scrollToBottom(); // Scroll to the bottom of the terminal
}

function displayWelcome() {
    return`
Welcome to My Web Terminal
========================
This is the terminal for Mikkel Frandsen's projects
help      - Display the help message
`
}

function displayHelp() {
    return `
Help - Available Commands
=========================
help      - Display this help message
greet     - Display a greeting message
date      - Show current date and time
projects  - Displays a list of current projects
clear     - Clears the terminal output but keeps the welcome message
    `;
}

function handleCommand(command) {
    return new Promise((resolve) => {
        switch (command.toLowerCase()) {
            case 'help':
                resolve(displayHelp());
                break;
            case 'greet':
                resolve(`
Hello! Hope you're having a great day!
                `);
                break;
            case 'date':
                const date = new Date().toString();
                resolve(`
${date}
                `);
                break;
            case 'projects':
                resolve(fetchProjects());
                break;
            case 'clear':
                clearTerminal();
                resolve('');
                break;
            default:
                if (projectsList.some(project => project.toLowerCase() === command.toLowerCase())) {
                    const matchedProject = projectsList.find(
                        project => project.toLowerCase() === command.toLowerCase());
                    //Note that if run locally, this should be '/Portfolio/', however for GitHub Pages, it should be 'Portfolio/'
                    window.location.href = `/Portfolio/Projects/${matchedProject.toLowerCase()}/${matchedProject.toLowerCase()}.html`;
                } else {
                    resolve(`
Unknown command: ${command}
                    `);
                }
        }
    });
}

function scrollToBottom() {
    outputContainer.scrollTop = outputContainer.scrollHeight;
}

function clearTerminal() {
    const childrenToRemove = Array.from(outputContainer.children).filter(
        child => child.id !== 'initial-message');
    childrenToRemove.forEach(child => outputContainer.removeChild(child));
    inputElement.value = '';  // Clear current input
    commandHistory = []; // Clear command history to avoid navigating to old commands
    currentCommandIndex = -1;
}

async function fetchProjects() {
    return `
Here are my current projects:
${projectsList.map(project => `    ${project}`).join('\n')}
    `;
}

inputElement.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const command = inputElement.value.trim();

        if (command.toLowerCase() !== 'clear') {
            // Save command to history if it's not the "clear" command
            commandHistory.push(command);
            currentCommandIndex = commandHistory.length;
        }

        handleCommand(command).then((result) => {
            if (result !== '') {
                result = `> ${command}` + result
                displayMessage(result)
            }
        });
    } else if (event.key === 'ArrowUp') {
        if (currentCommandIndex > 0) {
            currentCommandIndex--;
            inputElement.value = commandHistory[currentCommandIndex];
        }
    } else if (event.key === 'ArrowDown') {
        if (currentCommandIndex < commandHistory.length - 1) {
            currentCommandIndex++;
            inputElement.value = commandHistory[currentCommandIndex];
        } else {
            currentCommandIndex = commandHistory.length;
            inputElement.value = '';
        }
    }
});

terminalElement.addEventListener('click', function() {
    inputElement.focus();
});

inputElement.focus();
scrollToBottom(); // Ensure the container is scrolled to the bottom on load