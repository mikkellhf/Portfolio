

document.getElementById('settings-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    updateSettings();
});
function updateSettings() {
    // Retrieve values from input fields
    let sides = parseInt(document.getElementById('Sides').value, 10);
    let size = parseFloat(document.getElementById('Size').value);
    let depth = parseInt(document.getElementById('Depth').value, 10);
    let scale = parseFloat(document.getElementById('Scale').value);
    let spread = parseFloat(document.getElementById('Spread').value);
    let branches = parseInt(document.getElementById('Branches').value, 10);

    const pickedColors = [
        document.getElementById('c1').value,
        document.getElementById('c2').value,
    ]


    console.log(pickedColors); // This will log the array of colors to the console
    const canvas = document.getElementById('fractal');
    const ctx = canvas.getContext('2d');

    canvas.width = innerWidth * 4 / 5;
    canvas.height = innerHeight;
    // Canvas settings
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    
    const colors = createColors(depth, pickedColors);
    console.log("colors", colors); // This will log the array of colors to the console

    let settings = [sides, size, depth, scale, spread, branches, colors];
    drawFractal(settings, ctx, canvas);
}

window.addEventListener('load', function() {
    const canvas = document.getElementById('fractal');
    const ctx = canvas.getContext('2d');

    canvas.width = innerWidth * 4 / 5;
    canvas.height = innerHeight ;
    // Canvas settings
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    let sides = 3;
    let size = innerHeight / 6;
    let depth = 4;
    let scale = 0.8;
    let spread = 0.6;
    let branches = 2;
    let numberColors = 1;

    const pickedColors = [
        document.getElementById('c1').value,
        document.getElementById('c2').value]

    console.log(pickedColors); // This will log the array of colors to the console
    document.getElementById('Sides').value = sides;
    document.getElementById('Size').value = size;
    document.getElementById('Depth').value = depth;
    document.getElementById('Scale').value = scale;
    document.getElementById('Spread').value = spread;
    document.getElementById('Branches').value = branches;
    
    const colors = createColors(pickedColors,depth);
    console.log("colors", colors); // This will log the array of colors to the console

    let settings = [sides, size, depth, scale, spread, branches, colors];
    drawFractal(settings, ctx, canvas);
});

function drawBranch(level, size, maxLevels, scale, spread, branches, ctx, colors) {
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
        drawBranch(level + 1, size, maxLevels, scale, spread, branches, ctx, colors);
        ctx.restore();

        ctx.save();
        ctx.translate(size - (size / branches) * i, 0);
        ctx.rotate(-spread);
        ctx.scale(scale, scale);
        drawBranch(level + 1, size, maxLevels, scale, spread, branches, ctx, colors);
        ctx.restore();
    }
}

function drawFractal(settings, ctx, canvas) {
    let [sides, size, maxLevels, scale, spread, branches, colors] = settings;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    for (let i = 0; i < sides; i++) {
        drawBranch(0, size, maxLevels, scale, spread, branches, ctx, colors);
        ctx.rotate((Math.PI * 2) / sides);
    }
    ctx.restore();
}


function createColors(colors, depth) {
    // Check if colors array has at least two elements and both are defined
    if (!colors || colors.length < 2 || !colors[0] || !colors[1]) {
        console.error('Invalid colors array. Please provide an array with at least two valid hex colors.');
        return [];
    }

    // Assuming colors are in hex format, e.g., #ff00ff
    const color1 = colors[0].substring(1); // Remove '#' from hex
    const color2 = colors[1].substring(1); // Remove '#' from hex
    let gradientColors = []; // Properly initialize the array

    var hex = function(x) {
        x = x.toString(16);
        return (x.length == 1) ? '0' + x : x;
    };

    for (let i = 0; i < depth; i++) { // Loop through the entire depth
        var r = Math.ceil(parseInt(color1.substring(0,2), 16) * (1 - i / (depth - 1)) + parseInt(color2.substring(0,2), 16) * (i / (depth - 1)));
        var g = Math.ceil(parseInt(color1.substring(2,4), 16) * (1 - i / (depth - 1)) + parseInt(color2.substring(2,4), 16) * (i / (depth - 1)));
        var b = Math.ceil(parseInt(color1.substring(4,6), 16) * (1 - i / (depth - 1)) + parseInt(color2.substring(4,6), 16) * (i / (depth - 1)));
        gradientColors.push('#' + hex(r) + hex(g) + hex(b)); // Add '#' to make it a valid hex color
    }

    return gradientColors;
}
