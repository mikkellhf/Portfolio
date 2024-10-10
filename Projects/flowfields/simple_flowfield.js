const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const n_particles = 1500;
const root = document.documentElement;

canvas.width = 500;
canvas.height = 500;

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
        this.speedModifier = Math.floor(Math.random() * 5 + 1);
        this.history = [{x: this.x, y: this.y}];
        this.maxLength = Math.floor(Math.random() * 60 + 10);
        this.angle = 0;
        this.timer = this.maxLength * 2;
        this.colors = getComputedStyle(root).getPropertyValue('--colors2').trim().split(', ');
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
            this.angle = this.effect.flowField[index];
    
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
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.history = [{x: this.x, y: this.y}];
        this.timer = this.maxLength * 2;
    }
}

class Effect {
    constructor(width, height, n) {
        this.width = width;
        this.height = height;
        this.particles = [];
        this.n_particles = n;
        this.cellSize = 1;
        this.rows;
        this.cols;
        this.flowField = [];
        this.curve = 5;
        this.zoom = 0.001;
        this.debug = false;

        this.init();
        this.setupEventListeners();

        window.addEventListener('keydown', e => {
            console.log(e);
            if (e.key === 'd') this.debug = !this.debug;
        });
    }
    init () {
        //Flow field
        this.rows = Math.floor(this.height / this.cellSize);
        this.cols = Math.floor(this.width / this.cellSize);
        this.updateFlowField();
        for (let i = 0; i < this.n_particles; i++) {
            this.particles.push(new Particle(this));
        }
    }
    updateFlowField() {
        this.flowField = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
                this.flowField.push(angle);
            }
        }
    }
    drawGrid (context) {
        context.save();
        context.strokeStyle = 'red';
        context.lineWidth = 0.3;
        for (let c = 0; c < this.cols; c++) {
            context.beginPath();
            context.moveTo(this.cellSize * c, 0);
            context.lineTo(this.cellSize* c, this.height);
            context.stroke();
        }
        for (let r = 0; r < this.rows; r++) {
            context.beginPath();
            context.moveTo(0, this.cellSize * r);
            context.lineTo(this.width, this.cellSize * r);
            context.stroke();
        }
        context.restore();
    }
    render (context) {
        if (this.debug) this.drawGrid(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update()
        })
    }
    setupEventListeners() {
        const increaseButtonZoom = document.getElementById('increaseButtonZoom');
        const decreaseButtonZoom = document.getElementById('decreaseButtonZoom');
        const increaseButtonCurve = document.getElementById('increaseButtonCurve');
        const decreaseButtonCurve = document.getElementById('decreaseButtonCurve');


        increaseButtonZoom.addEventListener('click', () => {
            this.zoom += 0.1;
            this.updateFlowField(); // Regenerate flow field
        });

        decreaseButtonZoom.addEventListener('click', () => {
            this.zoom -= 0.1;
            this.updateFlowField(); // Regenerate flow field
        });

        increaseButtonCurve.addEventListener('click', () => {
            this.curve += 0.1;
            this.updateFlowField(); // Regenerate flow field
        });
        decreaseButtonCurve.addEventListener('click', () => {
            this.curve -= 0.1;
            this.updateFlowField(); // Regenerate flow field
        });
    }
}

const effect = new Effect(canvas.width, canvas.height, n_particles);
effect.render(ctx);
console.log(effect);

function animate () {
    ctx.clearRect(0,0, canvas.width, canvas.width);
    effect.render(ctx);
    requestAnimationFrame(animate);
}
animate();