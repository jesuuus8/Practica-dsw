package com.taskquest.dto;

public class IaTaskRequest {
    private Long grupoId;
    private String descripcionGeneral;

    public IaTaskRequest() {}

    public IaTaskRequest(Long grupoId, String descripcionGeneral) {
        this.grupoId = grupoId;
        this.descripcionGeneral = descripcionGeneral;
    }

    public Long getGrupoId() {
        return grupoId;
    }

    public void setGrupoId(Long grupoId) {
        this.grupoId = grupoId;
    }

    public String getDescripcionGeneral() {
        return descripcionGeneral;
    }

    public void setDescripcionGeneral(String descripcionGeneral) {
        this.descripcionGeneral = descripcionGeneral;
    }
}
