export const maxIterations = 2500

export function grayColor(iterations) {
    if (iterations === maxIterations) {
        return [0, 0, 0]; // Black for points in the set
    }
    const factor = Math.sqrt(iterations / maxIterations); // Scale the intensity
    const intensity = Math.floor(255 * factor); // Scale to 255

    // Increase brightness by a factor (e.g., 1.5)
    const brightenedIntensity = Math.min(255, Math.round(intensity * 10));

    return [brightenedIntensity, brightenedIntensity, brightenedIntensity]; // RGB grayscale
}

export function warpColor(iterations) {
    if (iterations === maxIterations) {
        return [0, 0, 0]; // Black for points in the set
    }

    const halfIterations = maxIterations / 2 - 1; // Adjusted for 0-index
    let r, g, b;

    if (iterations <= halfIterations) {
        r = Math.floor(scale(Math.max(1, iterations))); // Scale red
        g = 0;
        b = 0;
    } else {
        r = 255; // Keep red at max
        g = scale(iterations - halfIterations); // Scale green
        b = 0;
    }

    return [r, Math.min(255, g), b]; // Ensure green doesn't exceed 255
}

function scale(i) {
    return Math.round((2.0 * (i - 1) / maxIterations) * 10000); // Scale to max intensity (255)
}



let colorPalette = [];

export function generateRandomColors(size) {
    colorPalette = [];
    for (let i = 0; i < size; i++) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        colorPalette.push([r, g, b]);
    }
}

export function randomColor(iterations) {
    if (iterations === maxIterations) {
        return [0, 0, 0]; // Black for points in the set
    }
    return colorPalette[iterations % colorPalette.length]; // Use modulo for index
}
