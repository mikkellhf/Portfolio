window.addEventListener('load', function() {
    const canvas = document.getElementById('fractal');
    const ctx = canvas.getContext('2d');
    const root = document.documentElement;

    canvas.width = 500;
    canvas.height = 500;
    
    //canvas settings
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    // ctx.shadowColor = 'rgba(0,0,0,0.7)';
    // ctx.shadowOffsetX = 10;
    // ctx.shadowOffsetX = 5;
    // ctx.shadowBlur = 10;
    
   
    //Settings
    //Sides: How many equally distiruted branches
    //Size: The intial size of a line
    //maxLevels: The depth of the fractal, ie how many times it split
    //Scale: Size of child branch compared to parten
    //Spread: The angle new branches are created away from each other
    //Branches: The number of branches created pr side (how many times it splits)


    //Outcomment to use predefined fractal settings    
    // const settings = getComputedStyle(root).getPropertyValue('--snowflake').trim().split(', ');
    // let sides = settings[0];
    // let size = settings[1];
    // let maxLevels = settings[2];
    // let scale = settings[3];
    // let spread = settings[4];
    // let branches = settings[5];

    let sides = 3;
    let size = 50;
    let maxLevels = 4;
    let scale = 0.8;
    let spread = 0.6;
    let branches = 2;

    
    function drawBranch (level) {
        if (level > maxLevels) return;       
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size, 0);
        ctx.stroke();
        for (let i = 0; i < branches; i++) {
            ctx.save();
            ctx.translate(size - (size/branches) * i, 0);
            ctx.rotate(spread);
            ctx.scale(scale, scale);
            drawBranch(level + 1);
            ctx.restore();
            
            ctx.save();
            ctx.translate(size - (size/branches) * i, 0);
            ctx.rotate(-spread);
            ctx.scale(scale, scale);
            drawBranch(level + 1);
            ctx.restore();
        }
    }

    function drawFractal () {
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        for (let i = 0; i < sides; i++) {
            drawBranch(0);
            ctx.rotate((Math.PI * 2) / sides);
        }
        ctx.restore();
    }
    drawFractal();

});


