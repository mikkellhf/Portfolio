const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.strokeStyle = 'black';
ctx.lineWidth = 1;
ctx.lineCap = 'round';
canvas.width = 500;
canvas.height = 500;

function getFractalSettings() {
    const sides = parseInt(document.getElementById('Sides').value, 10);
    const depth = parseInt(document.getElementById('Depth').value, 10);
    const scale = parseFloat(document.getElementById('Scale').value);
    const spread = parseFloat(document.getElementById('Spread').value);
    const branches = parseInt(document.getElementById('Branches').value, 10);
    const pickedColors = [
        document.getElementById('c1').value,
        document.getElementById('c2').value,
    ];

    const colors = createColors(pickedColors, depth);
    return { sides, depth, scale, spread, branches, colors };
}

function calculateAppropriateSize(depth, maxCanvasSize) {
    // Simplified size calculation for appropriate scaling
    return maxCanvasSize / Math.pow(2, depth);
}

function draw() {
    const settings = getFractalSettings(); // Retrieve values from input fields

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate an appropriate size that scales with depth and fits within the canvas
    const maxCanvasSize = Math.min(canvas.width, canvas.height) / 2;
    const size = calculateAppropriateSize(settings.depth, maxCanvasSize);

    drawFractal({ ...settings, size });
}

function drawBranch(level, size, maxLevels, scale, spread, branches, colors) {
    if (level > maxLevels) return;

    ctx.strokeStyle = colors[level];
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, 0);
    ctx.stroke();

    for (let i = 0; i < branches; i++) {
        ctx.save();
        ctx.translate(size - (size / branches) * i, 0);
        ctx.rotate(spread);
        ctx.scale(scale, scale);
        drawBranch(level + 1, size, maxLevels, scale, spread, branches, colors);
        ctx.restore();

        ctx.save();
        ctx.translate(size - (size / branches) * i, 0);
        ctx.rotate(-spread);
        ctx.scale(scale, scale);
        drawBranch(level + 1, size, maxLevels, scale, spread, branches, colors);
        ctx.restore();
    }
}

function drawFractal({ sides, size, depth, scale, spread, branches, colors }) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.save();
    ctx.translate(centerX, centerY); // Move the origin to the center of the canvas
    for (let i = 0; i < sides; i++) {
        drawBranch(0, size, depth, scale, spread, branches, colors);
        ctx.rotate((Math.PI * 2) / sides);
    }
    ctx.restore();
}

function createColors(colors, depth) {
    if (!colors || colors.length < 2 || !colors[0] || !colors[1]) {
        console.error('Invalid colors array. Please provide an array with at least two valid hex colors.');
        return ['#000000', '#FFFFFF']; // Default colors
    }

    const color1 = colors[0].substring(1);
    const color2 = colors[1].substring(1);
    let gradientColors = [];

    const hex = function(x) {
        x = x.toString(16);
        return (x.length === 1) ? '0' + x : x;
    };

    for (let i = 0; i < depth; i++) {
        const r = Math.ceil(parseInt(color1.substring(0, 2), 16) * (1 - i / (depth - 1)) + parseInt(color2.substring(0, 2), 16) * (i / (depth - 1)));
        const g = Math.ceil(parseInt(color1.substring(2, 4), 16) * (1 - i / (depth - 1)) + parseInt(color2.substring(2, 4), 16) * (i / (depth - 1)));
        const b = Math.ceil(parseInt(color1.substring(4, 6), 16) * (1 - i / (depth - 1)) + parseInt(color2.substring(4, 6), 16) * (i / (depth - 1)));
        gradientColors.push('#' + hex(r) + hex(g) + hex(b));
    }

    return gradientColors;
}

// Initial draw
draw();

// Prevent form's default submit behavior and draw fractal on button click
document.getElementById("ApplySettings").addEventListener('click', draw);

// Prevent form submission by pressing Enter key inside inputs
document.getElementById("settings-form").addEventListener('submit', function (event) {
    event.preventDefault();
    draw();
});