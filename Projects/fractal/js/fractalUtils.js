import {
    getColor
} from './colorUtils.js';

const baseMaxIterations = 2000; // Base maximum iterations, can adjust for starting detail level
const thresholdSquared = 10;

/**
 * Simple function used to set up a canvas
 * @param canvas
 * @param ctx
 * @param resolution
 */
export function setupCanvas(canvas, ctx, resolution) {
    canvas.width = resolution;
    canvas.height = resolution;

    const container = document.querySelector('.canvas-container');
    const displaySize = Math.min(container.clientWidth, container.clientHeight);

    canvas.style.width = displaySize + 'px';
    canvas.style.height = displaySize + 'px';

    const scale = resolution / displaySize;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

// Function to dynamically adjust max iterations based on zoom level
function calculateMaxIterations(zoom) {
    return Math.floor(baseMaxIterations * Math.log10(zoom + 1));
}

/**
 * Determines whether a complex number tends to infinity (or lies within the set). It then an
 * appropriate color for that iteration
 * @param z_real
 * @param z_im
 * @param c_real
 * @param c_im
 * @param set_type
 * @param maxIterations
 * @returns {[number,number,number]}
 */
export function checkComplexNumber(z_real, z_im, c_real, c_im, set_type, maxIterations) {
    for (let i = 0; i < maxIterations; i++) {
        const z_real2 = z_real * z_real;
        const z_im2 = z_im * z_im;

        if (z_real2 + z_im2 > thresholdSquared) {
            // Smooth coloring adjustment
            const log_zn = Math.log(z_real2 + z_im2) / 2;
            const nu = Math.log(log_zn / Math.log(2)) / Math.log(2);
            const smoothIteration = i + 1 - nu; // Fractional iteration value for smooth transition

            return getColor(smoothIteration, maxIterations, set_type);
        }

        const temp = z_real2 - z_im2 + c_real;
        z_im = 2 * z_real * z_im + c_im;
        z_real = temp;
    }

    // Return black for points inside the set
    return [0, 0, 0];
}


/**
 * This finds n samples around the given pixel, and then calculates the color for those pixels.
 * The average of that is then used as the color for the original pixel
 * This ensures a smooth illustration
 * @param x
 * @param y
 * @param zoom
 * @param xOffset
 * @param yOffset
 * @param resolution
 * @param set_type
 * @param c_real
 * @param c_im
 * @returns {number[]}
 */
function superSample(x, y, zoom, xOffset, yOffset, resolution, set_type, c_real = 0, c_im = 0) {
    const samples = 4;
    let rTotal = 0, gTotal = 0, bTotal = 0;
    const maxIterations = calculateMaxIterations(zoom);

    for (let i = 0; i < samples; i++) {
        const randomX = x + Math.random();
        const randomY = y + Math.random();

        let z_real = 0;
        let z_im = 0;
        let color = [0, 0, 0];

        if (set_type === 'mandelbrot') {
            c_real = (randomX - resolution / 2) * 4 / (zoom * resolution) + xOffset;
            c_im = (randomY - resolution / 2) * 4 / (zoom * resolution) + yOffset;
            color = checkComplexNumber(z_real, z_im, c_real, c_im, set_type, maxIterations);
        } else if (set_type === 'julia') {
            z_real = (randomX - resolution / 2) * 4 / (zoom * resolution) + xOffset;
            z_im = (randomY - resolution / 2) * 4 / (zoom * resolution) + yOffset;
            color = checkComplexNumber(z_real, z_im, c_real, c_im, set_type, maxIterations);
        }

        rTotal += color[0];
        gTotal += color[1];
        bTotal += color[2];
    }

    return [
        Math.floor(rTotal / samples),
        Math.floor(gTotal / samples),
        Math.floor(bTotal / samples),
    ];
}

/**
 * This draws each pixel in a given row of pixels
 * @param y
 * @param resolution
 * @param ctx
 * @param zoom
 * @param xOffset
 * @param yOffset
 * @param set_type
 * @param c_real
 * @param c_im
 */
function drawLineGeneric(y, resolution, ctx, zoom, xOffset, yOffset, set_type, c_real, c_im) {
    const lineBuffer = ctx.createImageData(resolution, 1);
    let offset = 0;

    for (let x = 0; x < resolution; x++) {
        const color = superSample(x, y, zoom, xOffset, yOffset, resolution, set_type, c_real, c_im);

        lineBuffer.data[offset++] = color[0];
        lineBuffer.data[offset++] = color[1];
        lineBuffer.data[offset++] = color[2];
        lineBuffer.data[offset++] = 255;
    }

    ctx.putImageData(lineBuffer, 0, y);

    if (y < Math.floor(resolution / 2) && set_type === "mandelbrot") {
        ctx.putImageData(lineBuffer, 0, resolution - y - 1);
    }
}

/**
 * This sends each row of pixels to the drawLineGeneric to be draw
 * @param resolution
 * @param ctx
 * @param zoom
 * @param xOffset
 * @param yOffset
 * @param set_type
 * @param c_real
 * @param c_im
 */
export function animateLines(resolution, ctx, zoom, xOffset, yOffset, set_type, c_real, c_im) {
    function animateLine(y, n_lines) {
        if (y <= Math.floor(n_lines)) {
            drawLineGeneric(y, resolution, ctx, zoom, xOffset, yOffset, set_type, c_real, c_im);
            requestAnimationFrame(() => animateLine(y + 1, n_lines));
        }
    }
    let n_lines = set_type === 'mandelbrot' ? resolution / 2 : resolution;

    animateLine(0, n_lines);
}



