let menu_button = document.getElementById("menu-toggle-btn")
let menu_main = document.getElementById("menu")
let login_button = document.getElementById("session-menu")
let menu_login = document.getElementById("menu-login")
let login_a = document.getElementById("open-login-a")
let bg = document.getElementById("fake-bg");

let stats_menu = document.getElementById("menu-stats")
let stats_button = document.getElementById("stats-button")

menu_button.addEventListener("click", (event) => {
    menu_main.classList.toggle("hidden");
    bg.classList.toggle("hidden");

    if (menu_main.classList.contains("hidden")) {
        disable_menu();
    }
    console.log(menu_main.classList);
})

login_button.addEventListener("click", (event) => {
    console.log(login_button.classList)
    if (login_button.classList.contains("login")){
        menu_login.classList.toggle("hidden");
    } else  {
        window.location.href = logout;
    }
})

if (login_a) {
    login_a.addEventListener("click", function(event) {
        event.preventDefault();

        menu_login.classList.toggle("hidden");
    })
}

stats_button.addEventListener("click", (event) => {
    /*
    <p class="p-stats">
      Puntos: <span id="pts"> {{ puntuacion }}</span><br>
      Puntos Totales: <span id="pt"> 0 </span><br>
      Clicks: <span id="clicks"> 0 </span><br>
      Gatos: <span id="gatos"> 0 </span><br>
      Multiplicador: <span id="multi"> x0 </span><br>
    </p>
    <p class="h4-stats">Mejoras</p>
    <p id="second-stats" class="p-stats second">
      1: 0<br>
      2: 0<br>
      3: 0<br>
      4: 0<br>
    </p>

    {
        "clicks": stat.clicks,
        "puntaje": stat.puntaje,
        "puntaje_total": stat.puntaje_total,
        "gatos": stat.gatos_pulsados,
    }
    */

    let pts = document.getElementById("pts");
    let pt = document.getElementById("pt"); 
    let clicks = document.getElementById("clicks");
    let gatos = document.getElementById("gatos");
    let multi = document.getElementById("multi");
    let mejoras = document.getElementById("second-stats");

    fetch("get-stats/")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            clicks.textContent = data["clicks"];
            pts.textContent = data["puntaje"];
            pt.textContent = data["puntaje_total"];
            gatos.textContent = data["gatos"];
        });

    fetch("get-mejoras")
        .then(response => response.json())
        .then(data => {
            mejoras.innerHTML = ""
            for (let key in data) {
                mejoras.innerHTML += (key + ": " + data[key] + "<br>");
            }
            stats_menu.classList.toggle("hidden");
        })

});

function disable_menu() {
    menu_main.classList.add("hidden");
    menu_login.classList.add("hidden");
    stats_menu.classList.add("hidden");
}