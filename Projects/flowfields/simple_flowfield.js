const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const n_particles = 3000;
const root = document.documentElement;

canvas.width = 500;
canvas.height = 500;

// Canvas settings
ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';
ctx.lineWidth = 1;

class Particle {
    constructor(effect) {
        this.effect = effect;
        this.reset();
        this.speedModifier = Math.random() * 5 + 1;
        this.history = [{ x: this.x, y: this.y }];
        this.maxLength = Math.random() * 15 + 10;
        this.timer = this.maxLength * 2;
        this.colors = getComputedStyle(root).getPropertyValue('--colors2').trim().split(', ');
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.angle = 0;
        this.speedX = 0;
        this.speedY = 0;
    }

    draw(context) {
        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);
        for (const point of this.history) {
            context.lineTo(point.x, point.y);
        }
        context.strokeStyle = this.color;
        context.stroke();
    }

    update() {
        if (--this.timer > 0) {
            // Calculate grid position
            const x = (this.x / this.effect.cellSize) | 0; // Use bitwise OR for quick flooring
            const y = (this.y / this.effect.cellSize) | 0;
            const index = y * this.effect.cols + x;
            this.angle = this.effect.flowField[index];

            // Update speed based on flow field angle
            this.speedX = Math.cos(this.angle);
            this.speedY = Math.sin(this.angle);

            this.x += this.speedX * this.speedModifier;
            this.y += this.speedY * this.speedModifier;

            // Update history
            this.history.push({ x: this.x, y: this.y });
            if (this.history.length > this.maxLength) this.history.shift();
        } else if (this.history.length > 1) {
            this.history.shift();
        } else {
            this.reset();
        }
    }

    reset() {
        this.x = Math.random() * this.effect.width | 0; // Use bitwise OR for quick flooring
        this.y = Math.random() * this.effect.height | 0;
        this.history = [{ x: this.x, y: this.y }];
        this.timer = this.maxLength * 2;
    }
}

class Effect {
    constructor(width, height, n) {
        this.width = width;
        this.height = height;
        this.cellSize = 20; // Make the cell size larger for lower computational overhead
        this.particles = Array.from({ length: n }, () => new Particle(this));
        this.curve = 5;
        this.zoom = 0.001;
        this.debug = false;
        this.rows = 0;
        this.cols = 0;
        this.flowField = [];
        this.updateFlowField();

        window.addEventListener('keydown', e => {
            if (e.key === 'd') this.debug = !this.debug;
        });

        this.setupEventListeners();
    }

    updateFlowField() {
        this.flowField = [];
        this.rows = Math.floor(this.height / this.cellSize);
        this.cols = Math.floor(this.width / this.cellSize);

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
                this.flowField.push(angle);
            }
        }
    }

    drawGrid(context) {
        context.save();
        context.strokeStyle = 'red';
        context.lineWidth = 0.3;

        for (let c = 0; c < this.cols; c++) {
            context.beginPath();
            context.moveTo(this.cellSize * c, 0);
            context.lineTo(this.cellSize * c, this.height);
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

    render(context) {
        if (this.debug) this.drawGrid(context);
        for (const particle of this.particles) {
            particle.draw(context);
            particle.update();
        }
    }

    setupEventListeners() {
        const handlers = {
            increaseZoom: () => { this.zoom += 0.001; this.updateFlowField(); },
            decreaseZoom: () => { this.zoom = Math.max(0.001, this.zoom - 0.001); this.updateFlowField(); },
            increaseCurve: () => { this.curve += 0.1; this.updateFlowField(); },
            decreaseCurve: () => { this.curve = Math.max(0.1, this.curve - 0.1); this.updateFlowField(); }
        };

        document.getElementById('increaseButtonZoom').addEventListener('click', handlers.increaseZoom);
        document.getElementById('decreaseButtonZoom').addEventListener('click', handlers.decreaseZoom);
        document.getElementById('increaseButtonCurve').addEventListener('click', handlers.increaseCurve);
        document.getElementById('decreaseButtonCurve').addEventListener('click', handlers.decreaseCurve);
    }
}

const effect = new Effect(canvas.width, canvas.height, n_particles);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render(ctx);
    requestAnimationFrame(animate);
}

animate();