package com.taskquest.controller;

import com.taskquest.entity.Usuario;
import com.taskquest.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuario")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public Usuario obtenerUsuario() {
        return usuarioService.getOrCreateGlobalUser();
    }

    @GetMapping("/todos")
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioService.getAllUsers();
    }

    @PutMapping
    public Usuario actualizarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.updateUser(usuario);
    }
}
