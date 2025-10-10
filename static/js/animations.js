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
    // Configuración inicial
    const ctx = canvas.getContext('2d');
    let currentFrame = 0;
    let lastFrameTime = 0;

    // Dibuja los frames (se entiende no sean wns)
    function drawFrame(frame) {
        // limpiar display
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const col = frame % gridCols; // columna actual
        const row = Math.floor(frame / gridCols); // fila actual

        // Obtener escala si se proporciona la función
        const scale = getScale ? getScale() : 1;

        // se guarda el estado actual del contexto y se posiciona para volver a dibujar
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Aplicar escala
        ctx.scale(scale, scale);

        // Desactivar suavizado para evitar el blur
        ctx.imageSmoothingEnabled = false;

        // Dibuja el frame
        ctx.drawImage(
            img,
            col * frameWidth, row * frameHeight, frameWidth, frameHeight,
            -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight
        );
        ctx.restore();
    }

    // funcion pa animar la wea
    function animate(time) {
        if (time - lastFrameTime > frameDuration) { // si ha pasado el tiempo para el siguiente frame
            drawFrame(currentFrame); // dibuja el frame actual
            currentFrame = (currentFrame + 1) % frameCount; // avanza al siguiente frame
            lastFrameTime = time; // actualiza el tiempo del último frame
        }
        requestAnimationFrame(animate); // pide el siguiente frame
    }

    // Cuando carga la imagen se carga la animación
    img.onload = function() {
        requestAnimationFrame(animate);
    };
}
