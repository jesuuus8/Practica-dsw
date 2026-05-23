package com.taskquest.controller;

import com.taskquest.entity.Tarea;
import com.taskquest.service.TareaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*")
public class TareaController {

    private final TareaService service;

    public TareaController(TareaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Tarea> obtenerTodas() {
        return service.listarTodas();
    }

    @PostMapping
    public ResponseEntity<Tarea> crear(@RequestBody Tarea tarea) {
        Tarea creada = service.crear(tarea);
        return ResponseEntity.created(URI.create("/api/tareas/" + creada.getId())).body(creada);
    }

    @PutMapping("/{id}/completar")
    public ResponseEntity<Tarea> completar(@PathVariable Long id) {
        return service.completar(id)
                .map(t -> ResponseEntity.ok(t))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (service.eliminar(id)) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}
