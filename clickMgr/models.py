from django.contrib.auth.hashers import check_password, make_password
from django.db import models

class Player(models.Model):
    """Guarda nombre de usuario, contraseña cifrada y la puntuación acumulada."""

    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    # score = models.PositiveIntegerField(default=0)

    def set_password(self, raw_password: str) -> None:
        self.password = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password(raw_password, self.password)

    def __str__(self) -> str:
        return self.username

# Create your models here.
class Stats(models.Model):
    user = models.OneToOneField(Player,
                            on_delete=models.CASCADE, primary_key=True)

    clicks = models.IntegerField(default=0)
    puntaje = models.IntegerField(default=0)
    puntaje_total = models.IntegerField(default=0)

    gatos_pulsados = models.IntegerField(default=0)
    
    mejoras = models.JSONField(default=dict)

    def get_mejoras_display(self):
        """Devuelve las mejoras en un formato amigable para la plantilla."""
        return self.mejoras.items()

    def upgrade_item(self, mejora_id: str):
        """Sube de nivel una mejora y actualiza la base de datos."""
        
        current_level = self.mejoras.get(mejora_id, 0)
        
        self.mejoras[mejora_id] = current_level + 1
        
        self.save() 
        return True