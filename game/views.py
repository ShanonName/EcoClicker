from django.shortcuts import render
from django.http import JsonResponse

# Variable temporal para guardar puntuación (en producción usar base de datos)
puntuacion = 0

def game(request):
    return render(request, 'main-game.html', {"puntuacion": puntuacion})

def aumentar_puntuacion(request):
    global puntuacion
    puntuacion += 1
    return JsonResponse({"puntuacion": puntuacion})