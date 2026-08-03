package com.devteciot.API_erp.DTO.DTOEntrada.DTOEntrada;

import java.time.LocalDateTime;

public record DTOEntradaGet(
    Long id,
    Integer notaFiscal,
    Long fornecedor_id,
    Long tipoEntrada_id,
    String observacao,
    LocalDateTime dataCriacao) {

}
