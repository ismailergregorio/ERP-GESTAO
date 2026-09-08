package com.devteciot.dev_erp.DTO;

import java.time.LocalDateTime;

public record CategoriaGetDTO(

  Long id,

  String nome,

  LocalDateTime dataCriacao,

  LocalDateTime dataUpdate,

  Boolean ativo

) {
}