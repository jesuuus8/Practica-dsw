package com.taskquest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    // XP acumulada hacia el siguiente nivel (0-99)
    private Integer xpActual = 0;

    private Integer nivel = 1;

    private Integer puntos = 0;

    private String imagenUrl;

    private String telefono;

    private String email;

    private Integer edad;

    public Usuario() {}

    public Usuario(String nombre) {
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getXpActual() {
        return xpActual;
    }

    public void setXpActual(Integer xpActual) {
        this.xpActual = xpActual;
    }

    public Integer getNivel() {
        return nivel;
    }

    public void setNivel(Integer nivel) {
        this.nivel = nivel;
    }

    public Integer getPuntos() {
        return puntos;
    }

    public void setPuntos(Integer puntos) {
        this.puntos = puntos;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    @Enumerated(EnumType.STRING)
    private Role role = Role.ESTUDIANTE;

    @Enumerated(EnumType.STRING)
    private EnvironmentType environmentType = EnvironmentType.UNIVERSITY;

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public EnvironmentType getEnvironmentType() {
        return environmentType;
    }

    public void setEnvironmentType(EnvironmentType environmentType) {
        this.environmentType = environmentType;
    }
}
