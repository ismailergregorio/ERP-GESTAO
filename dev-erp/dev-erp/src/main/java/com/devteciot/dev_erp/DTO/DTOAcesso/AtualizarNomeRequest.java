package com.devteciot.dev_erp.DTO.DTOAcesso;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AtualizarNomeRequest {
    @NotBlank
    @Size(max = 120)
    private String nome;
}
