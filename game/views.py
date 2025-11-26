from django.shortcuts import render
from clickMgr.models import Player

# Variable temporal para guardar puntuación (en producción usar base de datos)
puntuacion = 0


def game(request):
    # Renderiza el juego, incluso si no hay sesión iniciada.
    player = None
    player_id = request.session.get("player_id")

    if player_id:
        player = Player.objects.filter(id=player_id).first()
        if not player:
            request.session.pop("player_id", None)
            player = None

    context = {
        "puntuacion": player.stats.puntaje if player else 0,
        "username": player.username if player else None,
    }
    return render(request, "main-game.html", context)
    #return render(request, "main-game.html", {"puntuacion": puntuacion})


def buy_upgrade(request):
    pass
