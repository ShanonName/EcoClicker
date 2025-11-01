from django.urls import path
from . import views

urlpatterns = [
    path("click/", views.aumentar_puntuacion),
    path("get-puntuacion/", views.get_puntuacion),
]
