const botones = ["Comprar mejora 1", "Comprar mejora 2", "Comprar mejora 3"].map((texto, index) => {
  return {
    index,
    texto,
    accion: () => alert(`Mejora ${index + 1} comprada!`)
  };
});

const menu = document.getElementById("shop-menu");

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

