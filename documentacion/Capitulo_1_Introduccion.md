# Capítulo 1
## Introducción y Objetivos

### 1.1.- Empresa / Entorno de Aplicación
El proyecto **TaskQuest** está concebido para ser utilizado en entornos colaborativos del día a día donde la organización de tareas suele causar fricción o falta de motivación constante. Estos entornos se agrupan en:
* **Entorno Universitario / Académico (`UNIVERSITY`)**: Equipos de trabajo formados por estudiantes, laboratorios de investigación o grupos de estudio que necesitan coordinar las tareas previas a entregas de proyectos, resúmenes y presentaciones de diapositivas de manera dinámica.
* **Entorno Familiar / Hogar (`FAMILY`)**: Núcleos familiares que gestionan las dinámicas de limpieza del hogar, lavado de platos, preparación de comidas y recados diarios, donde el reparto equitativo es clave para la armonía en la convivencia.

### 1.2.- Justificación del Proyecto
La delegación manual de tareas domésticas o estudiantiles suele presentar dos inconvenientes severos:
1. **Falta de motivación**: Las listas de tareas estáticas resultan monótonas y no ofrecen feedback inmediato sobre el esfuerzo realizado.
2. **Conflictos en el reparto**: La toma de decisiones subjetiva sobre "quién hace qué" a menudo se percibe como desbalanceada.

TaskQuest soluciona esta problemática introduciendo:
* **Mecánicas RPG**: Los usuarios acumulan puntos de experiencia (XP) y suben de nivel tras completar tareas, obteniendo monedas virtuales que pueden canjear en la tienda del grupo.
* **Inteligencia Artificial**: Se automatiza la división y reparto de responsabilidades mediante modelos avanzados de procesamiento del lenguaje natural (LLM) que aseguran imparcialidad y optimizan la asignación.

#### 1.2.1.- Motivación Metodológica
El desarrollo busca aplicar tecnologías y arquitecturas actuales (React en el frontend y Spring Boot en el backend) en combinación con las herramientas de IA generativa de Google para crear un producto full-stack robusto, modular y empaquetado en contenedores Docker para facilitar su portabilidad.

### 1.3.- Objetivos

#### Objetivos Principales:
* Diseñar e implementar una plataforma web con arquitectura cliente-servidor desacoplada que resuelva la organización colaborativa de tareas cotidianas.
* Desarrollar un motor de gamificación integrado con persistencia transaccional del progreso de los usuarios (niveles, experiencia y puntos).

#### Objetivos Secundarios:
* Incorporar la API de **Google Gemini 1.5 Flash** para delegar y dividir tareas de forma automatizada.
* Programar un chat interactivo grupal y una tienda de recompensas virtuales cuyos artículos se adapten dinámicamente al entorno seleccionado.
* Implementar un algoritmo local inteligente de contingencia (fallback) para subdividir tareas en caso de interrupción en la conexión externa de la IA.

#### Objetivos Personales del Alumno:
* Desarrollar habilidades avanzadas en Spring Boot 3 y React.
* Adquirir experiencia práctica en el modelado y uso estructurado de APIs de IA Generativa.
* Familiarizarse con herramientas de empaquetado en contenedores (Docker y Docker Compose).

### 1.4.- Límites del Proyecto
* **Sin pasarelas de pago**: La Tienda del Equipo utiliza puntos estrictamente virtuales acumulados por el esfuerzo; no maneja transacciones monetarias reales.
* **Grupos Cerrados**: Los usuarios pertenecen a grupos privados (familiares o de estudio); no es una red social pública o abierta a interacciones externas.
* **Dependencia de Red**: Las peticiones de distribución de tareas automáticas con la API de Gemini requieren conexión a internet. En su ausencia, el sistema utiliza el generador simulado heurístico local.
