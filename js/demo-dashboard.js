// Matrix Effect Function
function initializeMatrixEffect(canvas) {
    const ctx = canvas.getContext('3d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const chars = '01';
    const columns = Math.floor(canvas.width / 10);
    const drops = Array(columns).fill(0);

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = '12px monospace';

        drops.forEach((y, i) => {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * 10, y);
            drops[i] = y > canvas.height ? 0 : y + 10;
        });
    }
    setInterval(draw, 50);
}

// Apply Matrix Effect to All Relevant Canvases
document.querySelectorAll('.matrix-effect').forEach(initializeMatrixEffect);



const ctx = document.getElementById('heartRateChart').getContext('2d');
        let heartRateData = Array(50).fill(70);
        let chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(50).fill(''),
                datasets: [{
                    label: 'Heart Rate',
                    data: heartRateData,
                    borderColor: '#FE223E',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.2
                }]
            },
            options: {
                responsive: true,
                animation: false,
                scales: {
                    y: { min: 50, max: 120 }
                }
            }
        });
        
        function updateHeartRate() {
            heartRateData.shift();
            heartRateData.push(60 + Math.random() * 40);
            chart.update();
        }
        setInterval(updateHeartRate, 500);
        
        const matrixCanvas = document.getElementById('matrixCanvas');
        const mtxCtx = matrixCanvas.getContext('2d');
        matrixCanvas.width = 600;
        matrixCanvas.height = 300;
        let columns = Math.floor(matrixCanvas.width / 10);
        let drops = Array(columns).fill(0);
        
        function drawMatrix() {
            mtxCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            mtxCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            mtxCtx.fillStyle = '#00FF00';
            mtxCtx.font = '10px monospace';
            drops.forEach((y, index) => {
                let text = Math.random() > 0.5 ? '_______' : '_____________________';
                let x = index * 10;
                mtxCtx.fillText(text, x, y);
                drops[index] = y > matrixCanvas.height ? 0 : y + 10;
            });
        }
        setInterval(drawMatrix, 50);
        
        document.querySelector('.graph-container').addEventListener('mouseover', () => {
            chart.data.datasets[0].borderWidth = 5;
            chart.update();
        });
        document.querySelector('.graph-container').addEventListener('mouseout', () => {
            chart.data.datasets[0].borderWidth = 2;
            chart.update();
        });
