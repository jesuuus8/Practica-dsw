package com.taskquest.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.taskquest.entity.Grupo;

@Entity
@Table(name = "tareas")
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(length = 2000)
    private String descripcion;

    private Boolean completada = false;

    private Boolean realizada = false;

    private Integer puntosExperiencia = 0;

    private LocalDate fechaCreacion;

    private LocalDate fechaLimite;

    @ManyToOne
    @JoinColumn(name = "grupo_id")
    private Grupo grupo;

    public Tarea() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Boolean getCompletada() {
        return completada;
    }

    public void setCompletada(Boolean completada) {
        this.completada = completada;
    }

    public Boolean getRealizada() {
        return realizada;
    }

    public void setRealizada(Boolean realizada) {
        this.realizada = realizada;
    }

    public Integer getPuntosExperiencia() {
        return puntosExperiencia;
    }

    public void setPuntosExperiencia(Integer puntosExperiencia) {
        this.puntosExperiencia = puntosExperiencia;
    }

    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDate fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Grupo getGrupo() { return grupo; }
    public void setGrupo(Grupo grupo) { this.grupo = grupo; }

    public LocalDate getFechaLimite() { return fechaLimite; }
    public void setFechaLimite(LocalDate fechaLimite) { this.fechaLimite = fechaLimite; }

    @ManyToOne
    @JoinColumn(name = "usuario_asignado_id")
    private Usuario usuarioAsignado;

    public Usuario getUsuarioAsignado() {
        return usuarioAsignado;
    }

    public void setUsuarioAsignado(Usuario usuarioAsignado) {
        this.usuarioAsignado = usuarioAsignado;
    }

    @Enumerated(EnumType.STRING)
    private EnvironmentType environmentType = EnvironmentType.UNIVERSITY;

    public EnvironmentType getEnvironmentType() {
        return environmentType;
    }

    public void setEnvironmentType(EnvironmentType environmentType) {
        this.environmentType = environmentType;
    }
}
