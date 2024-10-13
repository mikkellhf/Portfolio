        class ComplexNumber {
            constructor(real, imaginary) {
                this.real = real;
                this.imaginary = imaginary;
            }

            square() {
                return new ComplexNumber(
                    this.real * this.real - this.imaginary * this.imaginary,
                    2 * this.real * this.imaginary
                );
            }

            add(z) {
                return new ComplexNumber(this.real + z.real, this.imaginary + z.imaginary);
            }

            magnitude() {
                return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
            }
        }

        function checkComplexNumberJulia(z, c, maxIterations = 2000) {
            for (let i = 0; i < maxIterations; i++) {
                z = z.square().add(c);
                if (z.magnitude() > 2) {
                    return i;
                }
            }
            return maxIterations;
        }

        function checkComplexNumberMandelbrot(c, maxIterations = 2000) {
            let z = new ComplexNumber(0, 0);
            for (let i = 0; i < maxIterations; i++) {
                z = z.square().add(c);
                if (z.magnitude() > 2) {
                    return i;
                }
            }
            return maxIterations;
        }

        function getColor(iterations, maxIterations) {
            if (iterations === maxIterations) {
                return 'black';
            }
            const hue = Math.floor((iterations / maxIterations) * 360);
            return `hsl(${hue}, 100%, 50%)`;
        }

        function plotComplexNumber(offscreenCanvas, isJulia = false, juliaConstant = null) {
            const offscreenContext = offscreenCanvas.getContext('2d');
            const maxIterations = 2000;
            const width = offscreenCanvas.width;
            const height = offscreenCanvas.height;

            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    const realPart = (x - width / 2) / (width / 4);
                    const imaginaryPart = (y - height / 2) / (height / 4);
                    let c = new ComplexNumber(realPart, imaginaryPart);
                    let iterations;

                    if (isJulia) {
                        iterations = checkComplexNumberJulia(c, juliaConstant, maxIterations);
                    } else {
                        iterations = checkComplexNumberMandelbrot(c, maxIterations);
                    }

                    offscreenContext.fillStyle = getColor(iterations, maxIterations);
                    offscreenContext.fillRect(x, y, 1, 1);
                }
            }
        }

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = 2000;
        offscreenCanvas.height = 2000;

        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 500;
        canvas.height = 500;

        document.getElementById('realPart').addEventListener('input', (event) => {
            document.getElementById('realValue').textContent = event.target.value;
        });

        document.getElementById('imaginaryPart').addEventListener('input', (event) => {
            document.getElementById('imaginaryValue').textContent = event.target.value;
        });

        document.getElementById('drawMandelbrot').addEventListener('click', () => {
            plotComplexNumber(offscreenCanvas);
            ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
        });

        document.getElementById('drawJulia').addEventListener('click', () => {
            const realPart = parseFloat(document.getElementById('realPart').value);
            const imaginaryPart = parseFloat(document.getElementById('imaginaryPart').value);
            const juliaConstant = new ComplexNumber(realPart, imaginaryPart);

            plotComplexNumber(offscreenCanvas, true, juliaConstant);
            ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
        });

        plotComplexNumber(offscreenCanvas);
        ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);