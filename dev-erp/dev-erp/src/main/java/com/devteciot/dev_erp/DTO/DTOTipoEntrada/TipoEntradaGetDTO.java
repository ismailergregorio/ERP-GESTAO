package com.devteciot.dev_erp.DTO.DTOTipoEntrada;

import java.time.LocalDateTime;

public record TipoEntradaGetDTO(

  Long id,
  String nome,
  LocalDateTime dataCriacao,
  LocalDateTime dataUpdate

) {
}