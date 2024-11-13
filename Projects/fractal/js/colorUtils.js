
let colorScheme = {
    mandelbrot: document.getElementById("colorSchemeSelectMandel").value,
    julia: document.getElementById("colorSchemeSelectJulia").value,
    mandelbrot_warp: hexToRgb(document.getElementById("c1").value),
    julia_warp: hexToRgb(document.getElementById("c2").value)
};


// Update the color scheme on change
document.getElementById('colorSchemeSelectMandel').addEventListener('change', () => {
    colorScheme.mandelbrot = document.getElementById("colorSchemeSelectMandel").value;
});

document.getElementById('colorSchemeSelectJulia').addEventListener('change', () => {
    colorScheme.julia = document.getElementById("colorSchemeSelectJulia").value;
});

document.getElementById('c1').addEventListener('change', () => {
    colorScheme.mandelbrot_warp = hexToRgb(document.getElementById("c1").value);
});
document.getElementById('c2').addEventListener('change', () => {
   colorScheme.julia_warp = hexToRgb(document.getElementById("c2").value);
});

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    console.log(r,g,b)
    return [r,g,b];
}

/**
 * Simple control flow to return the correct color based on the ColorScheme chosen.
 * @param iterations
 * @param maxIterations
 * @param set_type
 * @returns {[number, number, number]}
 * */
export function getColor(iterations, maxIterations, set_type) {
    const currentScheme = set_type === 'mandelbrot' ? colorScheme.mandelbrot : colorScheme.julia;
    const currentWarpColor = set_type === 'mandelbrot' ? colorScheme.mandelbrot_warp : colorScheme.julia_warp;
    switch (currentScheme) {
        case "warp":
            return warpColor(iterations, currentWarpColor, maxIterations);
        case "random":
            return lch(iterations, maxIterations);
        case "red_black":
            return red_black(iterations, maxIterations);
        case "wiki":
            return wikiColor(iterations, maxIterations);
        default:
            return [0, 0, 0]; // Black for points in the set
    }
}


/**
 * Calculates an HSL and returns the HSL as RBG 
 * @param iteration
 * @param maxIterations
 * @returns {[number, number, number]}
 * */
function red_black(iteration, maxIterations) {
    const hue = (iteration / maxIterations) * 360; // Calculate hue based on iteration
    const saturation = 100; // Full saturation
    const lightness = (iteration < maxIterations) ? 50 : 0; // Dark for max iterations
    return hslToRgb(hue, saturation, lightness); // Convert to RGB
}

/**
 * Converts hsl to RGB and returns the RGB
 * @param hue
 * @param saturation
 * @param lightness
 * @returns {[number, number, number]} */
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

/**
 * Returns the LCH transformed to RGB
 * @param L
 * @param C
 * @param H
 * @returns {[number, number, number]}
 */
function lchToRgb(L, C, H) {
    // Convert LCH to LAB
    const H_rad = (H * Math.PI) / 180; // Convert hue to radians
    const a = Math.cos(H_rad) * C;
    const b_lab = Math.sin(H_rad) * C; // Rename to avoid conflict with RGB 'b'

    // Convert LAB to XYZ
    let y = (L + 16) / 116;
    let x = a / 500 + y;
    let z = y - b_lab / 200;

    const y3 = Math.pow(y, 3);
    const x3 = Math.pow(x, 3);
    const z3 = Math.pow(z, 3);

    y = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787;
    x = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787;
    z = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787;

    // Reference white point (D65)
    const refX = 95.047;
    const refY = 100.0;
    const refZ = 108.883;

    x = x * refX;
    y = y * refY;
    z = z * refZ;

    // Convert XYZ to linear RGB
    x /= 100;
    y /= 100;
    z /= 100;

    let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    let b = x * 0.0557 + y * -0.2040 + z * 1.0570; // Now distinct from LAB 'b'

    // Apply gamma correction (sRGB companding)
    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
    b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

    // Clamp and convert to 0-255 range
    r = Math.min(Math.max(0, r), 1) * 255;
    g = Math.min(Math.max(0, g), 1) * 255;
    b = Math.min(Math.max(0, b), 1) * 255;

    return [Math.round(r), Math.round(g), Math.round(b)];
}


/**
 * Determines the intensity of a pixel, either black or some color times' intensity. 
 * @param iterations
 * @param color
 * @param maxIterations
 * @returns {[number, number, number]}
 * */
function warpColor(iterations, color, maxIterations) {
    if (iterations === maxIterations) {
        return [0, 0, 0]; // Black for points in the set
    }

    const factor = Math.sqrt(iterations / maxIterations); // Scale the intensity
    const intensity = Math.floor(255 * factor*2.8); // Scale to 255

    // Brighten the intensity based on the factor
    const brightenedIntensity = Math.min(255, Math.round(intensity));



    return [brightenedIntensity*color[0]/255, brightenedIntensity*color[1]/255, brightenedIntensity*color[2]/255];


}


/**
 * Calculates the LCH (Luminance, Chroma, and Hue) based on the iteration, and returns the corresponding RGB
 * @param iterations
 * @param maxIterations
 * @returns {[number,number,number]}
 */
export function lch(iterations, maxIterations){
    const s = iterations / maxIterations;
    const v = 1.0 - Math.pow(Math.cos(Math.PI * s), 2.0);
    const LCH = [
        75 - (75 * v),
        28 + (75 - (75 * v)),
        Math.pow(360 * s, 1.5) % 360
    ];
    return lchToRgb(LCH[0], LCH[1], LCH[2]);
}

/**
 * This functions returns a color scheme similarly to the one used in Ultra Fractal and Wikipedia
 * It is calculated using a Sin function to create the gradient. C(t) = A * sin(2pit + ø) + B
 * A is the amplitude, and we use 127 for range [0,255], similarly B is the center offset (e.g., 128 for [0,255])
 * @param iterations
 * @param maxIterations
 * @returns {number[]}
 */
export function wikiColor(iterations, maxIterations) {
    const t = iterations / maxIterations;
    const w = 8;
    const o = 0.5;
    return [
        127 * Math.sin(2 * w * Math.PI * t + o) + 128,
        127 * Math.sin(2 * w * Math.PI * t + 2*o) + 128,
        127 * Math.sin(2 * w * Math.PI * t + 4*o) + 128
    ];
}

