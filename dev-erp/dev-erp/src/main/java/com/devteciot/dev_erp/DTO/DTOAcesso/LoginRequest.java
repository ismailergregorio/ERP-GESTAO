package com.devteciot.dev_erp.DTO.DTOAcesso;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginRequest {
    @NotBlank private String nomeUsuario;
    @NotBlank private String senha;
}
