package com.taskquest.util;

import com.taskquest.entity.Tarea;
import com.taskquest.entity.Usuario;
import com.taskquest.entity.EnvironmentType;
import com.taskquest.repository.TareaRepository;
import com.taskquest.repository.UsuarioRepository;
import com.taskquest.service.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioService usuarioService;
    private final TareaRepository tareaRepository;
    private final UsuarioRepository usuarioRepository;

    public DataInitializer(UsuarioService usuarioService, TareaRepository tareaRepository, UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;
        this.tareaRepository = tareaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Aseguramos que exista un usuario global al iniciar
        Usuario u = usuarioService.getOrCreateGlobalUser();
        System.out.println("Usuario inicial: " + u.getNombre());

        // Aseguramos que todos los usuarios tengan rol y entorno válidos (no nulos)
        for (Usuario usr : usuarioRepository.findAll()) {
            boolean updated = false;
            if (usr.getEnvironmentType() == null) {
                usr.setEnvironmentType(EnvironmentType.UNIVERSITY);
                updated = true;
            }
            if (usr.getRole() == null) {
                usr.setRole(com.taskquest.entity.Role.ESTUDIANTE);
                updated = true;
            }
            if (updated) {
                usuarioRepository.save(usr);
            }
        }

        // Si no hay tareas, sembramos las tareas semanales por defecto
        if (tareaRepository.count() == 0) {
            // Tareas Universitarias
            Tarea t1 = new Tarea();
            t1.setTitulo("Presentación de Biología");
            t1.setDescripcion("Lectura y preparación de diapositivas.");
            t1.setCompletada(false);
            t1.setPuntosExperiencia(150);
            t1.setFechaCreacion(LocalDate.now());
            t1.setFechaLimite(LocalDate.now().plusDays(2));
            t1.setEnvironmentType(EnvironmentType.UNIVERSITY);
            tareaRepository.save(t1);

            Tarea t2 = new Tarea();
            t2.setTitulo("Entrenamiento Cardio");
            t2.setDescripcion("Correr 5km en el parque.");
            t2.setCompletada(false);
            t2.setPuntosExperiencia(100);
            t2.setFechaCreacion(LocalDate.now());
            t2.setFechaLimite(LocalDate.now().plusDays(4));
            t2.setEnvironmentType(EnvironmentType.UNIVERSITY);
            tareaRepository.save(t2);

            Tarea t3 = new Tarea();
            t3.setTitulo("Revisión de Proyecto");
            t3.setDescripcion("Reunión Zoom a las 15:00 PM.");
            t3.setCompletada(false);
            t3.setPuntosExperiencia(200);
            t3.setFechaCreacion(LocalDate.now());
            t3.setFechaLimite(LocalDate.now().plusDays(5));
            t3.setEnvironmentType(EnvironmentType.UNIVERSITY);
            tareaRepository.save(t3);

            Tarea t4 = new Tarea();
            t4.setTitulo("Sketch de Arquitectura");
            t4.setDescripcion("Dibujar plano base de la maqueta.");
            t4.setCompletada(false);
            t4.setPuntosExperiencia(50);
            t4.setFechaCreacion(LocalDate.now().minusDays(5));
            t4.setFechaLimite(LocalDate.now().minusDays(1)); // Expirada
            t4.setEnvironmentType(EnvironmentType.UNIVERSITY);
            tareaRepository.save(t4);

            // Tareas Familiares
            Tarea tf1 = new Tarea();
            tf1.setTitulo("Lavar los platos");
            tf1.setDescripcion("Limpiar y secar la vajilla después de cenar.");
            tf1.setCompletada(false);
            tf1.setPuntosExperiencia(50);
            tf1.setFechaCreacion(LocalDate.now());
            tf1.setFechaLimite(LocalDate.now().plusDays(1));
            tf1.setEnvironmentType(EnvironmentType.FAMILY);
            tareaRepository.save(tf1);

            Tarea tf2 = new Tarea();
            tf2.setTitulo("Limpiar el salón");
            tf2.setDescripcion("Aspirar la alfombra y quitar el polvo de los muebles.");
            tf2.setCompletada(false);
            tf2.setPuntosExperiencia(150);
            tf2.setFechaCreacion(LocalDate.now());
            tf2.setFechaLimite(LocalDate.now().plusDays(3));
            tf2.setEnvironmentType(EnvironmentType.FAMILY);
            tareaRepository.save(tf2);

            Tarea tf3 = new Tarea();
            tf3.setTitulo("Sacar la basura");
            tf3.setDescripcion("Llevar las bolsas de reciclaje y orgánica al contenedor.");
            tf3.setCompletada(false);
            tf3.setPuntosExperiencia(100);
            tf3.setFechaCreacion(LocalDate.now().minusDays(4));
            tf3.setFechaLimite(LocalDate.now().minusDays(1)); // Expirada
            tf3.setEnvironmentType(EnvironmentType.FAMILY);
            tf3.setCompletada(false);
            tareaRepository.save(tf3);
        }
    }
}
