package com.devteciot.API_erp.DTO.DTOSaida.DTOSaidaProduto;

import java.math.BigDecimal;

public record DTOSaidaProdutoPost(
  Long saida_id,
  Long produto_id,
  Integer quantidade,
  BigDecimal valorUnitario,
  BigDecimal valorTotal
  ) {

}
