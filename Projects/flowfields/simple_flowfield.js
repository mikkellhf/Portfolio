(function() {
    // Initialize SimplexNoise instance
    const simplex = new SimplexNoise();

    // Initialize variables
    let flowfield;
    let rows = 75; // Example row size
    let cols = 75; // Example column size
    let noiseScale = 5; // Scale for Simplex noise
    let time = 0.1; // Variable to drive movement
    let particles = []; // Array to hold particles
    let n_particles = 1000; // Default number of particles
    let canvas;
    let ctx;

    // Set up the canvas
    function setup() {
        canvas = document.getElementById('myCanvas');
        ctx = canvas.getContext('2d');
        canvas.width = 500;
        canvas.height = 500;

        flowfield = new Array(rows + 1).fill(0).map(() => new Array(cols + 1).fill(0));

        // Initialize particles
        updateParticles();
    }

    // Function to update particles based on input
    function updateParticles() {
        const numParticlesInput = document.getElementById('numParticles');
        n_particles = parseInt(numParticlesInput.value) || 1000; // Get value from input
        particles = []; // Clear existing particles

        for (let i = 0; i < n_particles; i++) {
            particles.push(new Particle());
        }
    }

    // Generate flow field based on Simplex noise
    function generateFlowField() {
        for (let i = 0; i < rows + 1; i++) {
            for (let j = 0; j < cols + 1; j++) {
                 // Randomness over time
                flowfield[i][j] = noise(i * noiseScale, j * noiseScale, time) * Math.PI * 2;
            }
        }
    }

    // Main draw function
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        generateFlowField(); // Re-generate the flow field to create movement
        time += 0.01; // Increment time to create the motion effect

        // Draw the flow lines
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let angle = flowfield[i][j];
                let x = j * (canvas.width / cols);
                let y = i * (canvas.height / rows);
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(canvas.width / cols / 2, 0); // Draw a line that shows the flow
                ctx.stroke();
                ctx.restore();
            }
        }

        // Update and display particles
        for (let particle of particles) {
            particle.update();
            particle.display();
        }

        requestAnimationFrame(draw); // Request the next frame
    }

    // Particle class definition
    class Particle {
        constructor() {
            this.position = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
            this.velocity = { x: 0, y: 0 };
            this.acceleration = { x: 0, y: 0 };
            this.force = 1; // Magnitude of movement
        }

        update() {
            let x = Math.floor(this.position.x / (canvas.width / cols));
            let y = Math.floor(this.position.y / (canvas.height / rows));

            // Ensure particle is within bounds of flowfield
            if (x >= 0 && x < cols && y >= 0 && y < rows) {
                let angle = flowfield[y][x]; // Get flow field angle at particle position
                this.acceleration = {
                    x: Math.cos(angle) * this.force,
                    y: Math.sin(angle) * this.force,
                }; // Create a vector from the angle

                this.velocity.x += this.acceleration.x;
                this.velocity.y += this.acceleration.y;

                // Limit speed
                const speedLimit = 2;
                const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
                if (speed > speedLimit) {
                    this.velocity.x = (this.velocity.x / speed) * speedLimit;
                    this.velocity.y = (this.velocity.y / speed) * speedLimit;
                }

                this.position.x += this.velocity.x; // Update position
                this.position.y += this.velocity.y;
            }

            // Check if the particle is out of bounds and respawn if it is
            if (this.position.x > canvas.width || this.position.x < 0 ||
                this.position.y > canvas.height || this.position.y < 0) {
                this.position.x = Math.random() * canvas.width; // Respawn at a random position
                this.position.y = Math.random() * canvas.height; // Respawn at a random position
            }
        }

        display() {
            ctx.fillStyle = 'rgba(0, 100, 100, 0.5)';
            ctx.strokeStyle = 'rgba(0, 100, 100, 0.5)';
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2); // Draw the particle
            ctx.fill();
            ctx.stroke();
        }
    }

    // Noise function using SimplexNoise
    function noise(x, y, z) {
        return simplex.noise3D(x, y, z); // Use the 3D noise function
    }

    // Event listener for updating particles
    document.getElementById('updateParticles').addEventListener('click', updateParticles);

    // Ensure canvas resizes when the window is resized
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth * 0.5;
        canvas.height = window.innerHeight * 0.5;
    });

    // Start the sketch
    setup();
    draw();
})();
