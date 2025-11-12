// Las clases son clave
export class AnimatedSprite {
  constructor({
    canvas,
    img,
    frameWidth,
    frameHeight,
    frameCount,
    gridCols,
    frameDuration,
    getScale, // funcion opcional para obtener escala
    onFrameRendered
  }) {
    // Variables de la clase
    this.canvas = canvas;
    this.img = img;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameCount = frameCount;
    this.gridCols = gridCols;
    this.frameDuration = frameDuration;
    this.getScale = getScale || (() => 1);

    this.ctx = canvas.getContext("2d");
    this.currentFrame = 0;
    this.lastFrameTime = 0;
    this.running = false;
    this.animId = null;
    this.onFrameRendered = onFrameRendered;
  }

  drawFrame(frame) {
    const ctx = this.ctx;
    // limpiar display
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const col = frame % this.gridCols; // columna actual
    const row = Math.floor(frame / this.gridCols); // fila actual

    // Obtener escala si se proporciona la función
    const scale = this.getScale();

    // se guarda el estado actual del contexto y se posiciona para volver a dibujar
    ctx.save();
    ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

    // Aplicar escala
    ctx.scale(scale, scale);

    // Desactivar suavizado para evitar el blur
    ctx.imageSmoothingEnabled = false;

    // Dibuja el frame
    ctx.drawImage(
      this.img,
      col * this.frameWidth,
      row * this.frameHeight, 
      this.frameWidth, 
      this.frameHeight,
      -this.frameWidth / 2, 
      -this.frameHeight / 2, 
      this.frameWidth, 
      this.frameHeight
    );

    if (this.onFrameRendered) this.onFrameRendered();

    ctx.restore();
  }

  animate(time) {
    if (!this.running || this.canvas.style.opacity === "0") return;

    if (time - this.lastFrameTime > this.frameDuration) { // si ha pasado el tiempo para el siguiente frame
      this.drawFrame(this.currentFrame); // dibuja el frame actual
      this.currentFrame = (this.currentFrame + 1) % this.frameCount; // avanza al siguiente frame
      this.lastFrameTime = time; // actualiza el tiempo del último frame

      if (this.currentFrame == 0 && this.func) {
        this.func();
        this.stop();
        return
      }
    }
    this.animId = requestAnimationFrame(this.animate.bind(this)); // pide el siguiente frame
  }

  start(func) {
    if (!this.running) {
      this.func = func || null;
      this.running = true;
      this.animId = requestAnimationFrame(this.animate.bind(this));
    }
  }

  stop() {
    if (this.running) {
      this.running = false;
      cancelAnimationFrame(this.animId);
    }
  }

  toggle() {
    if (this.running) {
      this.stop();
    } else {
      this.start();
    }
  }

  setAnimation(config) {
    Object.assign(this, config);
    this.currentFrame = 0;
  }
}

/**
 * @deprecated Usa `el objeto AnimatedSprite` en su lugar.
 */
export function animateSprite({
  canvas,
  img,
  frameWidth,
  frameHeight,
  frameCount,
  gridCols,
  frameDuration,
  getScale // función opcional para obtener escala
}) {
  console.warn("Metodo deprecado porfavor usar Animatedsprite");
  // Configuración inicial
  const ctx = canvas.getContext('2d');
  let currentFrame = 0;
  let lastFrameTime = 0;
  let running = false;
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
    if (canvas.style.opacity === "0") return;


    if (time - lastFrameTime > frameDuration) { // si ha pasado el tiempo para el siguiente frame
      drawFrame(currentFrame); // dibuja el frame actual
      currentFrame = (currentFrame + 1) % frameCount; // avanza al siguiente frame
      lastFrameTime = time; // actualiza el tiempo del último frame
    }
    requestAnimationFrame(animate); // pide el siguiente frame
  }

  // Cuando carga la imagen se carga la animación
  img.onload = function () {
    requestAnimationFrame(animate);
  };
}