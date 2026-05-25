package com.taskquest.controller;

import com.taskquest.entity.Grupo;
import com.taskquest.entity.Usuario;
import com.taskquest.repository.GrupoRepository;
import com.taskquest.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/api/grupos")
@CrossOrigin(origins = "*")
public class GrupoController {

    private final GrupoRepository grupoRepository;
    private final UsuarioRepository usuarioRepository;

    public GrupoController(GrupoRepository grupoRepository, UsuarioRepository usuarioRepository) {
        this.grupoRepository = grupoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public java.util.List<Grupo> listar() { return grupoRepository.findAll(); }

    @PostMapping
    public ResponseEntity<Grupo> crear(@RequestBody Grupo grupo) {
        if (grupo.getMiembros() == null) {
            grupo.setMiembros(new java.util.HashSet<>());
        }
        if (grupo.getMiembros().isEmpty()) {
            usuarioRepository.findFirstByOrderByIdAsc().ifPresent(u -> {
                grupo.getMiembros().add(u);
                if (grupo.getEnvironmentType() == null) {
                    grupo.setEnvironmentType(u.getEnvironmentType());
                }
            });
        }
        Grupo g = grupoRepository.save(grupo);
        return ResponseEntity.created(URI.create("/api/grupos/" + g.getId())).body(g);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Grupo> obtener(@PathVariable Long id) {
        return grupoRepository.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/miembros/{usuarioId}")
    public ResponseEntity<Grupo> addMiembro(@PathVariable Long id, @PathVariable Long usuarioId) {
        Optional<Grupo> og = grupoRepository.findById(id);
        Optional<Usuario> ou = usuarioRepository.findById(usuarioId);
        if (og.isEmpty() || ou.isEmpty()) return ResponseEntity.notFound().build();
        Grupo g = og.get();
        g.getMiembros().add(ou.get());
        grupoRepository.save(g);
        return ResponseEntity.ok(g);
    }

    @DeleteMapping("/{id}/miembros/{usuarioId}")
    public ResponseEntity<Void> removeMiembro(@PathVariable Long id, @PathVariable Long usuarioId) {
        Optional<Grupo> og = grupoRepository.findById(id);
        Optional<Usuario> ou = usuarioRepository.findById(usuarioId);
        if (og.isEmpty() || ou.isEmpty()) return ResponseEntity.notFound().build();
        Grupo g = og.get();
        g.getMiembros().remove(ou.get());
        grupoRepository.save(g);
        return ResponseEntity.noContent().build();
    }
}
