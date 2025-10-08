export function animateSprite({
    canvas,
    img,
    frameWidth,
    frameHeight,
    frameCount,
    gridCols,
    frameDuration,
    getScale // función opcional para obtener escala
}) 
{
    const ctx = canvas.getContext('2d');
    let currentFrame = 0;
    let lastFrameTime = 0;

    function drawFrame(frame) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const col = frame % gridCols; // columna actual
        const row = Math.floor(frame / gridCols); // fila actual

        const scale = getScale ? getScale() : 1;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        ctx.scale(scale, scale);

        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(
            img,
            col * frameWidth, row * frameHeight, frameWidth, frameHeight,
            -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight
        );
        ctx.restore();
    }

    function animate(time) {
        if (time - lastFrameTime > frameDuration) {
            drawFrame(currentFrame);
            currentFrame = (currentFrame + 1) % frameCount;
            lastFrameTime = time;
        }
        requestAnimationFrame(animate);
    }

    img.onload = function() {
        requestAnimationFrame(animate);
    };
}
