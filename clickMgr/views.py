from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.

puntuacion = 0


def aumentar_puntuacion(request):
    global puntuacion
    puntuacion += 1
    return JsonResponse({"puntuacion": puntuacion})


def get_puntuacion(request):
    global puntuacion
    return JsonResponse({"puntuacion": puntuacion})
