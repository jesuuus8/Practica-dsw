# Capítulo 3
## Hipótesis de Trabajo (Tecnologías)

### 3.1.- Arquitectura del Sistema
El sistema adopta una arquitectura cliente-servidor desacoplada que se comunica mediante una API RESTful estructurada sobre peticiones JSON. El frontend de React y el backend de Spring Boot se ejecutan de manera aislada e independiente:

* **Cliente (Frontend)**: Consume los endpoints REST de los controladores expuestos por el backend para pintar las interfaces dinámicas, almacenar de forma reactiva el estado global del usuario y gestionar las llamadas locales.
* **Servidor (Backend)**: Expone las rutas `/api/usuario`, `/api/tareas` y `/api/grupos`. Gestiona la persistencia transaccional y la lógica de integración con servicios externos como la API de Gemini.

### 3.2.- Tecnologías y Lenguajes

#### 3.2.1.- Backend (Spring Boot & Java 17)
* **Java 17 (Eclipse Temurin)**: Elegido por sus optimizaciones de rendimiento y soporte a largo plazo (LTS).
* **Spring Boot 3.2**: Simplifica la inyección de dependencias, la configuración de servidores integrados (Tomcat) y el enrutamiento HTTP.
* **Spring Data JPA & Hibernate**: Abstracción del acceso a datos, permitiendo mapear objetos Java directos a tablas de base de datos relacionales sin necesidad de escribir SQL nativo complejo.
* **Lombok**: Biblioteca auxiliar para reducir el código redundante (boilterplate) mediante anotaciones para getters, setters y constructores.

#### 3.2.2.- Base de Datos (PostgreSQL 15)
* Servidor de base de datos relacional y transaccional que asegura consistencia e integridad referencial en las tablas de progreso, tareas y relaciones de grupos.

#### 3.2.3.- Frontend (React 18 & Vite)
* **React 18**: Permite el renderizado eficiente basado en componentes reutilizables y reactivos.
* **Vite 5**: Empaquetador web moderno que ofrece recarga rápida en caliente (HMR) y una velocidad de compilación superior a empaquetadores clásicos como Webpack.
* **CSS Vanilla**: Estilos personalizados que aplican principios modernos de diseño, como paletas de colores HSL consistentes, bordes redondeados pronunciados, microanimaciones reactivas y un esquema bento-grid premium.

#### 3.2.4.- Integración de IA (API de Google Gemini)
* Uso de la API de **Gemini 1.5 Flash** para procesar la descripción de la tarea general y estructurar el desglose en subtareas en formato JSON. El modelo permite un procesamiento veloz y de bajo coste.
* Cliente HTTP nativo de Java (`java.net.http.HttpClient`) para realizar peticiones POST directas y asíncronas, evitando dependencias externas adicionales.

#### 3.2.5.- Contenedores (Docker & Docker Compose)
* **Docker**: Empaqueta los microservicios y bases de datos en imágenes portables e independientes del sistema operativo anfitrión.
* **Docker Compose**: Orquesta la ejecución conjunta de los contenedores de frontend, backend y base de datos relacional dentro de una red puente (`taskquest_network`) interna.
