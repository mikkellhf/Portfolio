import SimplexNoise from 'https://cdn.jsdelivr.net/npm/simplex-noise@3.0.1/simplex-noise.min.js';

const simplex = new SimplexNoise();

// Setup
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const scale = 10;
const noiseScale = 0.1; // Noise scale factor
canvas.width = 500;
canvas.height = 500;
const rows = Math.floor(canvas.height / scale);
const cols = Math.floor(canvas.width / scale);
const flowfield = new Float32Array(rows * cols);

// Canvas settings
ctx.fillStyle = 'white';
ctx.strokeStyle = 'rgba(0, 0, 100, 0.5)';
ctx.lineWidth = 1;

function setup() {
    generateFlowField();
    draw();
}

function draw() {
    drawFlowField();
}

function drawFlowField(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const index = r * cols + c;
            const angle = flowfield[index];

            // Save the current context state
            ctx.save();

            // Translate and rotate the context
            ctx.translate(c * scale, r * scale);
            ctx.rotate(angle);

            // Draw the line representing the vector
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(scale / 2, 0); // Line length can be adjusted
            ctx.stroke();

            // Restore the original context state
            ctx.restore();
        }
    }
}

function generateFlowField() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const index = r * cols + c;
            // simple correction from `map` function range
            // `simplex.noise2D` returns values in range [-1, 1],
            // so correct range mapping on line below from [-1, 1] to [0, Math.PI * 2]
            flowfield[index] = map(simplex.noise2D(r * noiseScale, c * noiseScale), -1, 1, 0, Math.PI * 2);
        }
    }
}

function map(value, start1, stop1, start2, stop2) {
    return start2 + ((value - start1) * (stop2 - start2)) / (stop1 - start1);
}

// Initialize setup
setup();