from django.shortcuts import redirect, render
from django.contrib import messages
from django.http import JsonResponse
from django.conf import settings
from django.contrib.staticfiles.finders import find
import random
from .models import Player, Stats

# Create your views here.
def aumentar_puntuacion(request):
    """Suma 1 punto al jugador loggeado o al invitado."""

    points = 1

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