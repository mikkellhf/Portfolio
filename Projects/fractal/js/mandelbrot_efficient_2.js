import { getColor } from "./colorUtils.js";
import { setupCanvas } from "./fractalUtils.js";

const mandelbrotCanvas = document.getElementById("mandelbrotCanvas");
const ctxMandelbrot = mandelbrotCanvas.getContext("2d");

const mandelbrotResolutionSelect = document.getElementById("mResolutionSelect");
let resolutionMandelbrot = parseInt(mandelbrotResolutionSelect.value);

const thresholdSquared = 4; // Escape radius squared
const maxIterations = 3000;
const zoom = 2.5;
const xOffset = -0.75;
const yOffset = 0;
const samplesPerPixel = 4; // Total samples in 2x2 grid

// Helper function to check if a point is in the main cardioid or period-2 bulb
function isInMainCardioidOrBulb(x, y) {
    const q = (x - 0.25) * (x - 0.25) + y * y;
    if (q * (q + (x - 0.25)) < 0.25 * y * y) return true;
    return (x + 1) * (x + 1) + y * y < 0.0625;
}

// Draw a single line of the Mandelbrot set
function plotLine(py) {
    const width = mandelbrotCanvas.width;
    const imgData = ctxMandelbrot.createImageData(width, 1); // Create ImageData for one line
    const data = imgData.data;

    for (let px = 0; px < width; px++) {
        let rTotal = 0, gTotal = 0, bTotal = 0;

        // Take multiple samples per pixel for anti-aliasing (2x2 grid)
        for (let sx = 0; sx < 2; sx++) {
            for (let sy = 0; sy < 2; sy++) {
                const x0 = ((px + sx / 2) / width - 0.5) * zoom + xOffset;
                const y0 = ((py + sy / 2) / width - 0.5) * zoom + yOffset;

                // Skip calculations for points within main cardioid or period-2 bulb
                if (isInMainCardioidOrBulb(x0, y0)) continue;

                let x = 0, y = 0, iteration = 0, x2 = 0, y2 = 0;
                while (x2 + y2 <= thresholdSquared && iteration < maxIterations) {
                    y = (x + x) * y + y0;
                    x = x2 - y2 + x0;
                    x2 = x * x;
                    y2 = y * y;
                    iteration++;
                }

                // Get color based on iteration count using getColor
                const color = getColor(iteration, "mandelbrot");
                rTotal += color[0];
                gTotal += color[1];
                bTotal += color[2];
            }
        }

        // Average color for anti-aliasing
        const r = Math.floor(rTotal / samplesPerPixel);
        const g = Math.floor(gTotal / samplesPerPixel);
        const b = Math.floor(bTotal / samplesPerPixel);

        setPixel(data, px, r, g, b);
    }

    // Render the calculated line on the canvas
    ctxMandelbrot.putImageData(imgData, 0, py);

    ctxMandelbrot.putImageData(imgData, 0, mandelbrotCanvas.width-py-1);

    // Draw mirrored line on the other side

    // Request the next line to be processed
    if (py + 1 < mandelbrotCanvas.height / 2) {
        requestAnimationFrame(() => plotLine(py + 1));
    }
}

// Function to set a pixel in the ImageData object
function setPixel(data, x, r, g, b) {
    const index = 4 * x;
    data[index] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = 255; // Full opacity
}

// Start the progressive rendering of the Mandelbrot set
function plotMandelbrot() {
    plotLine(0); // Start rendering from the top line
}

// Initialize canvas and plot Mandelbrot
setupCanvas(mandelbrotCanvas, ctxMandelbrot, resolutionMandelbrot);
plotMandelbrot();

document.getElementById('drawMandelbrot').addEventListener('click', () => {
    resolutionMandelbrot = document.getElementById("mResolutionSelect").value;
    setupCanvas(mandelbrotCanvas, ctxMandelbrot, resolutionMandelbrot);
    plotMandelbrot();
});
