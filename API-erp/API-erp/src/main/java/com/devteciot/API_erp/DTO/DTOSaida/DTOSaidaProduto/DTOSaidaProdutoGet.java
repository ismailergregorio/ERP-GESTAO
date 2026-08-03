package com.devteciot.API_erp.DTO.DTOSaida.DTOSaidaProduto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DTOSaidaProdutoGet(
    Long id,
    Long saida_id,
    Long produto_id,
    Integer quantidade,
    BigDecimal valorUnitario,
    BigDecimal valorTotal,
    LocalDateTime dataCriacao) {

}
