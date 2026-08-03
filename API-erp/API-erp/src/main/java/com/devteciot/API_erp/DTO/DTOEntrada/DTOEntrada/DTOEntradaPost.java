package com.devteciot.API_erp.DTO.DTOEntrada.DTOEntrada;

public record DTOEntradaPost(
  Integer notaFiscal,
  Long fornecedor_id,
  Long tipoEntrada_id,
  String observacao) {

}
