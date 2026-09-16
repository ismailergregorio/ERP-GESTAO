package com.devteciot.dev_erp.DTO.DTOEntrada;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EntradaPostDTO(

  @NotNull(message = "O tipo de entrada é obrigatório") Long tiposEntradaId,

  @Size(max = 500, message = "A observação deve possuir no máximo 500 caracteres") String obs,

  Long nfId

) {
}
