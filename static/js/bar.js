
// Variables
var bar = document.getElementById("bar");
var L = 1
let necesario_primer_nivel = 100;
let r = 1.5

let lastPL = necesario_primer_nivel
let PL = necesario_primer_nivel

let isBonusActive = false;
let bonusAnimationFrame;
let savedScore = 0;

export function update_bar(puntaje) {
  savedScore = puntaje;

  if (isBonusActive) {
    check_level_up_logic(puntaje); 
    return; 
  }

  let porcentaje = (puntaje / PL) * 100

  check_level_up_logic(puntaje);

  /*
  if (puntaje >= PL) {
    L += 1
    lastPL = PL
    PL = necesario_primer_nivel * (Math.pow(r, L))
    bar.style.background = '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
  */
  if (puntaje >= 100) {
    porcentaje = ((puntaje - lastPL) / (PL - lastPL)) * 100
  }

  bar.style.width = porcentaje + "%"
}

function check_level_up_logic(puntaje) {
  if (puntaje >= PL) {
    L += 1;
    lastPL = PL;
    PL = necesario_primer_nivel * (Math.pow(r, L));
    
    // Solo cambiamos el color aleatorio si NO estamos en modo bonus
    if (!isBonusActive) {
        bar.style.background = '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
  }
}

export function load_level(puntaje) {
  while (puntaje >= PL) {
    L += 1
    lastPL = PL
    PL = necesario_primer_nivel * (Math.pow(r, L))
  }

  return L
}

export function activate_bonus_mode(durationSeconds = 10) {
  if (isBonusActive) return; // Evitar activar doble si ya está corriendo

  isBonusActive = true;
  
  // 1. Añadir clase visual (Gradiente)
  bar.classList.add("bonus-active");
  
  // Guardamos el color original para restaurarlo después (si usabas background inline)
  const originalBackground = bar.style.background; 
  bar.style.background = ""; // Limpiamos el color inline para que se vea el gradiente CSS

  const startTime = Date.now();
  const endTime = startTime + (durationSeconds * 1000);

  // 2. Función de Loop de Animación (Cuenta regresiva)
  function loop() {
    const now = Date.now();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
      // --- TERMINÓ EL TIEMPO ---
      end_bonus_mode(originalBackground);
    } else {
      // Calcular porcentaje de tiempo restante (de 100% a 0%)
      const percentageLeft = (timeLeft / (durationSeconds * 1000)) * 100;
      bar.style.width = percentageLeft + "%";
      
      // Siguiente frame
      bonusAnimationFrame = requestAnimationFrame(loop);
    }
  }

  // Iniciar el loop
  loop();
}

function end_bonus_mode(originalColor) {
  isBonusActive = false;
  cancelAnimationFrame(bonusAnimationFrame);

  // 1. Quitar clase visual
  bar.classList.remove("bonus-active");
  
  // 2. Restaurar color (o generar uno nuevo si prefieres)
  bar.style.background = originalColor || '#' + Math.floor(Math.random() * 16777215).toString(16);

  // 3. Forzar una actualización inmediata para que la barra vuelva a mostrar el nivel real
  update_bar(savedScore);
}