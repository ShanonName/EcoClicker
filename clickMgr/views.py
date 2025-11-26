from django.shortcuts import redirect, render
from django.contrib import messages
from django.http import JsonResponse
from django.conf import settings
from django.contrib.staticfiles.finders import find
import random
import math
from .models import Player, Stats

GAME_CONFIG = {
    "Voluntario": {
        "base_cost": 10,
        "cost_multiplier": 1.5,
        "power": 1, # Ejemplo: +1 punto por click
        "name": "Voluntario"
    },
    "Jaula": {
        "base_cost": 50,
        "cost_multiplier": 1.6,
        "power": 5,
        "name": "Jaula"
    },
    "Punto Limpio": {
        "base_cost": 200,
        "cost_multiplier": 1.7,
        "power": 20,
        "name": "Punto Limpio"
    },
    "Industria": {
        "base_cost": 1000,
        "cost_multiplier": 1.8,
        "power": 100,
        "name": "Industria"
    }
}

# Create your views here.
def aumentar_puntuacion(request):
    """Suma 1 punto al jugador loggeado o al invitado."""


    player_id = request.session.get("player_id")

    # Si el jugador no ha iniciado sesión → modo invitado
    if not player_id:
        puntos = request.session.get("guest_score", 0)
        puntos += 1
        request.session["guest_score"] = puntos
        return JsonResponse({
            "success": True,
            "puntuacion": puntos,
            "new_score": puntos
        })

    # Si hay sesión iniciada → sumar al usuario real
    player = Player.objects.filter(id=player_id).first()
    if not player:
        request.session.pop("player_id", None)
        return JsonResponse({"error": "Jugador no encontrado"}, status=404)

    stat = player.stats

    points = 1

    for key, value in stat.mejoras.items():
        points += GAME_CONFIG[key]["power"] * value

    stat.clicks += 1
    stat.puntaje += points
    stat.puntaje_total += points
    
    # player.score += 1
    # player.save()
    stat.save()

    return JsonResponse({
        "success": True,
        "puntuacion": stat.puntaje,
        "new_score": points
    })

def get_puntuacion(request):
    """Devuelve la puntuación actual del jugador o del invitado."""
    player_id = request.session.get("player_id")

    # Si no hay sesión → modo invitado
    if not player_id:
        return JsonResponse({"puntuacion": request.session.get("guest_score", 0)})

    player = Player.objects.filter(id=player_id).first()
    if not player:
        return JsonResponse({"puntuacion": 0})

    stat = Stats.objects.filter(user=player_id).first()
    return JsonResponse({"puntuacion": stat.puntaje})

def get_message(request):
    ruta_absoluta = find("messages/messages.txt")
    if (not ruta_absoluta): return JsonResponse({"error": "archivo no encontrado."})
    
    playerid = request.session.get("player_id")
    if playerid:
        player = Player.objects.filter(id=playerid).first()
        if player:
            stat = player.stats
            stat.gatos_pulsados += 1
            stat.save()

    wb = open(ruta_absoluta, 'r')
    message = random.choice(wb.readlines())
    wb.close()
    return JsonResponse({"message": message})

def get_stats(request):
    player_id = request.session.get("player_id")
    if not player_id: return JsonResponse({"error": "sin partida cargada"})

    player = Player.objects.filter(id=player_id).first()
    stat = player.stats
    return JsonResponse({
        "clicks": stat.clicks,
        "puntaje": stat.puntaje,
        "puntaje_total": stat.puntaje_total,
        "gatos": stat.gatos_pulsados,
    })

def get_mejoras(request):
    player_id = request.session.get("player_id")
    if not player_id:
        return JsonResponse(request.sesion.get("guest_mejoras", {}))

    player = Player.objects.filter(id=player_id).first()
    if not player:
        return JsonResponse({})

    stats = player.stats
    return JsonResponse(stats.mejoras)
        

