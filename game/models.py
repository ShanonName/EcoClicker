from django.db import models

# Create your models here.

# Para la base de datos, falta terminar todo esto
class Users(models.Model):
    usuario = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    