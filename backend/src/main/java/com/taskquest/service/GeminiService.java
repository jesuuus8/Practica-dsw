package com.taskquest.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskquest.entity.Grupo;
import com.taskquest.entity.Usuario;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
public class GeminiService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public String distribuirTareas(Grupo grupo, String descripcionGeneral) {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            System.out.println("GEMINI_API_KEY no encontrada en variables de entorno. Usando distribuidor simulador de IA.");
            return distribuirSimulado(grupo, descripcionGeneral);
        }

        try {
            // Construir el prompt de contexto con información del grupo y miembros
            StringBuilder promptBuilder = new StringBuilder();
            promptBuilder.append("Eres un asistente inteligente para la plataforma de productividad gamificada 'Gamify'.\n");
            promptBuilder.append("Tu objetivo es dividir una tarea general en varias subtareas específicas y distribuirlas de manera justa y balanceada entre los miembros de un equipo.\n\n");
            promptBuilder.append("La tarea general que el administrador ha creado es la siguiente:\n");
            promptBuilder.append("\"").append(descripcionGeneral).append("\"\n\n");
            promptBuilder.append("Los miembros del equipo disponibles para asignarles subtareas son:\n");

            for (Usuario u : grupo.getMiembros()) {
                promptBuilder.append("- ID: ").append(u.getId())
                        .append(", Nombre: ").append(u.getNombre())
                        .append(", Rol: ").append(u.getRole() != null ? u.getRole().name() : "ESTUDIANTE")
                        .append(", Edad: ").append(u.getEdad() != null ? u.getEdad() : "no especificada")
                        .append("\n");
            }

            promptBuilder.append("\nInstrucciones de división:\n");
            promptBuilder.append("1. Divide la tarea general en subtareas lógicas. Cada subtarea debe asignarse a un único miembro del grupo.\n");
            promptBuilder.append("2. Distribuye las subtareas de forma equitativa considerando la edad y el rol de cada miembro. Los miembros de mayor edad o con roles de mayor jerarquía deben recibir tareas de mayor responsabilidad o dificultad física. Los miembros de menor edad deben recibir tareas sencillas y seguras.\n");
            promptBuilder.append("3. Para cada subtarea, define:\n");
            promptBuilder.append("   - titulo (un nombre corto y llamativo)\n");
            promptBuilder.append("   - descripcion (explicación breve y amigable de lo que el asignado debe hacer)\n");
            promptBuilder.append("   - puntosExperiencia (un número entero entre 30 y 150 según la complejidad de la tarea)\n");
            promptBuilder.append("   - usuarioAsignadoId (el ID numérico del miembro asignado)\n\n");
            promptBuilder.append("IMPORTANTE: Debes retornar ÚNICAMENTE un arreglo JSON con el siguiente formato, sin texto explicativo adicional, sin bloques de código markdown y sin comentarios:\n");
            promptBuilder.append("[\n");
            promptBuilder.append("  {\n");
            promptBuilder.append("    \"titulo\": \"Nombre de la subtarea\",\n");
            promptBuilder.append("    \"descripcion\": \"Descripción de la subtarea\",\n");
            promptBuilder.append("    \"puntosExperiencia\": 100,\n");
            promptBuilder.append("    \"usuarioAsignadoId\": 1\n");
            promptBuilder.append("  }\n");
            promptBuilder.append("]");

            // Construir el cuerpo de la solicitud JSON para Gemini 1.5 Flash
            String requestBody = objectMapper.writeValueAsString(
                java.util.Map.of(
                    "contents", List.of(
                        java.util.Map.of(
                            "parts", List.of(
                                java.util.Map.of("text", promptBuilder.toString())
                            )
                        )
                    ),
                    "generationConfig", java.util.Map.of(
                        "responseMimeType", "application/json"
                    )
                )
            );

            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode rootNode = objectMapper.readTree(response.body());
                JsonNode candidates = rootNode.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    String jsonText = candidates.get(0)
                            .path("content")
                            .path("parts")
                            .get(0)
                            .path("text")
                            .asText();
                    return jsonText;
                }
            } else {
                System.err.println("Error al llamar a Gemini API. Código de estado: " + response.statusCode() + ", Respuesta: " + response.body());
            }

        } catch (Exception e) {
            System.err.println("Excepción durante la llamada a Gemini API: " + e.getMessage());
        }

        // Fallback en caso de error en la API
        System.out.println("Fallo al contactar Gemini API. Usando distribuidor simulador de IA como fallback.");
        return distribuirSimulado(grupo, descripcionGeneral);
    }

    private String distribuirSimulado(Grupo grupo, String descripcionGeneral) {
        List<Usuario> miembros = new java.util.ArrayList<>(grupo.getMiembros());
        if (miembros.isEmpty()) {
            return "[]";
        }

        // Si la descripción tiene varias partes separadas por comas/puntos, y hay al menos 2 partes
        String[] partes = descripcionGeneral.split("[,;.]");
        java.util.List<String> partesLimpias = new java.util.ArrayList<>();
        for (String p : partes) {
            String trimmed = p.trim();
            if (!trimmed.isEmpty()) {
                partesLimpias.add(trimmed);
            }
        }

        StringBuilder sb = new StringBuilder();
        sb.append("[");

        if (partesLimpias.size() >= 2) {
            // Caso 1: El usuario proporcionó explícitamente subtareas separadas por comas
            for (int i = 0; i < partesLimpias.size(); i++) {
                String parte = partesLimpias.get(i);
                Usuario asignado = miembros.get(i % miembros.size());
                if (i > 0) sb.append(",");
                sb.append("{");
                sb.append("\"titulo\": \"").append(escapeJson(parte)).append("\",");
                sb.append("\"descripcion\": \"Realizar la tarea: ").append(escapeJson(parte)).append("\",");
                sb.append("\"puntosExperiencia\": ").append(60 + (i * 15) % 80).append(",");
                sb.append("\"usuarioAsignadoId\": ").append(asignado.getId());
                sb.append("}");
            }
        } else {
            // Caso 2: El usuario ingresó una tarea general descriptiva. La simulamos de forma inteligente.
            String descNorm = descripcionGeneral.toLowerCase();
            String categoria = "GENERAL";
            
            if (descNorm.contains("limpi") || descNorm.contains("orden") || descNorm.contains("casa") || 
                descNorm.contains("cocin") || descNorm.contains("baño") || descNorm.contains("salón") || 
                descNorm.contains("habitac") || descNorm.contains("plato") || descNorm.contains("barrer") || 
                descNorm.contains("fregar")) {
                categoria = "HOGAR";
            } else if (descNorm.contains("proyect") || descNorm.contains("estudi") || descNorm.contains("exam") || 
                       descNorm.contains("presentac") || descNorm.contains("inform") || descNorm.contains("trabaj") || 
                       descNorm.contains("univers") || descNorm.contains("clase") || descNorm.contains("deber")) {
                categoria = "PROYECTO";
            } else if (descNorm.contains("cena") || descNorm.contains("comid") || descNorm.contains("almuerz") || 
                       descNorm.contains("prepar") || descNorm.contains("cocinar") || descNorm.contains("desayun")) {
                categoria = "COMIDA";
            } else if (descNorm.contains("organiz") || descNorm.contains("event") || descNorm.contains("part") || 
                       descNorm.contains("fiest") || descNorm.contains("viaj") || descNorm.contains("reun")) {
                categoria = "ORGANIZACION";
            }

            // Encontrar miembro de mayor jerarquía/edad para asignarle la coordinación
            Usuario lider = miembros.get(0);
            for (Usuario u : miembros) {
                boolean uEsAdmin = u.getRole() == com.taskquest.entity.Role.PADRES || u.getRole() == com.taskquest.entity.Role.PROFESOR;
                boolean liderEsAdmin = lider.getRole() == com.taskquest.entity.Role.PADRES || lider.getRole() == com.taskquest.entity.Role.PROFESOR;
                if (uEsAdmin && !liderEsAdmin) {
                    lider = u;
                } else if (uEsAdmin == liderEsAdmin) {
                    int uEdad = u.getEdad() != null ? u.getEdad() : 0;
                    int liderEdad = lider.getEdad() != null ? lider.getEdad() : 0;
                    if (uEdad > liderEdad) {
                        lider = u;
                    }
                }
            }

            for (int i = 0; i < miembros.size(); i++) {
                Usuario asignado = miembros.get(i);
                boolean esLider = asignado.getId().equals(lider.getId());
                
                String titulo = "";
                String descripcion = "";
                int puntos = 80;

                if (categoria.equals("HOGAR")) {
                    if (esLider) {
                        titulo = "Planificación y Limpieza compleja";
                        descripcion = "Organizar los productos de limpieza y encargarse de las áreas complejas de: " + descripcionGeneral;
                        puntos = 110;
                    } else {
                        switch (i % 3) {
                            case 0:
                                titulo = "Barrer y fregar los suelos";
                                descripcion = "Limpiar y fregar los suelos en las áreas comunes para: " + descripcionGeneral;
                                puntos = 70;
                                break;
                            case 1:
                                titulo = "Quitar polvo y ordenar objetos";
                                descripcion = "Limpiar superficies de muebles, estanterías y ordenar objetos sueltos.";
                                puntos = 60;
                                break;
                            default:
                                titulo = "Sacar la basura y ventilación";
                                descripcion = "Vaciar las papeleras, llevar las bolsas a reciclar y abrir ventanas para ventilar.";
                                puntos = 50;
                                break;
                        }
                    }
                } else if (categoria.equals("PROYECTO")) {
                    if (esLider) {
                        titulo = "Coordinación y Revisión de calidad";
                        descripcion = "Establecer la estructura principal del trabajo y realizar la revisión final del proyecto: " + descripcionGeneral;
                        puntos = 120;
                    } else {
                        switch (i % 3) {
                            case 0:
                                titulo = "Investigación y Recopilación";
                                descripcion = "Buscar información clave, referencias académicas y fuentes confiables.";
                                puntos = 90;
                                break;
                            case 1:
                                titulo = "Redacción del cuerpo del trabajo";
                                descripcion = "Redactar el borrador de los apartados principales asignados.";
                                puntos = 100;
                                break;
                            default:
                                titulo = "Diseño de la presentación visual";
                                descripcion = "Crear las diapositivas o material visual interactivo para la exposición.";
                                puntos = 80;
                                break;
                        }
                    }
                } else if (categoria.equals("COMIDA")) {
                    if (esLider) {
                        titulo = "Cocinar y controlar tiempos";
                        descripcion = "Preparar y cocinar el plato caliente principal, vigilando el fuego/horno para: " + descripcionGeneral;
                        puntos = 115;
                    } else {
                        switch (i % 3) {
                            case 0:
                                titulo = "Lista de ingredientes y compra";
                                descripcion = "Revisar la despensa, hacer la lista de la compra e ir a por los ingredientes.";
                                puntos = 80;
                                break;
                            case 1:
                                titulo = "Preparación y troceado";
                                descripcion = "Lavar, pelar y cortar las verduras, carne o complementos necesarios.";
                                puntos = 75;
                                break;
                            default:
                                titulo = "Poner la mesa y emplatado";
                                descripcion = "Colocar platos, cubiertos, vasos, servilletas y ayudar a servir la comida.";
                                puntos = 60;
                                break;
                        }
                    }
                } else if (categoria.equals("ORGANIZACION")) {
                    if (esLider) {
                        titulo = "Coordinación de logística y presupuesto";
                        descripcion = "Definir los horarios, llevar el control de gastos y mandar las invitaciones para: " + descripcionGeneral;
                        puntos = 125;
                    } else {
                        switch (i % 3) {
                            case 0:
                                titulo = "Acondicionamiento y decoración";
                                descripcion = "Preparar el espacio físico, colocar mesas/sillas y colocar adornos.";
                                puntos = 85;
                                break;
                            case 1:
                                titulo = "Compra de provisiones y bebidas";
                                descripcion = "Encargarse de comprar los aperitivos, refrescos y menaje desechable necesario.";
                                puntos = 80;
                                break;
                            default:
                                titulo = "Preparación de actividades y música";
                                descripcion = "Seleccionar la música de fondo y organizar juegos o dinámicas entretenidas.";
                                puntos = 70;
                                break;
                        }
                    }
                } else {
                    // Categoria GENERAL
                    if (esLider) {
                        titulo = "Planificación general";
                        descripcion = "Coordinar los pasos principales y supervisar la ejecución de: " + descripcionGeneral;
                        puntos = 110;
                    } else {
                        switch (i % 3) {
                            case 0:
                                titulo = "Fase operativa inicial";
                                descripcion = "Ejecutar la preparación básica y recopilación de materiales de: " + descripcionGeneral;
                                puntos = 85;
                                break;
                            case 1:
                                titulo = "Fase de ejecución intermedia";
                                descripcion = "Avanzar con el desarrollo práctico de las tareas asignadas para: " + descripcionGeneral;
                                puntos = 80;
                                break;
                            default:
                                titulo = "Cierre y recogida";
                                descripcion = "Limpieza del área de trabajo, orden y guardado de materiales utilizados.";
                                puntos = 70;
                                break;
                        }
                    }
                }

                if (i > 0) sb.append(",");
                sb.append("{");
                sb.append("\"titulo\": \"").append(escapeJson(titulo)).append("\",");
                sb.append("\"descripcion\": \"").append(escapeJson(descripcion)).append("\",");
                sb.append("\"puntosExperiencia\": ").append(puntos).append(",");
                sb.append("\"usuarioAsignadoId\": ").append(asignado.getId());
                sb.append("}");
            }
        }

        sb.append("]");
        return sb.toString();
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
