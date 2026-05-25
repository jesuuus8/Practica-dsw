package com.taskquest.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "grupos")
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String imagenUrl;

    private String descripcion;

    @Enumerated(EnumType.STRING)
    private EnvironmentType environmentType;

    @ManyToMany
    @JoinTable(name = "grupo_miembros",
            joinColumns = @JoinColumn(name = "grupo_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id"))
    private Set<Usuario> miembros = new HashSet<>();

    public Grupo() {}

    public EnvironmentType getEnvironmentType() { return environmentType; }
    public void setEnvironmentType(EnvironmentType environmentType) { this.environmentType = environmentType; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Set<Usuario> getMiembros() { return miembros; }
    public void setMiembros(Set<Usuario> miembros) { this.miembros = miembros; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
