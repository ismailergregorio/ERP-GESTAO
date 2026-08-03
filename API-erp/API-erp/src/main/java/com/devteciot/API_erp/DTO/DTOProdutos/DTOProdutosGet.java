package com.devteciot.API_erp.DTO.DTOProdutos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DTOProdutosGet(
    Long id,
    String nome,
    Long unidadeMedida,
    Long categoria,
    BigDecimal valorUnitario,
    Integer estoque,
    Integer estoqueMinimo,
    Integer estoqueMaximo,
    Boolean ativo,
    LocalDateTime dataCriacao) {

}
