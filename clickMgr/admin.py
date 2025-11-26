from django.contrib import admin
from .models import Player, Stats
from django.utils.safestring import mark_safe
import json

# --- Configuración del Modelo Player ---
@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    # Campos que se muestran en la lista de jugadores
    list_display = ('id', 'username', 'stats', 'date_joined_display')
    
    # Campos por los que se puede filtrar la lista
    list_filter = ('stats',)
    
    # Campos por los que se puede buscar
    search_fields = ('username',)
    
    # Campos de solo lectura para evitar que la contraseña se muestre
    # Aunque 'password' no se muestra en list_display, es útil si usas fieldsets
    readonly_fields = ('password',) 
    
    # Método custom para simular un campo de fecha de unión (si lo hubieras tenido en el modelo)
    # Aquí lo usamos como un ejemplo simple.
    def date_joined_display(self, obj):
        return "N/A (Sin campo de fecha)"
    date_joined_display.short_description = 'Fecha de Registro'


# --- Configuración del Modelo Stats ---
@admin.register(Stats)
class StatsAdmin(admin.ModelAdmin):
    # Campos que se muestran en la lista de estadísticas
    list_display = ('user', 'clicks', 'puntaje', 'puntaje_total', 'gatos_pulsados', 'mejoras_count')
    
    # Campos por los que se puede filtrar
    list_filter = ('user',)
    
    # Campos por los que se puede buscar (permite buscar por nombre de usuario)
    search_fields = ('user__username',)
    
    # Campos de solo lectura para mejorar la visualización de JSON
    readonly_fields = ('display_mejoras',) 
    
    # Campos que se muestran en el formulario de detalle
    fields = (
        'user', 
        ('clicks', 'gatos_pulsados'), 
        ('puntaje', 'puntaje_total'),
        'display_mejoras'  # Usamos el campo de sólo lectura aquí
    )
    
    # Método para contar cuántas mejoras tiene el usuario (útil en list_display)
    def mejoras_count(self, obj):
        if obj.mejoras:
            return len(obj.mejoras)
        return 0
    mejoras_count.short_description = 'Nº Mejoras'
    
    # Método para mostrar el contenido JSON de forma legible en el formulario de detalle
    def display_mejoras(self, obj):
        if obj.mejoras:
            # Formatea el JSON para una mejor lectura
            pretty_json = json.dumps(obj.mejoras, indent=4, ensure_ascii=False)
            # Usa mark_safe para que Django renderice el HTML (la etiqueta <pre>)
            return mark_safe(f'<pre>{pretty_json}</pre>')
        return "No hay mejoras registradas."
    display_mejoras.short_description = 'Detalle de Mejoras'