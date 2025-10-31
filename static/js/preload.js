import { load_level, update_bar } from "./bar.js"

async function preload() {
  const respuesta = await fetch("/get-puntuacion")
  const data = await respuesta.json()
  console.log(data)
  document.getElementById("puntos").textContent = data["puntuacion"]
  let L = load_level(data.puntuacion)
  update_bar(data.puntuacion)
}

document.addEventListener("DOMContentLoaded", preload);
