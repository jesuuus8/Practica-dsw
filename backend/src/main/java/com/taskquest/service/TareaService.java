package com.taskquest.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskquest.entity.Grupo;
import com.taskquest.entity.Tarea;
import com.taskquest.entity.Usuario;
import com.taskquest.entity.Role;
import com.taskquest.entity.EnvironmentType;
import com.taskquest.repository.GrupoRepository;
import com.taskquest.repository.TareaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TareaService {

    private final TareaRepository repository;
    private final UsuarioService usuarioService;
    private final GrupoRepository grupoRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TareaService(TareaRepository repository, UsuarioService usuarioService, GrupoRepository grupoRepository, GeminiService geminiService) {
        this.repository = repository;
        this.usuarioService = usuarioService;
        this.grupoRepository = grupoRepository;
        this.geminiService = geminiService;
    }

    public List<Tarea> listarTodas() {
        return repository.findAll();
    }

    public List<Tarea> listarPendientes() {
        return repository.findByCompletadaFalse();
    }

    public Tarea crear(Tarea tarea) {
        Usuario user = usuarioService.getOrCreateGlobalUser();
        if (user.getRole() != Role.PROFESOR && user.getRole() != Role.PADRES) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo los profesores o padres pueden añadir tareas.");
        }
        if (tarea.getFechaCreacion() == null) {
            tarea.setFechaCreacion(LocalDate.now());
        }
        if (tarea.getCompletada() == null) {
            tarea.setCompletada(false);
        }
        if (tarea.getRealizada() == null) {
            tarea.setRealizada(false);
        }
        if (tarea.getGrupo() != null && tarea.getGrupo().getId() != null) {
            Grupo g = grupoRepository.findById(tarea.getGrupo().getId()).orElse(null);
            tarea.setGrupo(g);
        } else {
            tarea.setGrupo(null);
        }
        if (tarea.getUsuarioAsignado() != null && tarea.getUsuarioAsignado().getId() != null) {
            Usuario asignado = usuarioService.getUserById(tarea.getUsuarioAsignado().getId()).orElse(null);
            tarea.setUsuarioAsignado(asignado);
        } else {
            tarea.setUsuarioAsignado(null);
        }
        return repository.save(tarea);
    }

    public Optional<Tarea> realizar(Long id) {
        Optional<Tarea> opt = repository.findById(id);
        opt.ifPresent(t -> {
            if (t.getRealizada() == null || !t.getRealizada()) {
                t.setRealizada(true);
                repository.save(t);
            }
        });
        return opt;
    }

    public Optional<Tarea> confirmar(Long id) {
        Usuario user = usuarioService.getOrCreateGlobalUser();
        if (user.getRole() != Role.PROFESOR && user.getRole() != Role.PADRES) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo profesores o padres pueden confirmar tareas.");
        }
        Optional<Tarea> opt = repository.findById(id);
        opt.ifPresent(t -> {
            if (t.getCompletada() == null || !t.getCompletada()) {
                t.setRealizada(true);
                t.setCompletada(true);
                repository.save(t);
                
                // Sumar XP al usuario global o repartir entre miembros del grupo
                Integer puntos = t.getPuntosExperiencia() == null ? 0 : t.getPuntosExperiencia();
                if (t.getUsuarioAsignado() != null) {
                    usuarioService.addXpToUser(t.getUsuarioAsignado().getId(), puntos);
                } else if (t.getGrupo() != null && t.getGrupo().getMiembros() != null && !t.getGrupo().getMiembros().isEmpty()) {
                    int miembros = t.getGrupo().getMiembros().size();
                    int base = puntos / miembros;
                    int resto = puntos % miembros;
                    boolean primera = true;
                    for (Usuario miembro : t.getGrupo().getMiembros()) {
                        int asignar = base + (primera ? resto : 0);
                        primera = false;
                        usuarioService.addXpToUser(miembro.getId(), asignar);
                    }
                } else {
                    usuarioService.addXpToGlobalUser(puntos);
                }
            }
        });
        return opt;
    }

    public Optional<Tarea> rechazar(Long id) {
        Usuario user = usuarioService.getOrCreateGlobalUser();
        if (user.getRole() != Role.PROFESOR && user.getRole() != Role.PADRES) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo profesores o padres pueden rechazar tareas.");
        }
        Optional<Tarea> opt = repository.findById(id);
        opt.ifPresent(t -> {
            if (Boolean.TRUE.equals(t.getRealizada()) && (t.getCompletada() == null || !t.getCompletada())) {
                t.setRealizada(false);
                repository.save(t);
            }
        });
        return opt;
    }

    /**
     * Delegador para mantener compatibilidad con endpoints antiguos.
     */
    public Optional<Tarea> completar(Long id) {
        Usuario user = usuarioService.getOrCreateGlobalUser();
        if (user.getRole() == Role.PROFESOR || user.getRole() == Role.PADRES) {
            return confirmar(id);
        } else {
            return realizar(id);
        }
    }

    public boolean eliminar(Long id) {
        Optional<Tarea> opt = repository.findById(id);
        if (opt.isEmpty()) return false;
        repository.deleteById(id);
        return true;
    }

    public List<Tarea> distribuirTareasConIa(Long grupoId, String descripcionGeneral) {
        Usuario creator = usuarioService.getOrCreateGlobalUser();
        if (creator.getRole() != Role.PROFESOR && creator.getRole() != Role.PADRES) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo profesores o padres pueden distribuir tareas con IA.");
        }

        Grupo grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo no encontrado con ID: " + grupoId));

        if (grupo.getMiembros() == null || grupo.getMiembros().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El grupo no tiene miembros asignados.");
        }

        // Llamar a GeminiService para obtener el JSON de reparto
        String jsonReparto = geminiService.distribuirTareas(grupo, descripcionGeneral);

        List<Tarea> tareasCreadas = new java.util.ArrayList<>();
        try {
            JsonNode rootNode = objectMapper.readTree(jsonReparto);
            if (rootNode.isArray()) {
                for (JsonNode taskNode : rootNode) {
                    String titulo = taskNode.path("titulo").asText("Nueva subtarea");
                    String descripcion = taskNode.path("descripcion").asText("");
                    int puntos = taskNode.path("puntosExperiencia").asInt(50);
                    long usuarioAsignadoId = taskNode.path("usuarioAsignadoId").asLong();

                    Usuario asignado = usuarioService.getUserById(usuarioAsignadoId).orElse(null);
                    if (asignado != null) {
                        Tarea t = new Tarea();
                        t.setTitulo(titulo);
                        t.setDescripcion(descripcion);
                        t.setPuntosExperiencia(puntos);
                        t.setGrupo(grupo);
                        t.setUsuarioAsignado(asignado);
                        t.setCompletada(false);
                        t.setRealizada(false);
                        t.setFechaCreacion(LocalDate.now());
                        
                        // Asignar el tipo de entorno según el miembro asignado
                        t.setEnvironmentType(asignado.getEnvironmentType() != null ? asignado.getEnvironmentType() : EnvironmentType.UNIVERSITY);

                        tareasCreadas.add(repository.save(t));
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error al procesar JSON de tareas repartidas por IA: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al procesar la asignación de IA.");
        }

        return tareasCreadas;
    }
}
