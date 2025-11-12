from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from django.contrib.staticfiles.finders import find
import random
# Create your views here.

puntuacion = 0


def aumentar_puntuacion(request):
    global puntuacion
    puntuacion += 1
    return JsonResponse({"puntuacion": puntuacion})


def get_puntuacion(request):
    global puntuacion
    return JsonResponse({"puntuacion": puntuacion})

def get_message(request):
    ruta_absoluta = find("messages/messages.txt")

    if (not ruta_absoluta): return JsonResponse({"error": "archivo no encontrado."})
    
    wb = open(ruta_absoluta, 'r')
    message = random.choice(wb.readlines())
    wb.close()
    return JsonResponse({"message": message})