package com.taskquest.service;

import com.taskquest.entity.Tarea;
import com.taskquest.entity.Usuario;
import com.taskquest.repository.TareaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TareaService {

    private final TareaRepository repository;
    private final UsuarioService usuarioService;

    public TareaService(TareaRepository repository, UsuarioService usuarioService) {
        this.repository = repository;
        this.usuarioService = usuarioService;
    }

    public List<Tarea> listarTodas() {
        return repository.findAll();
    }

    public List<Tarea> listarPendientes() {
        return repository.findByCompletadaFalse();
    }

    public Tarea crear(Tarea tarea) {
        if (tarea.getFechaCreacion() == null) {
            tarea.setFechaCreacion(LocalDate.now());
        }
        if (tarea.getCompletada() == null) {
            tarea.setCompletada(false);
        }
        return repository.save(tarea);
    }

    /**
     * Marca la tarea como completada y suma la XP al usuario global.
     */
    public Optional<Tarea> completar(Long id) {
        Optional<Tarea> opt = repository.findById(id);
        opt.ifPresent(t -> {
            if (Boolean.FALSE.equals(t.getCompletada())) {
                t.setCompletada(true);
                repository.save(t);
                // Sumar XP al usuario global o repartir entre miembros del grupo
                Integer puntos = t.getPuntosExperiencia() == null ? 0 : t.getPuntosExperiencia();
                if (t.getGrupo() != null && t.getGrupo().getMiembros() != null && !t.getGrupo().getMiembros().isEmpty()) {
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

    public boolean eliminar(Long id) {
        Optional<Tarea> opt = repository.findById(id);
        if (opt.isEmpty()) return false;
        repository.deleteById(id);
        return true;
    }
}
