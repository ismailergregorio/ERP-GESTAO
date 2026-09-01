package com.devteciot.API_erp.DTO.DTONf;

import java.time.LocalDateTime;
import java.util.List;

public record DTONfGet(
  Long id,

  Integer nNF,

  List<Long> produtosIds,
  LocalDateTime dataCriacao) {

}
