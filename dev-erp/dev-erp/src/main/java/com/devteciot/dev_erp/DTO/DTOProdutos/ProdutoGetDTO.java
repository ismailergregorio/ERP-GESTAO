package com.devteciot.dev_erp.DTO.DTOProdutos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProdutoGetDTO(

  Long id,

  String nome,

  Long unidadeMedidaId,

  String unidadeMedida,

  String siglaUnidadeMedida,

  Long categoriaId,

  String categoria,

  LocalDateTime dataCriacao,

  LocalDateTime dataUpdate,

  Boolean ativo,

  Integer estoque,

  Integer estoqueMinimo,

  Integer estoqueMaximo,

  BigDecimal valorUnitario

) {
}