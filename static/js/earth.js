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
    
    var extraPoint = document.createElement("p");
    extraPoint.textContent = "+1";
    extraPoint.style.position = "absolute";

    extraPoint.style.opacity = 0; // Inicia invisible
    extraPoint.style.transition = "opacity 0.2s ease-in"; // Fade-in rápido

    let EarthRec = canvas.getBoundingClientRect();

    let top = EarthRec.top + (Math.random() * EarthRec.height);
    let left = EarthRec.left + Math.random() * EarthRec.width;

    extraPoint.style.top = top + "px";
    extraPoint.style.left = left + "px";
    extraPoint.style.pointerEvents = "none"; // Evita que el <p> reciba eventos de puntero
    document.body.appendChild(extraPoint);

    // Función para realizar el fade-in y fade-out
    function fadeEffect() {
      // Fade in
      setTimeout(() => {
          extraPoint.style.opacity = 1;
      }, 0);

      // Fade out después de cierto tiempo (ej. 1.5 segundos)
      setTimeout(() => {
          extraPoint.style.transition = "opacity 1s ease-out"; // Fade-out más largo
          extraPoint.style.opacity = 0;
      }, 1000); // El fade-out ocurre después de 1.5 segundos del fade-in
    }

    // Llamamos a la función para que se ejecute la animación
    fadeEffect();

    // Remover el elemento después de que desaparezca
    setTimeout(() => {
      extraPoint.remove();
    }, 2000); // Se remueve después de 2.5 segundos (tiempo total)


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
