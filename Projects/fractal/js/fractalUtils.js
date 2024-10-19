import {
    generateRandomColors,
    getColor,
    maxIterations
} from './colorUtils.js'; // Adjust the path as needed

const threshold_squared = 4;

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



// Main complex number check function
export function checkComplexNumber(z_real, z_im, c_real, c_im, set_type) {
    for (let i = 0; i < maxIterations; i++) {
        const z_real2 = z_real * z_real;
        const z_im2 = z_im * z_im;

        // Check if the point escapes
        if (z_real2 + z_im2 > threshold_squared) {
            return getColor(i, set_type); // Get the color based on iterations
        }

        // Update z for the next iteration
        const temp = z_real2 - z_im2 + c_real;
        z_im = 2 * z_real * z_im + c_im;
        z_real = temp;
    }

    return [0, 0, 0]; // Belongs to the set (black)
}



function superSample(x, y, zoom, xOffset, yOffset, resolution, set_type, c_real = 0, c_im = 0) {
    const samples = 4; // Number of super samples for antialiasing
    let rTotal = 0, gTotal = 0, bTotal = 0;

    for (let i = 0; i < samples; i++) {
        const randomX = x + Math.random();  // Add randomness to x
        const randomY = y + Math.random();  // Add randomness to y

        // Initialize z at (0,0) for Mandelbrot
        let z_real = 0;
        let z_im = 0;

        // Set c_real and c_im based on the set type
        if (set_type === 'mandelbrot') {
            c_real = (randomX - resolution / 2) * 4 / (zoom * resolution) + xOffset;
            c_im = (randomY - resolution / 2) * 4 / (zoom * resolution) + yOffset;
        } else if (set_type === 'julia') {
            z_real = (randomX - resolution / 2) * 4 / (zoom * resolution) + xOffset;
            z_im = (randomY - resolution / 2) * 4 / (zoom * resolution) + yOffset;
        }

        // Use the check function with the appropriate z and c values
        const color = checkComplexNumber(z_real, z_im, c_real, c_im, set_type);
        rTotal += color[0];
        gTotal += color[1];
        bTotal += color[2];
    }

    // Average the color components over the super samples
    return [
        Math.floor(rTotal / samples),
        Math.floor(gTotal / samples),
        Math.floor(bTotal / samples),
    ];
}

function drawLineGeneric(y, resolution, ctx, zoom, xOffset, yOffset, set_type, c_real, c_im) {
    const lineBuffer = ctx.createImageData(resolution, 1);  // Buffer for drawing a line at a time
    let offset = 0;

    for (let x = 0; x < resolution; x++) {
        // Perform super sampling for anti-aliasing
        const color = superSample(x, y, zoom, xOffset, yOffset, resolution, set_type, c_real, c_im);

        // Set pixel color in the buffer
        lineBuffer.data[offset++] = color[0]; // R
        lineBuffer.data[offset++] = color[1]; // G
        lineBuffer.data[offset++] = color[2]; // B
        lineBuffer.data[offset++] = 255;      // A (full opacity)
    }

    // Draw the line at position y
    ctx.putImageData(lineBuffer, 0, y);

    // Draw mirrored line on the other side
    if (y < Math.floor(resolution / 2)) {
        ctx.putImageData(lineBuffer, 0, resolution - y - 1);
    }
}

export function animateLines(resolution, ctx, zoom, xOffset, yOffset, set_type, c_real, c_im) {
    function animateLine(y) {
        if (y <= Math.floor(resolution / 2)) {
            drawLineGeneric(y, resolution, ctx, zoom, xOffset, yOffset, set_type, c_real, c_im);
            requestAnimationFrame(() => animateLine(y + 1));
        }
    }
    animateLine(0);  // Start rendering from the top
}



// Initial random color generation
generateRandomColors(256);
