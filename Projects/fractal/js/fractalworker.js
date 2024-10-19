import { getColor, maxIterations } from './colorUtils.js'; // Adjust the path as needed

const threshold_squared = 4;

// Main complex number check function
function checkComplexNumber(z_real, z_im, c_real, c_im) {
    for (let i = 0; i < maxIterations; i++) {
        const z_real2 = z_real * z_real;
        const z_im2 = z_im * z_im;

        // Check if the point escapes
        if (z_real2 + z_im2 > threshold_squared) {
            return getColor(i, 'mandelbrot'); // Assuming it's mandelbrot, adapt as needed
        }

        // Update z for the next iteration
        const temp = z_real2 - z_im2 + c_real;
        z_im = 2 * z_real * z_im + c_im;
        z_real = temp;
    }

    return [0, 0, 0]; // Belongs to the set (black)
}

function computeFractalData(resolution, zoom, xOffset, yOffset, setType) {
    const imageData = new Uint8ClampedArray(resolution * resolution * 4); // RGBA
    let index = 0;

    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            const randomX = x + Math.random(); // Random for antialiasing
            const randomY = y + Math.random();

            let z_real = 0;
            let z_im = 0;
            let c_real, c_im;

            if (setType === 'mandelbrot') {
                c_real = (randomX - resolution / 2) * 4 / (zoom * resolution) + xOffset;
                c_im = (randomY - resolution / 2) * 4 / (zoom * resolution) + yOffset;
            } else if (setType === 'julia') {
                z_real = (randomX - resolution / 2) * 4 / (zoom * resolution) + xOffset;
                z_im = (randomY - resolution / 2) * 4 / (zoom * resolution) + yOffset;
                // Set c_real and c_im for Julia set (you can customize these)
                c_real = -0.7;
                c_im = 0.27015;
            }

            const color = checkComplexNumber(z_real, z_im, c_real, c_im);
            imageData[index++] = color[0]; // R
            imageData[index++] = color[1]; // G
            imageData[index++] = color[2]; // B
            imageData[index++] = 255; // A
        }
    }

    return imageData;
}

// Handle messages from the main thread
self.onmessage = function(e) {
    const { resolution, zoom, xOffset, yOffset, setType } = e.data;
    const imageData = computeFractalData(resolution, zoom, xOffset, yOffset, setType);
    self.postMessage(imageData);
};
