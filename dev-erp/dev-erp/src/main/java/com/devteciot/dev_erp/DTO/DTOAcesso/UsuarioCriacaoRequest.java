package com.devteciot.dev_erp.DTO.DTOAcesso;

import com.devteciot.dev_erp.Models.PerfilAcesso;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UsuarioCriacaoRequest {
    @NotBlank @Size(max = 120) private String nome;
    @NotBlank @Size(min = 3, max = 60) private String nomeUsuario;
    @NotBlank @Size(min = 6, max = 72) private String senhaTemporaria;
    @NotNull private PerfilAcesso perfil;
}
