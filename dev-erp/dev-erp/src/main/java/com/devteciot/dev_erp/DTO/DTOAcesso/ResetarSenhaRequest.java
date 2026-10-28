package com.devteciot.dev_erp.DTO.DTOAcesso;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetarSenhaRequest {
    @NotBlank
    @Size(min = 12, max = 72)
    private String senhaTemporaria;
}
