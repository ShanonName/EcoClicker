import { AnimatedSprite } from "./animations.js";
import {  DialogueBox  } from "./dialoguebox.js";

let canvas = document.getElementById("gato-canva");
let button = document.getElementById("gato-btn")

let gating = true;

const SPRITE_WIDTH = 40;
const SPRITE_HEIGHT = 50;
const FRAME_COUNT = 2;
const FPS = 5;
const FRAME_DURATION = 1000 / FPS;
let gatX = 0
let gatY = 0

const gatoImg = new Image();
gatoImg.src = gatoImgPath;

const gatoExplosion = new Image();
gatoExplosion.src = gatoExplosionPath;

const gatoClick = new Image();
gatoClick.src = gatoClickPath;

let gatoAnim = {
  "idle": {
      canvas: canvas,
      img: gatoImg,
      frameWidth: SPRITE_WIDTH,
      frameHeight: SPRITE_HEIGHT,
      frameCount: FRAME_COUNT,
      gridCols: 2,
      frameDuration: FRAME_DURATION
    },
  "explosion": {
      canvas: canvas,
      img: gatoExplosion,
      frameWidth: SPRITE_WIDTH,
      frameHeight: SPRITE_HEIGHT,
      frameCount: 7,
      gridCols: 7,
      frameDuration: (1000 / 10),
    },
  "click": {
      canvas: canvas,
      img: gatoClick,
      frameWidth: SPRITE_WIDTH,
      frameHeight: SPRITE_HEIGHT,
      frameCount: 3,
      gridCols: 3,
      frameDuration: ( 1000 / 5 ),
    }

}

// Llamamos a la funcion de animations.js para empezar la animación
const anim = new AnimatedSprite(gatoAnim["idle"]);

let angle = 350;
let velocity = 1;

let margenX = window.innerWidth - window.innerWidth * .02 - 780;
let margenY = window.innerHeight;

// Porque tantos ids, sepa la bola
let animFrameId = null;
let spawnId = null;
let timeoutId = null;

function disable() {
  button.disabled = true;
  button.style.pointerEvents = "none";
  cancelAnimationFrame(animFrameId); // detener cuando desaparece
  animFrameId = null;
  button.style.opacity = "0";
}

function enable() {
  button.style.opacity = "1";
  button.disabled = false;
  button.style.pointerEvents = "auto";
}

function move(velocity, angle) {
  if (!gating) return 0;
  if (button.style.opacity === "0") return 0;

  let rad = (angle * Math.PI) / 180;

  let x = Math.cos(rad) * velocity;
  let y = Math.sin(rad) * velocity;

  gatX += x;
  gatY += y;

  margenX = window.innerWidth - window.innerWidth * .02 - 780;
  margenY = window.innerHeight;

  if (gatX < 0 || gatX > margenX - button.offsetWidth) angle += 180;
  if (gatY < 0 || gatY > margenY - button.offsetHeight) angle += 180;

  button.style.top = gatY + "px";
  button.style.left = gatX + "px";

  return angle;
}

function movimiento() {
  if (button.style.opacity === "0" && animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
    return;
  }

  let variation = (Math.random() - 0.5) * 10;
  angle += variation;

  angle = move(velocity, angle);

  animFrameId = requestAnimationFrame(movimiento);
}

function spawn() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
    return;
  }
  anim.start();
  gatX = Math.random() * (margenX - button.offsetWidth);
  gatY = Math.random() * (margenY - button.offsetHeight);

  button.style.top = gatY + "px";
  button.style.left = gatX + "px";

  console.log("Spawn: seted opacity to 1");
  enable();

  movimiento();

  timeoutId = setTimeout(() => {
    console.log("Despawn: seted opacity to 0");
    disable();
    spawnId = requestAnimationFrame(buenPunto);
  }, 10000)
}

function buenPunto() {
  let r = Math.random() * 100;

  //console.log(r, button.style.opacity)
  //console.log(button.style.opacity == 0)

  if (r < 1 && button.style.opacity === "0") {
    console.log("Cat called");
    if (spawnId) {
      cancelAnimationFrame(spawnId);
      spawnId = null;
    }
    spawn();
  } else {
    spawnId = requestAnimationFrame(buenPunto);
  }
}

button.disabled = true;
button.style.opacity = "0";

document.addEventListener("DOMContentLoaded", buenPunto);

button.addEventListener("click", async (event) => {
  event.stopPropagation();
  console.log("Miau!");
  clearTimeout(timeoutId);

  let response = await fetch("/get-message");
  let data = await response.json();
  console.log(data);
  let textbox = new DialogueBox("MiawStrong", [data["message"]]);
  let barra = document.getElementById("progress");

  barra.style.opacity = "0";
  textbox.enable();
  textbox.write();

  gating = false;
  disable();
  button.style.opacity = "1";
  anim.stop();
  anim.setAnimation(gatoAnim["click"])
  anim.start(() => {
    document.addEventListener("click", () => {
      barra.style.opacity = "1";
      textbox.disable();
      
      anim.setAnimation(gatoAnim["explosion"])
      anim.start(() => {
        anim.stop();
        button.style.opacity = "0";

        gating = true;
        spawnId = requestAnimationFrame(buenPunto);   
        anim.setAnimation(gatoAnim["idle"]);
      });

    }, {"once": true})
  });  
});