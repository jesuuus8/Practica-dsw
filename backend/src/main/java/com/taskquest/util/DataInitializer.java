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

        // Si solo existe el usuario global, sembramos usuarios de prueba para la clasificación
        if (usuarioRepository.count() <= 1) {
            // Usuarios para entorno UNIVERSITY
            Usuario u1 = new Usuario("Sara");
            u1.setNivel(10);
            u1.setXpActual(60);
            u1.setPuntos(400);
            u1.setRole(com.taskquest.entity.Role.ESTUDIANTE);
            u1.setEnvironmentType(EnvironmentType.UNIVERSITY);
            u1.setImagenUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuCD0EFEpmSsu62hpej9QRsF8e5XUheWe4uxeKU1gnnXyd9OXrHfzCpRMv3yn6XhvKv-KFyry2DNI2DW-SQ4HSTbGVOQpVZLZRWAn45nwG3aDKcbPCyPta2wds3LbIkB8O6Ddc_kSsc2KbS-GLN9L6VE3jSCjz_j1m28d_Vl9UpXBfasWIvbzPo4NIZ1wQrDvaVC83lWFjIY1evWjYMx5Dy_ByvF4YbvCiekXSca00NQ3jwafbNoUuLG1vHLMyDjr9DqIdAZFi6b6s4");
            usuarioRepository.save(u1);

            Usuario u2 = new Usuario("Juan");
            u2.setNivel(8);
            u2.setXpActual(20);
            u2.setPuntos(250);
            u2.setRole(com.taskquest.entity.Role.ESTUDIANTE);
            u2.setEnvironmentType(EnvironmentType.UNIVERSITY);
            u2.setImagenUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuC4ClzKjSwZHGhWbm9wQWhfvNzQXqyUyKESilqAfNaaZcN0vLQXvBev946XJN-VCT_g4BGquDOux1-nnyvSJgExaCfwTm1FhAa44fEnrhTu77aLf6iu77rvqeGoMK85RrtxNG72RCEJS0w4CTA0whUtr2LxjXlnK4qJnlYHIekAPbLdEQ1cHJGd0rB5JiSLPceZeHT7WGSTA4lZRN8h6-OYbh-QDayOHlqXo4_GEeqBqv67Nee_2-oN4zcxMwr8fRDKKQHmq4HZfYg");
            usuarioRepository.save(u2);

            // Usuarios para entorno FAMILY
            Usuario u3 = new Usuario("Mamá");
            u3.setNivel(15);
            u3.setXpActual(80);
            u3.setPuntos(900);
            u3.setRole(com.taskquest.entity.Role.PADRES);
            u3.setEnvironmentType(EnvironmentType.FAMILY);
            u3.setImagenUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuAa1Ey8dl5fTJkSD_XWQWxd8ZEqBHYRBPiQoEajoS3yG6JGsKo_8DnY2AqoBbHrLJ4bYDOy6avIPoBDpF_KeaCPrZpgsgce7f8EyAkIkWXm_nSpTe2kJ7nmNXEvHfcqnbVsOZfnu07eD6BOese3E0ZLonu9V4cl60lg9e9XFpast5rNEKfmBOcCVHDofhIWiMKS6E5rZjz4D-Cj_wqFRawcBDg45mxwuFVIPjsicVxbmIlNZ1VX-5CgiltLiCFwJDsYUju1X42ijio");
            usuarioRepository.save(u3);

            Usuario u4 = new Usuario("Papá");
            u4.setNivel(14);
            u4.setXpActual(50);
            u4.setPuntos(750);
            u4.setRole(com.taskquest.entity.Role.PADRES);
            u4.setEnvironmentType(EnvironmentType.FAMILY);
            u4.setImagenUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuC4ClzKjSwZHGhWbm9wQWhfvNzQXqyUyKESilqAfNaaZcN0vLQXvBev946XJN-VCT_g4BGquDOux1-nnyvSJgExaCfwTm1FhAa44fEnrhTu77aLf6iu77rvqeGoMK85RrtxNG72RCEJS0w4CTA0whUtr2LxjXlnK4qJnlYHIekAPbLdEQ1cHJGd0rB5JiSLPceZeHT7WGSTA4lZRN8h6-OYbh-QDayOHlqXo4_GEeqBqv67Nee_2-oN4zcxMwr8fRDKKQHmq4HZfYg");
            usuarioRepository.save(u4);

            Usuario u5 = new Usuario("Hermano");
            u5.setNivel(5);
            u5.setXpActual(30);
            u5.setPuntos(150);
            u5.setRole(com.taskquest.entity.Role.FAMILIAR);
            u5.setEnvironmentType(EnvironmentType.FAMILY);
            u5.setImagenUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuAvp_BV88Xg8jW_AId2FbrML7dmY-k6YoaIAs9RKXEnRMR3kDeefb6MyD97wDoGW8M3BCo7d5MN4R0S0fzsKbPC5W-_343OnZvf20WKAVE2KKklW-I8VTXep50sdnp3ypaR2MwwcYKu0ayVNFacXNHBJ0CdT2wkUKenBQav7SuA_Re8MPbx2Ylp36QGx9LhkSTTtKovdhhaKT2datt4nKATwxmdEu4pzCxPbwKHhDllJKm7Mi0wp1fbKscX1uNmnec5Alje3OymSk");
            usuarioRepository.save(u5);
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
