# Capítulo 5
## Conclusiones y Trabajo Futuro

### 5.1.- Conclusiones
Tras el diseño, desarrollo e implantación de **TaskQuest**, se han extraído las siguientes conclusiones:
1. **Efectividad de la gamificación**: Las mecánicas RPG aplicadas (niveles, XP, recompensas e insignias) aumentan sustancialmente el compromiso e interés de los usuarios en completar responsabilidades que de otra forma resultarían tediosas.
2. **Reparto Justo Mediante IA**: La integración de la API de Gemini 1.5 Flash elimina la subjetividad y los sesgos personales en el momento de delegar tareas. Las asignaciones son respetadas de mejor manera por los miembros al provenir de un análisis automatizado e imparcial basado en edad y rol.
3. **Robustez y Portabilidad**: La contenedorización del proyecto utilizando Docker y Docker Compose simplifica enormemente la puesta en marcha de la infraestructura (servidor de base de datos, backend y cliente frontend) en cualquier entorno sin dependencias del sistema operativo.

### 5.2.- Posibles Desarrollos Futuros
Como ampliación del sistema, se proponen las siguientes líneas de trabajo:
* **Notificaciones Push y Recordatorios**: Envío de alertas inmediatas a dispositivos móviles o correos electrónicos cuando una tarea está próxima a vencer.
* **Estadísticas Avanzadas**: Gráficos interactivos de productividad mensual para visualizar el rendimiento individual de los usuarios e histórico de tareas completadas.
* **Integración de Calendarios**: Sincronización automática de las tareas y plazos de entrega con servicios externos como Google Calendar o iCal.
* **Módulo de Autenticación Federada**: Seguridad y login de perfiles reales mediante estándares como OAuth2 (login directo con cuentas de Google o GitHub).
