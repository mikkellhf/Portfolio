
import {setupCanvas, animateLines} from './fractalUtils.js';

const mandelbrotCanvas = document.getElementById("mandelbrotCanvas");
const ctxMandelbrot = mandelbrotCanvas.getContext("2d");

const mandelbrotResolutionSelect = document.getElementById("mResolutionSelect");
let resolutionMandelbrot = parseInt(mandelbrotResolutionSelect.value); // Get initial resolution



// Plotting Mandelbrot set with smooth coloring and supersampling
function plotMandelbrot() {
    const zoom = 1.6;
    const xOffset = -0.75;
    const yOffset = 0;

    animateLines(resolutionMandelbrot, ctxMandelbrot, zoom, xOffset, yOffset, 'mandelbrot');
}

// Initialize canvas and plot Mandelbrot
setupCanvas(mandelbrotCanvas, ctxMandelbrot, resolutionMandelbrot);
plotMandelbrot();


// Event listener for resolution change

document.getElementById('drawMandelbrot').addEventListener('click', () => {
    resolutionMandelbrot = document.getElementById("mResolutionSelect").value;
    setupCanvas(mandelbrotCanvas, ctxMandelbrot, resolutionMandelbrot);
    plotMandelbrot(); // Re-render with default constant
});
