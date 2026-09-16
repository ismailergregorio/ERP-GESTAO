package com.devteciot.dev_erp.DTO.DTOEntrada;

import java.time.LocalDateTime;

public record EntradaGetDTO(

  Long id,

  Long tiposEntradaId,

  String nomeTipoEntrada,

  String obs,

  LocalDateTime dataCriacao,

  LocalDateTime dataUpdate,

  Long nfId,

  String numeroNF

) {
}