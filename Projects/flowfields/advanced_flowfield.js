const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const n_particles = 3500;
const root = document.documentElement;

canvas.width = 800;
canvas.height = 800;

//canvas settings
ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';
ctx.lineWidth = 1;



class Particle {
    constructor(effect) {
        this.effect = effect;
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);    
        this.speedX;
        this.speedY;    
        this.speedModifier = Math.floor(Math.random() + 1);
        this.history = [{x: this.x, y: this.y}];
        this.maxLength = Math.floor(Math.random() * 10 + 5);
        this.angle = 0;
        this.newAngle = 0;
        this.angleCorrector = Math.random() * 0.5 + 0.01;
        this.timer = this.maxLength * 2;
        this.colors = getComputedStyle(root).getPropertyValue('--colors1').trim().split(', ');
        this.color = this.colors[Math.floor((Math.random() * this.colors.length))];
    }
    draw (context) {
        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 0; i < this.history.length; i++) {
            context.lineTo(this.history[i].x, this.history[i].y);
        }
        context.strokeStyle = this.color;
        context.stroke();
    }
    update () {
        //Get pos and corrosponding angle for particle
        this.timer--;
        if (this.timer >= 1) {
            let x = Math.floor(this.x / this.effect.cellSize);
            let y = Math.floor(this.y / this.effect.cellSize);
            //Index = y * this.effect.rows + x
            let index = y * this.effect.cols + x;
            if (this.effect.flowField[index]) {
                this.newAngle = this.effect.flowField[index].colorAngle;
                if (this.angle > this.newAngle) {
                    this.angle -= this.angleCorrector;
                } else if (this.angle < this.newAngle) {
                    this.angle += this.angleCorrector;
                } else {
                    this.angle = this.newAngle;
                }

            }
    
            this.speedX = Math.cos(this.angle);
            this.speedY = Math.sin(this.angle);
            this.x += this.speedX * this.speedModifier;
            this.y += this.speedY * this.speedModifier;
    
            this.history.push({x: this.x, y: this.y});
            if (this.history.length > this.maxLength) {
                this.history.shift();
            }
        } else if (this.history.length > 1) {
            this.history.shift();
        } else {
            this.reset();
        }
        
    }
    reset () {
        let attempts = 0;
        let resetSucces = false;
        while (attempts < 50 && !resetSucces) {
            attempts++;
            let testIndex = Math.floor(Math.random() * (this.effect.flowField.length));
            if (this.effect.flowField[testIndex].alpha > 0) {
                this.x = this.effect.flowField[testIndex].x;
                this.y = this.effect.flowField[testIndex].y;
                this.history = [{x: this.x, y: this.y}];
                this.timer = this.maxLength * 2;
                resetSucces = true;
            }
            
        }
        if (!resetSucces) {
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height-20;
            this.history = [{x: this.x, y: this.y}];
            this.timer = this.maxLength * 2;
        }
        
    }
}

class Effect {
    constructor(width, height, n, context) {
        this.width = width;
        this.height = height;
        this.context = context;
        this.particles = [];
        this.n_particles = n;
        this.cellSize = 5;
        this.rows;
        this.cols;
        this.flowField = [];
        this.debug = false;
        this.pixels;

        this.init();


        window.addEventListener('resize', e => {

        })
    }
    init () {
        //Flow field
        this.rows = Math.floor(this.height / this.cellSize);
        this.cols = Math.floor(this.width / this.cellSize);

        this.drawText();

        this.pixels = this.context.getImageData(0, 0, this.width, this.height).data;
        // console.log(this.pixels);
        this.updateFlowField();

        for (let i = 0; i < this.n_particles; i++) {
            this.particles.push(new Particle(this));
        }
        this.particles.forEach(particle => particle.reset());

    }
    updateFlowField() {
        this.flowField = [];
        for (let y = 0; y < this.height; y += this.cellSize) {
            for (let x = 0; x < this.width; x += this.cellSize) {
                const index = (y * this.width + x) * 4;
                const red = this.pixels[index];
                const green = this.pixels[index + 1];
                const blue = this.pixels[index + 2];
                const alpha = this.pixels[index + 3];
                const grayscale = (red + green + blue) / 3;
                //Map from scale (0 -> 255) to angle (0 -> 6.28 (radians))
                const colorAngle = ((grayscale/255) * 6.28).toFixed(2);
                this.flowField.push({
                    x: x,
                    y: y,
                    alpha: alpha,
                    colorAngle: colorAngle,
                });
            }
        }

        // for (let y = 0; y < this.rows; y++) {
        //     for (let x = 0; x < this.cols; x++) {
        //         let angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
        //         this.flowField.push(angle);
        //     }
        // }
    }
    drawText () {
        this.context.font = '150px IMPACT';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';

        const gradient1 = this.context.createLinearGradient(0, 0, this.width, this.height);
        gradient1.addColorStop(0.2, 'rgb(255,0,0)');
        gradient1.addColorStop(0.4, 'rgb(0,255,0)');
        gradient1.addColorStop(0.6, 'rgb(150,100,100)');
        gradient1.addColorStop(0.8, 'rgb(0,255,255)');

        const gradient2 = this.context.createRadialGradient(this.width * 0.5, this.height * 0.5, 10, this.width * 0.5, this.height * 0.5, this.width);
        gradient2.addColorStop(0.2, 'rgb(255,0,0)');
        gradient2.addColorStop(0.4, 'rgb(0,255,0)');
        gradient2.addColorStop(0.6, 'rgb(150,100,100)');
        gradient2.addColorStop(0.8, 'rgb(0,255,255)');
        this.context.fillStyle = gradient2;

        this.context.fillText('Games', this.width * 0.5, this.height * 0.5, this.width);
    }
    drawGrid () {
        this.context.save();
        this.context.strokeStyle = 'red';
        this.context.lineWidth = 0.3;
        for (let c = 0; c < this.cols; c++) {
            this.context.beginPath();
            this.context.moveTo(this.cellSize * c, 0);
            this.context.lineTo(this.cellSize* c, this.height);
            this.context.stroke();
        }
        for (let r = 0; r < this.rows; r++) {
            this.context.beginPath();
            this.context.moveTo(0, this.cellSize * r);
            this.context.lineTo(this.width, this.cellSize * r);
            this.context.stroke();
        }
        this.context.restore();
    }
    render () {
        if (this.debug) {
            this.drawGrid();
            this.drawText();
        }
        
        
        this.particles.forEach(particle => {
            particle.draw(this.context);
            particle.update()
        })
    }
    
}

const effect = new Effect(canvas.width, canvas.height, n_particles, ctx);

function animate () {
    ctx.clearRect(0,0, canvas.width, canvas.width);
    effect.render();
    requestAnimationFrame(animate);
}
animate();