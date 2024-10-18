import {animateLines, setupCanvas} from './fractalUtils.js';

const juliaCanvas = document.getElementById("juliaCanvas");
const ctxJulia = juliaCanvas.getContext("2d");

const juliaResolutionSelect = document.getElementById("juliaResolutionSelect");
let resolutionJulia = parseInt(juliaResolutionSelect.value); // Get initial resolution
let defaultC = { real: -0.8, imaginary: 0.156 }; // Default Julia constant

function isInMandelbrotSet(real, imaginary, maxIterations = 1000) {
    let z_real = 0;
    let z_im = 0;
    let n = 0;

    while (n < maxIterations) {
        const z_real2 = z_real * z_real;
        const z_im2 = z_im * z_im;

        // Check for escape
        if (z_real2 + z_im2 > 4) {
            return false; // Not in the Mandelbrot set
        }

        z_im = 2 * z_real * z_im + imaginary; // z' = z^2 + c
        z_real = z_real2 - z_im2 + real; // z' = z^2 + c
        n++;
    }
    return true; // In the Mandelbrot set
}

function plotJulia(c_real, c_im) {
    console.log(c_real,c_im)
    const zoom = 1;
    const xOffset = 0;
    const yOffset = 0;

    animateLines(resolutionJulia, ctxJulia, zoom, xOffset, yOffset, 'julia', c_real, c_im);
}
// Initialize canvas and plot with default parameters
setupCanvas(juliaCanvas, ctxJulia, resolutionJulia);
plotJulia(defaultC.real, defaultC.imaginary); // Plot with default constant

// Event listener for resolution change


document.getElementById('drawJulia').addEventListener('click', () => {

    resolutionJulia = document.getElementById("juliaResolutionSelect").value;
    setupCanvas(juliaCanvas, ctxJulia, resolutionJulia);
    plotJulia(defaultC.real, defaultC.imaginary); // Re-render with default constant
});
function updateJuliaComplexNumber(re, im) {
    const displayElement = document.getElementById('juliaComplexNumber').querySelector('p');
    defaultC.real = re;
    defaultC.imaginary = im;
    displayElement.innerText = `Current Complex Number: (${re}, ${im})`;
}
// Event listener for clicks on the Julia set canvas
mandelbrotCanvas.addEventListener('click', function (event) {
    // Get the mouse click coordinates relative to the canvas
    const rect = mandelbrotCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left; // X coordinate
    const y = event.clientY - rect.top; // Y coordinate

    // Get the canvas size
    const canvasWidth = mandelbrotCanvas.width;  // Actual canvas width
    const canvasHeight = mandelbrotCanvas.height; // Actual canvas height

    // Calculate complex coordinate based on click position
    const centerX = (x / canvasWidth) * 4 - 2; // Map to Mandelbrot's range
    const centerY = (y / canvasHeight) * 4 - 2; // Map to Mandelbrot's range

    // Check if the checkbox is checked
    const findInMandelbrot = document.getElementById('findInMandelbrot').checked;

    if (findInMandelbrot) {
        const searchRange = 1; // Increase search range to find more points
        let found = false;

        // Check the clicked point first
        if (isInMandelbrotSet(centerX, centerY)) {
            updateJuliaComplexNumber(centerX, centerY);
            found = true;
        }

        // If not found, search around the point
        for (let dx = -searchRange; dx <= searchRange; dx += 0.1) {
            for (let dy = -searchRange; dy <= searchRange; dy += 0.1) {
                const real = centerX + dx;
                const imaginary = centerY + dy;

                if (isInMandelbrotSet(real, imaginary)) {
                    updateJuliaComplexNumber(real, imaginary);
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
    } else {
        const real = centerX;
        const imaginary = centerY;
        updateJuliaComplexNumber(real, imaginary);
        plotJulia(real, imaginary);
    }
});

