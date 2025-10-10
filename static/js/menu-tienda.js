// Lógica del menú de la tienda

// Opciones de la tienda
const botones = ["Comprar mejora 1", "Comprar mejora 2", "Comprar mejora 3"].map((texto, index) => {
  return {
    index,
    texto,
    accion: () => alert(`Mejora ${index + 1} comprada!`) // aca se maneja la logica de hacer click en el boton
  };
});

const menu = document.getElementById("shop-menu");

// Crear y agregar botones al menú
botones.forEach(b => {
  const btn = document.createElement("button");
  btn.textContent = b.texto;
  btn.onclick = b.accion;
  btn.className = "mejora-btn";
  btn.style.position = "absolute";  
  btn.style.top = `${15 + b.index * (90/6)}%`;
  btn.style.left = "10px";
  menu.appendChild(btn);
});

