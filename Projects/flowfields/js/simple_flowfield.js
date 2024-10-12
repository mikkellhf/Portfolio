(function() {
    const simplex = new SimplexNoise();
    const CANVAS_SIZE = 500;
    console.log(CANVAS_SIZE)
    let cellSize = document.getElementById('cellSize').value;
    let rows, cols;
    let flowfield;
    let noiseScale = document.getElementById('noiseInput').value;
    let time = 0;
    let particles = [];
    let n_particles = 1000;
    let forceModifier = document.getElementById('speedInput').value;
    let canvas, ctx;
    let animationFrameId;

    // Set up the canvas
    function setup() {
        canvas = document.getElementById('myCanvas');
        ctx = canvas.getContext('2d');
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        setupFlowField();
        updateParticles();
    }

    // Set up the flow field dimensions
    function setupFlowField() {
        rows = Math.floor(CANVAS_SIZE / cellSize);
        cols = rows;
        flowfield = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
    }

    // Function to update particles based on input
    function updateParticles() {
        const numParticlesInput = document.getElementById('numParticles');
        n_particles = parseInt(numParticlesInput.value) || 1000;
        particles = [];
        for (let i = 0; i < n_particles; i++) {
            particles.push(new Particle());
        }
    }

    // Generate flow field based on Simplex noise
    function generateFlowField() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                flowfield[i][j] = noise(i * noiseScale, j * noiseScale, time) * Math.PI * 2;
            }
        }
    }

    // Main draw function
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        generateFlowField();
        time += 0.01;
        ctx.strokeStyle = 'black';
        // Draw the flow lines
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let angle = flowfield[i][j];
                let x = j * (canvas.width / cols);
                let y = i * (canvas.height / rows);
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(canvas.width / cols / 2, 0);
                ctx.stroke();
                ctx.restore();
            }
        }

        // Update and display particles
        for (let particle of particles) {
            particle.update();
            particle.display();
        }

        animationFrameId = requestAnimationFrame(draw);
    }

    // Particle class definition
    class Particle {
        constructor() {
            this.position = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
            this.velocity = { x: 0, y: 0 };
            this.acceleration = { x: 0, y: 0 };
            this.force = forceModifier * Math.random() + 1;
        }

        update() {
            let x = Math.floor(this.position.x / (canvas.width / cols));
            let y = Math.floor(this.position.y / (canvas.height / rows));

            if (x >= 0 && x < cols && y >= 0 && y < rows) {
                let angle = flowfield[y][x];
                this.acceleration = {
                    x: Math.cos(angle) * this.force,
                    y: Math.sin(angle) * this.force,
                };

                this.velocity.x += this.acceleration.x;
                this.velocity.y += this.acceleration.y;

                const speedLimit = 2;
                const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
                if (speed > speedLimit) {
                    this.velocity.x = (this.velocity.x / speed) * speedLimit;
                    this.velocity.y = (this.velocity.y / speed) * speedLimit;
                }

                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
            }

            if (this.position.x > canvas.width || this.position.x < 0 ||
                this.position.y > canvas.height || this.position.y < 0) {
                this.position.x = Math.random() * canvas.width;
                this.position.y = Math.random() * canvas.height;
            }
        }

        display() {
            ctx.fillStyle = 'rgba(0, 100, 100, 0.5)';
            ctx.strokeStyle = 'rgba(0, 100, 100, 0.5)';
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }

    // Noise function using SimplexNoise
    function noise(x, y, z) {
        return simplex.noise3D(x, y, z);
    }

    // Cleanup function to be called before script swap or unload
    function cleanup() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = [];
    }

    // Event listener for updated values
    document.getElementById('numParticles').addEventListener('change', updateParticles);
    document.getElementById('noiseInput').addEventListener('change', () => {
        noiseScale = document.getElementById('noiseInput').value;
    });
    document.getElementById('speedInput').addEventListener('change', () => {
        forceModifier = document.getElementById('speedInput').value;
        for (let particle of particles) {
            particle.force = forceModifier * Math.random() + 1;
        }
    });
    document.getElementById('cellSize').addEventListener('change', () => {
        cellSize = document.getElementById('cellSize').value || 50;
        setupFlowField();
    });

    // Start the sketch
    setup();
    draw();

    // Cleanup before unload
    window.addEventListener('beforeunload', cleanup);

    // Export cleanup function for external script swapping
    window.cleanupFlowfields = cleanup;
})();