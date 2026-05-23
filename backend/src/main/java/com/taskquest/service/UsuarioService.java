package com.taskquest.service;

import com.taskquest.entity.Usuario;
import com.taskquest.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public Usuario getOrCreateGlobalUser() {
        Optional<Usuario> opt = repository.findFirstByOrderByIdAsc();
        if (opt.isPresent()) return opt.get();
        Usuario u = new Usuario("Alex");
        u.setNivel(12);
        u.setXpActual(45);
        u.setPuntos(450);
        u.setImagenUrl("https://lh3.googleusercontent.com/aida-public/AB6AXuAvp_BV88Xg8jW_AId2FbrML7dmY-k6YoaIAs9RKXEnRMR3kDeefb6MyD97wDoGW8M3BCo7d5MN4R0S0fzsKbPC5W-_343OnZvf20WKAVE2KKklW-I8VTXep50sdnp3ypaR2MwwcYKu0ayVNFacXNHBJ0CdT2wkUKenBQav7SuA_Re8MPbx2Ylp36QGx9LhkSTTtKovdhhaKT2datt4nKATwxmdEu4pzCxPbwKHhDllJKm7Mi0wp1fbKscX1uNmnec5Alje3OymSk");
        return repository.save(u);
    }

    public List<Usuario> getAllUsers() {
        return repository.findAll();
    }

    public Usuario updateUser(Usuario updated) {
        Usuario u = getOrCreateGlobalUser();
        u.setNombre(updated.getNombre());
        u.setNivel(updated.getNivel());
        u.setXpActual(updated.getXpActual());
        u.setPuntos(updated.getPuntos());
        if (updated.getImagenUrl() != null) {
            u.setImagenUrl(updated.getImagenUrl());
        }
        return repository.save(u);
    }

    /**
     * Suma XP al usuario global; realiza nivelaciones cada 100 XP.
     */
    public Usuario addXpToGlobalUser(int xp) {
        Usuario u = getOrCreateGlobalUser();
        int currentXp = u.getXpActual() == null ? 0 : u.getXpActual();
        int total = currentXp + xp;
        int levelUps = total / 100;
        int remaining = total % 100;
        if (levelUps > 0) {
            int newLevel = (u.getNivel() == null ? 1 : u.getNivel()) + levelUps;
            u.setNivel(newLevel);
        }
        u.setXpActual(remaining);
        return repository.save(u);
    }

    public Usuario addXpToUser(Long userId, int xp) {
        Optional<Usuario> opt = repository.findById(userId);
        if (opt.isEmpty()) return null;
        Usuario u = opt.get();
        int currentXp = u.getXpActual() == null ? 0 : u.getXpActual();
        int total = currentXp + xp;
        int levelUps = total / 100;
        int remaining = total % 100;
        if (levelUps > 0) {
            int newLevel = (u.getNivel() == null ? 1 : u.getNivel()) + levelUps;
            u.setNivel(newLevel);
        }
        u.setXpActual(remaining);
        return repository.save(u);
    }
}
