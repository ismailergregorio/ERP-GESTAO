package com.devteciot.dev_erp.DTO.DTOAcesso;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AlterarSenhaRequest {
    @NotBlank private String senhaAtual;
    @NotBlank @Size(min = 6, max = 72) private String novaSenha;
}
