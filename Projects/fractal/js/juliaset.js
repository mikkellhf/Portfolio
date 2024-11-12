import {animateLines, setupCanvas} from './fractalUtils.js';

const juliaCanvas = document.getElementById("juliaCanvas");
const ctxJulia = juliaCanvas.getContext("2d");

const juliaResolutionSelect = document.getElementById("juliaResolutionSelect");
let resolutionJulia = parseInt(juliaResolutionSelect.value); // Get initial resolution
let complex_number = { real: -0.8, imaginary: 0.156 }; // Default Julia constant

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


    const zoom = 1;
    const xOffset = 0;
    const yOffset = 0;

    animateLines(resolutionJulia, ctxJulia, zoom, xOffset, yOffset, 'julia', c_real, c_im);
}
// Initialize canvas and plot with default parameters
setupCanvas(juliaCanvas, ctxJulia, resolutionJulia);
plotJulia(complex_number.real, complex_number.imaginary); // Plot with default constant

// Event listener for resolution change


document.getElementById('drawJulia').addEventListener('click', () => {

    resolutionJulia = document.getElementById("juliaResolutionSelect").value;
    setupCanvas(juliaCanvas, ctxJulia, resolutionJulia);
    plotJulia(complex_number.real, complex_number.imaginary); // Re-render with default constant
});
const mandelbrotCanvas = document.getElementById("mandelbrotCanvas");

mandelbrotCanvas.addEventListener('click', function (event) {
    const rect = mandelbrotCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left; // X coordinate relative to canvas
    const y = event.clientY - rect.top;  // Y coordinate relative to canvas

    const canvasWidth = rect.width;      // Canvas width
    const canvasHeight = rect.height;    // Canvas height

    // Calculate the aspect ratio
    const aspectRatio = canvasWidth / canvasHeight;

    // Determine the scaling factors based on zoom and aspect ratio
    const scaleX = (4 / 1.6) * aspectRatio;
    const scaleY = 4 / 1.6;

    // Map canvas coordinates to complex plane
    const centerX = -0.75;
    const centerY = 0;

    const real = centerX + (x / canvasWidth - 0.5) * scaleX;
    const imag = centerY - (y / canvasHeight - 0.5) * scaleY;

    // Check if the point is in the Mandelbrot set
    if (isInMandelbrotSet(real, imag)) {
        updateJuliaComplexNumber(real, imag);
    } else {
        // Optional: Search nearby points if the clicked point is not in the set
        const searchRange = 0.2; // Adjust as needed
        let found = false;
        for (let dx = -searchRange; dx <= searchRange; dx += 0.01) {
            for (let dy = -searchRange; dy <= searchRange; dy += 0.01) {
                const nearbyReal = real + dx;
                const nearbyImag = imag + dy;
                if (isInMandelbrotSet(nearbyReal, nearbyImag)) {
                    updateJuliaComplexNumber(nearbyReal, nearbyImag);
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
    }
});


// Ensure you have this function defined somewhere in your code
function updateJuliaComplexNumber(re, im) {
    const displayElement = document.getElementById('juliaComplexNumber').querySelector('p');
    displayElement.innerText = `Current Complex Number: (${re}, ${im})`;
    complex_number.real = re;
    complex_number.imaginary = im;
}

