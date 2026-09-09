package com.devteciot.dev_erp.DTO.DTOUnidadeMediada;

import java.time.LocalDateTime;

public record UnidadeMedidaGetDTO(

  Long id,

  String nome,

  String sigla,

  LocalDateTime dataCriacao,

  LocalDateTime dataUpdate,

  Boolean ativo

) {
}
