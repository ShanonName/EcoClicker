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

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function comprarMejora(idMejora, btnElemento) {
    const csrftoken = getCookie('csrftoken');
    const formData = new FormData();
    
    // Agregamos el ID que espera tu vista de Python
    formData.append('mejora_id', idMejora);

    fetch('/buy-upgrade/', { // Asegúrate que esta URL coincida con tu urls.py
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken // ¡Vital para Django!
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("¡Compra exitosa!", data);

            // 1. Actualizar el precio visual en el botón
            const precioSpan = btnElemento.querySelector('.mejora-precio');
            if (precioSpan) {
                precioSpan.textContent = "$"+data.costo_siguiente;
            }

            // 2. Actualizar la puntuación del jugador en pantalla
            const scoreDisplay = document.getElementById('puntos'); // O el ID que uses
            if (scoreDisplay) {
                scoreDisplay.textContent = data.puntuacion_restante;
            }
            
            // 3. (Opcional) Reproducir sonido de compra, etc.

        } else {
            console.error("Error:", data.error);
            alert("No se pudo comprar: " + data.error);
        }
    })
    .catch(error => {
        console.error('Error en la petición:', error);
    });
}

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
  const formData = new FormData();
  formData.append("mejora_id", b.texto)
  const csrftoken = getCookie('csrftoken');

  fetch("get-price-upgrade/", {
      method: 'POST', 
      headers: {
        'X-CSRFToken': csrftoken // ¡Vital para Django!
      }, 
      body: formData})
    .then(response => response.json())
    .then(data => {
      btn.innerHTML = `<span class="mejora-name">${b.texto}</span><span class="mejora-precio" id="${b.texto}">$${data["price"]}</span>`
    })
  
  btn.onclick = function() {
      comprarMejora(b.texto, this); 
  };
  
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

