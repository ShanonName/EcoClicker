from django.shortcuts import render

# Variable temporal para guardar puntuación (en producción usar base de datos)
puntuacion = 0


def game(request):
    return render(request, "main-game.html", {"puntuacion": puntuacion})


def buy_upgrade(request):
    pass
