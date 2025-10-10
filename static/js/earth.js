import { animateSprite } from './animations.js';

// Click en el botón
const EarthBtn = document.getElementById('Earth-btn');
const puntos = document.getElementById('puntos');

let scale = 1.3;
const SCALE_DEFAULT = 1.3;
const MAX_SCALE = 1.6;
const SCALE_SPEED = 0.03;

// Lógica del click
if (EarthBtn) {
    EarthBtn.addEventListener('click', function() {
        fetch("/click/") // Llamar funcion al hacer click (Posiblemente sea bueno cambiar la url idk)
                .then(response => response.json())
                .then(data => {
                    puntos.textContent = data.puntuacion;
                });

    // Animacion de escalar y volver a tamaño normal cuando se presiona el boton
    scale = MAX_SCALE;

    function shrinkScale() {
        if (scale > SCALE_DEFAULT) {
            scale -= SCALE_SPEED;
            if (scale < SCALE_DEFAULT) scale = SCALE_DEFAULT;
            requestAnimationFrame(shrinkScale);
        }
    }
    requestAnimationFrame(shrinkScale);
    });
}

// Animación del botón
// Variables
const canvas = document.getElementById('Earth-canvas');

const FRAME_WIDTH = 48;
const FRAME_HEIGHT = 48;
const FRAME_COUNT = 94;
const GRID_COLS = 10;
const FPS = 15;
const FRAME_DURATION = 1000 / FPS;

canvas.width = FRAME_WIDTH * MAX_SCALE;
canvas.height = FRAME_HEIGHT * MAX_SCALE;

const img = new Image();
img.src = btnImgPath;

// Llamamos a la funcion de animations.js para empezar la animación
animateSprite({
    canvas: canvas,
    img: img,
    frameWidth: FRAME_WIDTH,
    frameHeight: FRAME_HEIGHT,
    frameCount: FRAME_COUNT,
    gridCols: GRID_COLS,
    frameDuration: FRAME_DURATION,
    getScale: () => scale
});
