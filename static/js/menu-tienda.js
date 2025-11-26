import { AnimatedSprite } from "./animations.js"
// Lógica del menú de la tienda

// Opciones de la tienda
const botones = ["Voluntario", "Jaula", "Punto Limpio", "Industria"].map((texto, index) => {
  return {
    index,
    texto,
    img: imgsPath + "/tienda/"+texto+".png",
    accion: () => alert(`Mejora ${index + 1} comprada!`) // aca se maneja la logica de hacer click en el boton
  };
});

const menu = document.getElementById("shop-menu");
const canva = document.getElementById("shop");

const SPRITE_WIDTH = 780;
const SPRITE_HEIGHT = 780;
const FRAME_COUNT = 1;
const FPS = 1;
const FRAME_DURATION = 1000 / FPS;

const img = new Image();
img.src = shopPath;

let anim = new AnimatedSprite({
  canvas: canva,
  img: img,
  frameWidth: SPRITE_WIDTH,
  frameHeight: SPRITE_HEIGHT,
  frameCount: FRAME_COUNT,
  gridCols: 3,
  frameDuration: FRAME_DURATION
})

anim.start();

// Crear y agregar botones al menú
botones.forEach(b => {
  const btn = document.createElement("button");
  btn.innerHTML = `<span class="mejora-name">${b.texto}</span><span class="mejora-precio">$1</span>`;
  btn.onclick = b.accion;
  
  btn.style.backgroundImage = `url('${b.img}')`;
  btn.style.backgroundRepeat = 'no-repeat';
  btn.style.backgroundSize = 'cover';
  btn.style.backgroundPosition = 'center';
  
  btn.style.position = "absolute";
  btn.style.width = "294px";
  btn.style.height = "90px";

  btn.style.top = `${30 + b.index * (13)}%`;
  btn.style.left = "245px";

  btn.style.backgroundColor = "transparent";
  btn.style.cursor = "pointer";
  menu.appendChild(btn);
});

