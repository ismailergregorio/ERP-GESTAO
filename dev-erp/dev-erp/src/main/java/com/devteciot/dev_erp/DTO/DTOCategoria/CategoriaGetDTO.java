package com.devteciot.dev_erp.DTO.DTOCategoria;

import java.time.LocalDateTime;

public record CategoriaGetDTO(

  Long id,

  String nome,

  LocalDateTime dataCriacao,

  LocalDateTime dataUpdate,

  Boolean ativo

) {
}