# =========================
#   LOGIN Y REGISTRO (MODAL)
# =========================
def login_view(request):
    """Maneja login y registro, tanto desde el modal como desde la pantalla clásica."""
    if request.method == "POST":
        action = request.POST.get("action")
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")

        if not username or not password:
            messages.error(request, "Debes completar usuario y contraseña.")
            return redirect("game")

        if action == "register":
            if Player.objects.filter(username=username).exists():
                messages.error(request, "El nombre de usuario ya existe.")
            else:
                player = Player(username=username)
                player.set_password(password)
                player.save()
                request.session["player_id"] = player.id
                stats = Stats(user=player)
                stats.mejoras = {}
                stats.save()

                messages.success(request, "Cuenta creada con éxito.")

        else:  # acción de login
            player = Player.objects.filter(username=username).first()
            if not player or not player.check_password(password):
                messages.error(request, "Credenciales inválidas.")
            else:
                request.session["player_id"] = player.id

                messages.success(request, f"Bienvenido, {player.username}!")

        return redirect("game")

    # Si alguien entra directamente a /login/
    return redirect("game")


# =========================
#   LOGOUT
# =========================
def logout_view(request):
    """Cierra sesión y regresa al juego (modo invitado)."""
    request.session.pop("player_id", None)
    messages.info(request, "Sesión cerrada correctamente.")
    return redirect("game")


def comprar_mejora(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    player_id = request.session.get("player_id")
    if not player_id:
        return JsonResponse({"error": "Debes iniciar sesión para comprar"}, status=403)

    player = Player.objects.filter(id=player_id).first()
    if not player:
        return JsonResponse({"error": "Jugador no encontrado"}, status=404)

    # Obtenemos el ID de la mejora que el usuario quiere comprar (desde el JS)
    mejora_id = request.POST.get("mejora_id") # ej: 'voluntario'
    
    # Validar que la mejora exista en nuestro diccionario maestro
    config = GAME_CONFIG.get(mejora_id)
    if not config:
        return JsonResponse({"error": "Mejora no válida"}, status=400)

    stats = player.stats
    
    # Obtenemos el nivel actual (si no tiene, es 0)
    current_level = stats.mejoras.get(mejora_id, 0)

    # --- FÓRMULA DE COSTO ---
    # Precio = CostoBase * (Multiplicador ^ NivelActual)
    costo_actual = math.floor(config["base_cost"] * (config["cost_multiplier"] ** current_level))

    # Verificamos si tiene dinero
    if stats.puntaje >= costo_actual:
        # 1. Restar puntos
        stats.puntaje -= costo_actual
        
        # 2. Subir nivel
        stats.mejoras[mejora_id] = current_level + 1
        
        # 3. Guardar cambios
        stats.save()
        
        # Calculamos el precio del SIGUIENTE nivel para actualizar la UI
        next_cost = math.floor(config["base_cost"] * (config["cost_multiplier"] ** (current_level + 1)))

        return JsonResponse({
            "success": True,
            "nuevo_nivel": current_level + 1,
            "puntuacion_restante": stats.puntaje,
            "costo_siguiente": next_cost,
            "mejora_id": mejora_id
        })
    else:
        return JsonResponse({
            "success": False, 
            "error": f"No tienes suficientes puntos. Necesitas {costo_actual}."
        })

def get_price_mejora(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)
    
    player_id = request.session.get("player_id")
    if not player_id:
        return JsonResponse({"error": "Debes iniciar sesión para comprar"}, status=403)

    player = Player.objects.filter(id=player_id).first()
    if not player:
        return JsonResponse({"error": "Jugador no encontrado"}, status=404)

    # Obtenemos el ID de la mejora que el usuario quiere comprar (desde el JS)
    mejora_id = request.POST.get("mejora_id") # ej: 'voluntario'
    
    # Validar que la mejora exista en nuestro diccionario maestro
    config = GAME_CONFIG.get(mejora_id)
    if not config:
        return JsonResponse({"error": "Mejora no válida"}, status=400)

    stats = player.stats
    
    # Obtenemos el nivel actual (si no tiene, es 0)
    current_level = stats.mejoras.get(mejora_id, 0)

    costo_actual = math.floor(config["base_cost"] * (config["cost_multiplier"] ** current_level))

    return JsonResponse({"price": costo_actual})