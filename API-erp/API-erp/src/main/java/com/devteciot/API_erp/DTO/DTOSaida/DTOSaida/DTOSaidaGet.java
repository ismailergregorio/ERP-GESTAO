package com.devteciot.API_erp.DTO.DTOSaida.DTOSaida;

import java.time.LocalDateTime;

public record DTOSaidaGet(
    Long id,
    Long funcionario_id,
    Long tipoSaida_id,
    String observacao,
    LocalDateTime dataCriacao) {

}
