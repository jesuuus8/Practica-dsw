# 🎮 TaskQuest (Gamify)

TaskQuest es una plataforma de productividad gamificada diseñada para transformar la gestión de tareas diarias en una experiencia divertida y motivadora. La aplicación cuenta con dos entornos distintos adaptados a diferentes necesidades: **Entorno Universitario** (estudiantes y equipos de estudio) y **Entorno Familiar** (tareas del hogar y roles familiares).

La plataforma incorpora mecánicas de juegos de rol (RPG), permitiendo a los usuarios ganar puntos de experiencia (XP), subir de nivel, competir en clasificaciones y canjear sus puntos por recompensas reales en una tienda integrada. Además, cuenta con un sistema de **distribución inteligente de tareas mediante Inteligencia Artificial (Google Gemini 1.5 Flash)**.

---

## ✨ Características Principales

### 🌟 1. Gamificación y Progresión
* **Nivel y XP**: Cada tarea completada otorga puntos de experiencia (XP). Al acumular 100 XP, el usuario sube de nivel.
* **Logros (Achievements)**: Medallas desbloqueables por cumplir objetivos específicos (como madrugador, completas misiones seguidas, etc.).
* **Recompensas**: Monedas virtuales (puntos) que pueden ser canjeados en la Tienda del Equipo por recompensas reales (ej. "Pase de café gratis", "Tarde libre de tareas").

### 🏆 2. Clasificación (Leaderboard)
* Visualización en tiempo real de la tabla de posiciones del equipo.
* Filtro inteligente por entorno (`UNIVERSITY` / `FAMILY`), mostrando únicamente a los participantes del mismo grupo.
* Incentiva la competencia amistosa y la colaboración.

### 🧠 3. Distribución de Tareas por IA (Google Gemini)
* Integra la API de **Gemini 1.5 Flash** para delegar y dividir tareas de forma automática.
* Al escribir una tarea general compleja, la IA la desglosa en subtareas lógicas, define su dificultad/XP y las asigna de forma justa entre los miembros considerando:
  * **Rol**: Distribución en base a responsabilidades (ej. Padres/Profesores vs. Estudiantes/Familiares).
  * **Edad**: Las personas mayores reciben tareas de mayor responsabilidad, mientras que los más jóvenes reciben tareas sencillas y seguras.
* **Fallback Inteligente**: En caso de no contar con una clave de API, el sistema cuenta con un motor de simulación semántica que analiza la categoría del texto (Hogar, Comida, Proyecto, Organización) para dividir la tarea localmente.

### 🏠 4. Entornos Duales
* **University Mode**: Orientado a proyectos académicos, sesiones de estudio y tareas de grupo.
* **Family Mode**: Orientado a la convivencia en el hogar, limpieza, preparación de comida y tareas domésticas.
* El diseño visual y los textos se adaptan dinámicamente según el entorno seleccionado.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
* **React 18** + **Vite**: Desarrollo ágil y carga ultra rápida.
* **Vanilla CSS**: Estilos modernos y responsivos con soporte para modo oscuro.
* **Material Symbols**: Iconografía moderna y limpia.

### Backend
* **Java 17** + **Spring Boot 3.2**: API REST robusta y segura.
* **Spring Data JPA**: Abstracción y acceso de base de datos eficiente.
* **PostgreSQL**: Base de datos relacional para guardar el progreso, usuarios y tareas.
* **Java HTTP Client**: Integración directa y de bajo consumo con la API de Google Gemini.

### Devops & Containerización
* **Docker** & **Docker Compose**: Despliegue de base de datos, backend y frontend en un solo comando.

---

## 🚀 Guía de Instalación y Ejecución

### Requisitos Previos
* **Docker Desktop** instalado y en ejecución.
* Opcional (para desarrollo local sin Docker): **Java 17**, **Maven** y **Node.js**.

### Opción 1: Ejecución con Docker (Recomendado)

1. Clona el repositorio:
   ```bash
   git clone https://github.com/jesuuus8/Practica-dsw.git
   cd Practica-dsw
   ```

2. (Opcional) Configura tu clave de Gemini API en las variables de entorno de tu máquina o edita el archivo `docker-compose.yml` para añadirla bajo el servicio `backend`:
   ```yaml
   environment:
     - GEMINI_API_KEY=tu_api_key_aqui
   ```

3. Construye e inicia los contenedores:
   ```bash
   docker-compose up -d --build
   ```

4. Accede a la aplicación:
   * **Frontend**: `http://localhost:5173`
   * **API Backend**: `http://localhost:8081`

---

### Opción 2: Ejecución Local en Modo Desarrollo

#### Backend (Spring Boot)
1. Navega a la carpeta backend:
   ```bash
   cd backend
   ```
2. Asegúrate de tener una base de datos PostgreSQL ejecutándose localmente y configura las credenciales en `backend/src/main/resources/application.properties`.
3. Compila y ejecuta el backend:
   ```bash
   mvn spring-boot:run
   ```

#### Frontend (React + Vite)
1. Navega a la carpeta frontend:
   ```bash
   cd frontEnd
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## 📁 Estructura del Proyecto

```text
├── backend/
│   ├── src/main/java/com/taskquest/
│   │   ├── controller/      # Controladores REST (Usuarios, Tareas, Grupos)
│   │   ├── entity/          # Entidades JPA (Usuario, Tarea, Grupo, Enums)
│   │   ├── repository/      # Repositorios JPA
│   │   ├── service/         # Lógica de negocio e Integración con Gemini
│   │   └── util/            # Inicialización de base de datos (DataInitializer)
│   ├── pom.xml              # Dependencias de Maven
│   └── Dockerfile
│
├── frontEnd/
│   ├── src/
│   │   ├── components/      # Componentes de la interfaz (Dashboard, Progreso, etc.)
│   │   ├── App.jsx          # Componente raíz
│   │   └── main.jsx
│   ├── package.json
│   └── Dockerfile
│
└── docker-compose.yml       # Orquestación de contenedores (Frontend, Backend, Postgres)
```
