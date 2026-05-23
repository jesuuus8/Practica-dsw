package com.taskquest.util;

import com.taskquest.entity.Usuario;
import com.taskquest.service.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioService usuarioService;

    public DataInitializer(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Aseguramos que exista un usuario global al iniciar
        Usuario u = usuarioService.getOrCreateGlobalUser();
        System.out.println("Usuario inicial: " + u.getNombre());
    }
}
