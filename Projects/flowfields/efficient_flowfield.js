import SimplexNoise from 'simplex-noise';

const simplex = new SimplexNoise();

// Setup
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const root = document.documentElement;
const scale = 10;
const noiseScale = 0.1; // Noise scale factor
const rows = Math.floor(canvas.height / scale);
const cols = Math.floor(canvas.width / scale);
const flowfield = new Float32Array(rows * cols);
canvas.width = 500;
canvas.height = 500;

// Canvas settings
ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';
ctx.lineWidth = 1;

function setup() {
    generateFlowField();
}

function draw() {
    drawFlowField();
}

function drawFlowField(){
    canvas.stroke(0,0,100)
}
function generateFlowField() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const index = r * cols + c;
            flowfield[index] = map(simplex.noise2D(r * noiseScale, c * noiseScale), 0, 1, 0, Math.PI * 2);
        }
    }
}
function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

// Initialize setup
setup();
draw();