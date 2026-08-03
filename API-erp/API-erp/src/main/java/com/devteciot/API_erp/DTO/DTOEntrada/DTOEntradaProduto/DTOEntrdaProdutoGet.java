package com.devteciot.API_erp.DTO.DTOEntrada.DTOEntradaProduto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DTOEntrdaProdutoGet(
    Long id,
    Long entrada_id,
    Long produto_id,
    Integer quantidade,
    BigDecimal valorUnitario,
    BigDecimal valorTotal,
    LocalDateTime dataCriacao,
    LocalDateTime dataAtualizacao) {
}
