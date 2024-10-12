(function() {
    const simplex = new SimplexNoise();

    let canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const root = document.documentElement;

    canvas.width = 500;
    canvas.height = 500;

    // Canvas settings
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;

    // Particle Class
    class Particle {
        constructor(effect) {
            this.effect = effect;
            this.reset();
            this.speedModifier = Math.random() * 5 + 1; // Random speed multiplier
            this.history = [{ x: this.x, y: this.y }];
            this.maxHistoryLength = Math.random() * 15 + 10; // Maximum history length
            this.timer = this.maxHistoryLength * 2; // Timer for particle lifespan
            this.colors = getComputedStyle(root).getPropertyValue('--colors2').trim().split(', ');
            this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.angle = 0;
        }

        // Draw particle's path
        draw(context) {
            context.beginPath();
            context.moveTo(this.history[0].x, this.history[0].y);
            this.history.forEach(point => {
                context.lineTo(point.x, point.y);
            });
            context.strokeStyle = this.color;
            context.stroke();
        }

        // Update particle position and state
        update() {
            if (--this.timer > 0) {
                const gridX = Math.floor(this.x / this.effect.cellSize);
                const gridY = Math.floor(this.y / this.effect.cellSize);
                const index = gridY * this.effect.cols + gridX;
                this.angle = this.effect.flowField[index];

                // Update speed based on flow field
                this.speedX = Math.cos(this.angle);
                this.speedY = Math.sin(this.angle);

                this.x += this.speedX * this.speedModifier;
                this.y += this.speedY * this.speedModifier;

                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > this.maxHistoryLength) this.history.shift();
            } else if (this.history.length > 1) {
                this.history.shift(); // Remove the oldest point
            } else {
                this.reset(); // Reset particle if its lifespan has ended
            }
        }

        // Reset particle position and history
        reset() {
            this.x = Math.random() * this.effect.width | 0;
            this.y = Math.random() * this.effect.height | 0;
            this.history = [{ x: this.x, y: this.y }];
            this.timer = this.maxHistoryLength * 2;
        }
    }

    // Effect Class to manage particles and flow field
    class Effect {
        constructor(width, height, numberOfParticles) {
            this.width = width;
            this.height = height;
            this.cellSize = 20; // Cell size for flow field
            this.particles = Array.from({ length: numberOfParticles }, () => new Particle(this));
            this.debug = false; // Debug mode
            this.noiseScale = 0.1;
            this.rows = 0;
            this.cols = 0;
            this.flowField = [];
            this.time = 0;
            this.updateFlowField();

            this.setupEventListeners();
            this.setupKeyPressEvents();
        }

        // Update the flow field based on current parameters
        updateFlowField() {
            this.time += 0.01;
            this.flowField = [];
            this.rows = Math.floor(this.height / this.cellSize);
            this.cols = Math.floor(this.width / this.cellSize);

            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    const angle = simplex.noise3D(x * this.noiseScale, y * this.noiseScale, this.time) * Math.PI * 2;
                    this.flowField.push(angle);
                }
            }
        }

        // Draw the grid for debugging purposes
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

        // Render all particles and update their states
        render(context) {
            if (this.debug) this.drawGrid(context);
            this.particles.forEach(particle => {
                particle.draw(context);
                particle.update();
            });
        }

        // Setup event listeners for buttons to control the effect
        setupEventListeners() {
            document.getElementById('numParticles').addEventListener('change', this.updateParticles.bind(this));

            document.getElementById('noiseInput').addEventListener('change', () => {
                this.noiseScale = parseFloat(document.getElementById('noiseInput').value) || 0.1;
            });

            document.getElementById('speedInput').addEventListener('change', this.updateSpeedModifiers.bind(this));

            document.getElementById('cellSize').addEventListener('change', () => {
                this.cellSize = parseInt(document.getElementById('cellSize').value) || 20;
                this.updateFlowField();
            });
        }

        updateParticles() {
            const numParticlesInput = parseInt(document.getElementById('numParticles').value) || 1000;
            this.particles = Array.from({ length: numParticlesInput }, () => new Particle(this));
            this.updateFlowField();
        }

        updateSpeedModifiers() {
            const speedModifier = parseFloat(document.getElementById('speedInput').value) || 1;
            this.particles.forEach(particle => {
                particle.speedModifier = speedModifier;
            });
        }

        // Setup key press events for debug toggle
        setupKeyPressEvents() {
            window.addEventListener('keydown', e => {
                if (e.key === 'd') this.debug = !this.debug;
            });
        }
    }

    // Initialize effect with canvas dimensions and number of particles
    const NUMBER_OF_PARTICLES = parseInt(document.getElementById('numParticles').value) || 1000;
    const effect = new Effect(canvas.width, canvas.height, NUMBER_OF_PARTICLES);

    // Animation loop
    let animationFrameId;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.render(ctx);
        effect.updateFlowField();
        animationFrameId = requestAnimationFrame(animate);
    }

    function cleanup() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.particles.forEach(p => p.reset());
    }

    animate();

    // Export cleanup function for external script swapping
    window.cleanupFlowfields = cleanup;
})();