package com.devteciot.API_erp.DTO.DTOProdutos;

import java.math.BigDecimal;

public record DTOProdutosPost(
  String nome,
  Long unidadeMedida,
  Long categoria,
  BigDecimal valorUnitario,
  Integer estoque,
  Integer estoqueMinimo,
  Integer estoqueMaximo) {

}
