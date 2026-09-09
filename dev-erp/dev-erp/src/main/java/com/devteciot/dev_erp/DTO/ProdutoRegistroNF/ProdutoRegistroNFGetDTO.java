package com.devteciot.dev_erp.DTO.ProdutoRegistroNF;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProdutoRegistroNFGetDTO(

  Long id,

  String codigo,

  String descricao,

  LocalDateTime dataCriacao,

  LocalDateTime dataUpdate,

  Boolean ativo,

  String unidade,

  BigDecimal quantidade,

  BigDecimal valorUnitario,

  BigDecimal valorTotal,

  Long nfId,

  String numeroNF

) {
}