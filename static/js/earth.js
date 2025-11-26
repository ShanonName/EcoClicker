import { AnimatedSprite } from './animations.js';
import { update_bar } from './bar.js';

// Click en el botón
const EarthBtn = document.getElementById('Earth-btn');
const puntos = document.getElementById('puntos');

let scale = 1.3;
const SCALE_DEFAULT = 1.3;
const MAX_SCALE = 1.6;
const SCALE_SPEED = 0.03;

// Lógica del click
if (EarthBtn) {
  EarthBtn.addEventListener('click', function () {
    let newpoints = 1
    fetch("/click/") // Llamar funcion al hacer click (Posiblemente sea bueno cambiar la url idk)
      .then(response => response.json())
      .then(data => {
        puntos.textContent = data.puntuacion;
        update_bar(data.pt)

        let EarthRec = canvas.getBoundingClientRect();

        let top = EarthRec.top + (Math.random() * EarthRec.height);
        let left = EarthRec.left + Math.random() * EarthRec.width;
        crearTextoFlotante(left, top, data["new_score"])
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


// Función separada para mantener el código limpio
function crearTextoFlotante(x, y, cantidad) {
    const extraPoint = document.createElement("p");
    
    // Asignar el valor real que devolvió el servidor
    extraPoint.textContent = "+" + cantidad;
    
    // Estilos básicos para que flote
    extraPoint.style.position = "absolute";
    extraPoint.style.left = `${x}px`; // Posición X del mouse
    extraPoint.style.top = `${y}px`;  // Posición Y del mouse
    extraPoint.style.pointerEvents = "none"; // Para que no interfiera con futuros clicks
    extraPoint.style.color = "white"; // Asegúrate de que se vea
    extraPoint.style.fontWeight = "bold";
    extraPoint.style.fontSize = "20px";
    extraPoint.style.fontFamily = "'Press Start 2P', monospace"; // Tu fuente
    extraPoint.style.zIndex = "100";
    
    // Estilos de transición
    extraPoint.style.opacity = "1";
    extraPoint.style.transition = "all 0.8s ease-out"; // Animación suave

    document.body.appendChild(extraPoint);

    // Forzar un "reflow" para que el navegador procese la posición inicial antes de animar
    // (Un pequeño truco de JS: leer una propiedad de layout fuerza el renderizado)
    extraPoint.getBoundingClientRect();

    // 3. Iniciar la animación (Mover hacia arriba y desvanecer)
    requestAnimationFrame(() => {
        extraPoint.style.top = `${y - 50}px`; // Subir 50px
        extraPoint.style.opacity = "0";       // Desvanecer
    });

    // 4. Eliminar el elemento del HTML después de que termine la animación
    setTimeout(() => {
        extraPoint.remove();
    }, 800); // 800ms coincide con la transición CSS
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
const anim = new AnimatedSprite({
  canvas: canvas,
  img: img,
  frameWidth: FRAME_WIDTH,
  frameHeight: FRAME_HEIGHT,
  frameCount: FRAME_COUNT,
  gridCols: GRID_COLS,
  frameDuration: FRAME_DURATION,
  getScale: () => scale
});

anim.start();