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

    private Integer puntosExperiencia = 0;

    private LocalDate fechaCreacion;

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
}
