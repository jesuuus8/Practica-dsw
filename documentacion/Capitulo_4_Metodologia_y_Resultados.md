# Capítulo 4
## Metodología y Resultados

### 4.1.- Planificación del Proyecto (Metodología Ágil)
El desarrollo del proyecto se estructuró en 4 Sprints principales utilizando un enfoque iterativo incremental basado en Scrum:
* **Sprint 1 (Análisis)**: Captura de requisitos y diseño inicial del sistema.
* **Sprint 2 (Diseño)**: Definición del modelo relacional de base de datos y diagramación UML.
* **Sprint 3 (Desarrollo)**: Programación del backend de Spring Boot, repositorios JPA e interfaz de React.
* **Sprint 4 (Integración)**: Integración con la API de Google Gemini, lógica de fallbacks locales y pruebas unitarias de extremo a extremo.

#### Figura 4.1.- Diagrama de Gantt de Planificación de Sprints
```mermaid
gantt
    title Planificación del Proyecto (Sprint Gantt)
    dateFormat  YYYY-MM-DD
    section Sprint 1: Análisis
    Investigación y Requisitos  :active, s1, 2026-05-01, 7d
    section Sprint 2: Diseño
    Modelo Relacional y Diagramas UML : s2, after s1, 7d
    section Sprint 3: Desarrollo
    Backend y Repositorios      : s3, after s2, 14d
    Interfaz y Componentes React : s4, after s2, 14d
    section Sprint 4: Integración
    Integración Gemini 1.5 API  : s5, after s3, 7d
    Despliegue y Pruebas Docker  : s6, after s5, 5d
```

---

### 4.2.- Captura de Requisitos
El sistema gestiona de manera diferenciada los privilegios del creador del grupo (administrador) y el resto de integrantes asignados.

#### Figura 4.2.- Diagrama de Casos de Uso del Sistema
```mermaid
graph TD
    classDef actor fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
    classDef usecase fill:#e8f5e9,stroke:#388e3c,stroke-width:2px;
    
    ActorAdmin["Administrador (Padre/Profesor)"]:::actor
    ActorUsuario["Usuario (Familiar/Estudiante)"]:::actor
    
    UC_CrearGrupo["Crear Grupo"]:::usecase
    UC_DistribuirIA["Distribuir Tareas por IA"]:::usecase
    UC_CompletarTarea["Completar Tarea"]:::usecase
    UC_CanjearRecompensa["Canjear Recompensa"]:::usecase
    UC_VerClasificacion["Ver Clasificación"]:::usecase
    UC_ConfirmarTarea["Confirmar Tarea"]:::usecase

    ActorAdmin --> UC_CrearGrupo
    ActorAdmin --> UC_DistribuirIA
    ActorAdmin --> UC_ConfirmarTarea
    
    ActorUsuario --> UC_CompletarTarea
    ActorUsuario --> UC_CanjearRecompensa
    ActorUsuario --> UC_VerClasificacion
```

---

### 4.3.- Diseño del Sistema

#### 4.3.1.- Diagrama Entidad-Relación de la Base de Datos
La persistencia de datos se compone de tablas relacionadas para guardar el progreso del jugador, el contenido de las misiones y la composición de los grupos de trabajo.

#### Figura 4.3.- Diagrama Entidad-Relación
```mermaid
erDiagram
    USUARIOS {
        Long id PK
        String nombre
        Integer xpActual
        Integer nivel
        Integer puntos
        String role
        String environmentType
    }
    TAREAS {
        Long id PK
        String titulo
        String descripcion
        Boolean completada
        Integer puntosExperiencia
        LocalDate fechaCreacion
        LocalDate fechaLimite
        String environmentType
    }
    GRUPOS {
        Long id PK
        String nombre
        String environmentType
    }
    GRUPOS ||--o{ USUARIOS : miembros
    USUARIOS ||--o{ TAREAS : asignadas
```

---

#### 4.3.2.- Diagrama de Clases UML
El diseño orientado a objetos del backend de Spring Boot se estructura en tres capas (Controladores, Servicios y Entidades JPA).

#### Figura 4.4.- Diagrama de Clases UML
```mermaid
classDiagram
    class Usuario {
        +Long id
        +String nombre
        +Integer xpActual
        +Integer nivel
        +Integer puntos
        +Role role
        +EnvironmentType environmentType
        +getOrCreateGlobalUser()
    }
    class Tarea {
        +Long id
        +String titulo
        +String descripcion
        +Boolean completada
        +Integer puntosExperiencia
        +EnvironmentType environmentType
    }
    class Grupo {
        +Long id
        +String nombre
        +Set~Usuario~ miembros
    }
    class GeminiService {
        +distribuirTareas(Grupo g, String desc)
        -distribuirSimulado(Grupo g, String desc)
    }
    class TareaService {
        +distribuirTareasConIa(Long grupoId, String desc)
        +completar(Long id)
    }
    
    Grupo "1" *-- "many" Usuario
    Tarea "many" --> "1" Usuario : asignado
    TareaService ..> GeminiService : usa
```

---

#### 4.3.3.- Diagrama de Secuencia: Petición de Distribución de Tareas por IA
Este diagrama detalla el ciclo de vida de una petición HTTP iniciada desde el panel del frontend al pulsar "Distribuir por IA".

#### Figura 4.5.- Diagrama de Secuencia UML
```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrador
    participant FE as Frontend (React)
    participant BE as Backend (Spring Boot)
    participant GS as GeminiService (Java)
    participant GAPI as Google Gemini API

    Admin->>FE: Crea tarea general en el grupo
    FE->>BE: POST /api/tareas/distribuir-ia (grupoId, desc)
    BE->>GS: distribuirTareasConIa(grupoId, desc)
    GS->>GAPI: HTTP POST Request (Prompt + Miembros)
    alt API Key válida
        GAPI-->>GS: JSON con subtareas distribuidas
    else API Key ausente / error
        GS->>GS: Ejecuta algoritmo local (distribuirSimulado)
    end
    GS-->>BE: Lista de objetos Tarea
    BE-->>FE: HTTP 200 OK (Lista de Tareas creadas)
    FE-->>Admin: Muestra las tareas asignadas en la UI
```

---

### 4.4.- Implementación y Resultados
* **Frontend**: La aplicación implementa un diseño interactivo que actualiza los datos de nivel y XP del usuario inmediatamente al marcar tareas como realizadas. Se implementaron modales interactivos para ver detalles de logros bloqueados y animaciones de confeti con la librería nativa CSS al canjear recompensas.
* **Backend**: Inicializa datos en la base de datos a través de `DataInitializer` para que la aplicación muestre registros representativos de tareas y usuarios de clasificación al iniciar por primera vez.
