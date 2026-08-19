package com.devteciot.API_erp.DTO.DTOXMLnota;

import java.math.BigDecimal;

public record DTOprodutosXML(
  Long idNota,
  String codigo,
  String descricao,
  String unidadeComercial,
  BigDecimal quantidade,
  BigDecimal valorUnitario,
  BigDecimal valorTotal) {
}
