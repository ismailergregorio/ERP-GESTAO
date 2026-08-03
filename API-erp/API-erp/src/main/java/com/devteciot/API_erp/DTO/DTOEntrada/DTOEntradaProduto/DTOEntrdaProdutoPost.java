package com.devteciot.API_erp.DTO.DTOEntrada.DTOEntradaProduto;

import java.math.BigDecimal;

public record DTOEntrdaProdutoPost(
  Long entrada_id,
  Long produto_id,
  Integer quantidade,
  BigDecimal valorUnitario,
  BigDecimal valorTotal) {
}
