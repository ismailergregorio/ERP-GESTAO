package com.devteciot.API_erp.DTO.DTOEntrada.DTOTipoEntrada;

import java.time.LocalDateTime;

public record DTOTipoEntradaGet(
  Long id,
  String nome,
  LocalDateTime dataCriacao) {

}
