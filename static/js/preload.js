import { load_level, update_bar } from "./bar.js"

async function preload() {
  const respuesta = await fetch("/get-puntuacion")
  const data = await respuesta.json()
  console.log(data)
  document.getElementById("puntos").textContent = data["pt"]
  console.log(data["pt"])
  let L = load_level(data.pt)
  update_bar(data.pt)
}

document.addEventListener("DOMContentLoaded", preload);
