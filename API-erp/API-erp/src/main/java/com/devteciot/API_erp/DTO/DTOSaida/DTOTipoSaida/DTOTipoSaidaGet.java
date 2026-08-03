package com.devteciot.API_erp.DTO.DTOSaida.DTOTipoSaida;

import java.time.LocalDateTime;

public record DTOTipoSaidaGet(
  Long id,
  String nome,
  LocalDateTime dataCriacao) {

}
