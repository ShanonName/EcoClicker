from django.urls import path
from . import views

urlpatterns = [
    path("click/", views.aumentar_puntuacion),
    path("get-puntuacion/", views.get_puntuacion),
    path("get-message/", views.get_message),
    path("get-stats/", views.get_stats),
    path("get-mejoras/", views.get_mejoras),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("buy-upgrade/", views.comprar_mejora),
    path("get-price-upgrade/", views.get_price_mejora),
    path("get-multi", views.get_multi)
]