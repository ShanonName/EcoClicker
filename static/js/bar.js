
// Variables
var bar = document.getElementById("bar");
var L = 1
let necesario_primer_nivel = 100;
let r = 1.5

let lastPL = necesario_primer_nivel
let PL = necesario_primer_nivel

export function update_bar(puntaje) {
  let porcentaje = (puntaje / PL) * 100

  if (puntaje >= PL) {
    L += 1
    lastPL = PL
    PL = necesario_primer_nivel * (Math.pow(r, L))
    bar.style.background = '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  if (puntaje >= 100) {
    porcentaje = ((puntaje - lastPL) / (PL - lastPL)) * 100
  }

  bar.style.width = porcentaje + "%"
}

export function load_level(puntaje) {
  while (puntaje >= PL) {
    L += 1
    lastPL = PL
    PL = necesario_primer_nivel * (Math.pow(r, L))
  }

  return L
}
