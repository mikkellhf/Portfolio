export const maxIterations = 3000;
const mandelbrot_intensity = { gray: 3, warp: 500, random: 10 };
const julia_intensity = { gray: 2, warp: 5, random: 2 };
let colorScheme = {
    mandelbrot: document.getElementById("colorSchemeSelectMandel").value,
    julia: document.getElementById("colorSchemeSelectJulia").value
};

// Create a color palette bitmap
let colorBitmap = new Array(maxIterations);

// Generate color palette based on current color scheme
function generateColorPalette(set_type) {
    for (let i = 0; i < maxIterations; i++) {
        colorBitmap[i] = getColor(i, set_type); // Use mandelbrot for generating the palette
    }
}

// Update the color scheme on change
document.getElementById('colorSchemeSelectMandel').addEventListener('change', () => {
    colorScheme.mandelbrot = document.getElementById("colorSchemeSelectMandel").value;
    generateColorPalette('mandelbrot'); // Regenerate color palette on scheme change
});

document.getElementById('colorSchemeSelectJulia').addEventListener('change', () => {
    colorScheme.julia = document.getElementById("colorSchemeSelectJulia").value;
    generateColorPalette('julia'); // Regenerate color palette on scheme change
});

// Function to determine color based on the selected color scheme
export function getColor(iterations, set_type) {
    const currentScheme = set_type === 'mandelbrot' ? colorScheme.mandelbrot : colorScheme.julia;

    switch (currentScheme) {
        case "gray":
            return warpColor(iterations, set_type, 'gray');
        case "red":
            return warpColor(iterations, set_type, 'red');
        case "blue":
            return warpColor(iterations, set_type, 'blue');
        case "green":
            return warpColor(iterations, set_type, 'green');
        case "random":
            return randomColor(iterations, set_type);
        case "red_black":
            return red_black(iterations);
        default:
            return [0, 0, 0]; // Black for points in the set
    }
}

// Use bitmap for color retrieval
export function getColorFromBitmap(iterations) {
    if (iterations >= maxIterations) {
        return [0, 0, 0]; // Black for points in the set
    }
    return colorBitmap[iterations]; // Retrieve color from the bitmap
}

function red_black(iteration) {
    const hue = (iteration / maxIterations) * 360; // Calculate hue based on iteration
    const saturation = 100; // Full saturation
    const lightness = (iteration < maxIterations) ? 50 : 0; // Dark for max iterations
    return hslToRgb(hue, saturation, lightness); // Convert to RGB
}

// Convert HSL to RGB
function hslToRgb(hue, saturation, lightness) {
    let r, g, b;
    saturation /= 100;
    lightness /= 100;

    const c = (1 - Math.abs(2 * lightness - 1)) * saturation; // Chroma
    const x = c * (1 - Math.abs((hue / 60) % 2 - 1)); // Second largest component
    const m = lightness - c / 2; // Match value

    if (hue >= 0 && hue < 60) {
        r = c; g = x; b = 0;
    } else if (hue >= 60 && hue < 120) {
        r = x; g = c; b = 0;
    } else if (hue >= 120 && hue < 180) {
        r = 0; g = c; b = x;
    } else if (hue >= 180 && hue < 240) {
        r = 0; g = x; b = c;
    } else if (hue >= 240 && hue < 300) {
        r = x; g = 0; b = c;
    } else {
        r = c; g = 0; b = x;
    }

    // Convert to 0-255 range
    return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255)
    ];
}



function warpColor(iterations, set_type, color) {
    if (iterations === maxIterations) {
        return [0, 0, 0]; // Black for points in the set
    }

    const factor = Math.sqrt(iterations / maxIterations); // Scale the intensity
    const intensity = Math.floor(255 * factor); // Scale to 255

    // Use the appropriate intensity factor based on the set type
    const intensityFactor = set_type === 'mandelbrot' ? mandelbrot_intensity.gray : julia_intensity.gray;

    // Brighten the intensity based on the factor
    const brightenedIntensity = Math.min(255, Math.round(intensity * intensityFactor));

    // Adjust RGB values based on the color chosen
    switch (color) {
        case 'gray':
            return [brightenedIntensity, brightenedIntensity, brightenedIntensity];
        case 'green':
            return [0, brightenedIntensity*2.5, 0];
        case 'blue':
            return [0, 0, brightenedIntensity*2.5];
        case 'red':
            return [brightenedIntensity*2.5, 0, 0];
        default:
            return [brightenedIntensity, brightenedIntensity, brightenedIntensity];
    }
}



let colorPalette = [];

// Function to generate random colors (if needed)
export function generateRandomColors(size) {
    colorPalette = [];
    for (let i = 0; i < size; i++) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        colorPalette.push([r, g, b]);
    }
}

export function randomColor(iterations, set_type) {
    if (iterations === maxIterations) {
        return [0, 0, 0]; // Black for points in the set
    }

    return colorPalette[iterations % colorPalette.length]; // Use modulo for index
}

// Call generateColorPalette initially
generateColorPalette();
