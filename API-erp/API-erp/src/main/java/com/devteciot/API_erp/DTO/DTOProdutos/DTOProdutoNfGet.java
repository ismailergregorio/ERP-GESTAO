package com.devteciot.API_erp.DTO.DTOProdutos;

import java.math.BigDecimal;

public record DTOProdutoNfGet(
  Long id,

  Long nfId,
  Long produtoRelacionadoId,

  String codigo,
  String descricao,
  String codigoEAN,
  String ncm,
  String cest,
  String cfop,
  String unidadeComercial,
  String unidadeTributaria,

  BigDecimal quantidade,
  BigDecimal quantidadeTributaria,
  BigDecimal valorUnitario,
  BigDecimal valorUnitarioTributario,
  BigDecimal valorTotal){

}
