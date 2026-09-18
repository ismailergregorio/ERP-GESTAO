package com.devteciot.dev_erp.DTO.EntradaProduto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record EntradaProdutoGetDTO(

    Long id,

    Long entradaId,

    Long produtoId,
    String nomeProduto,

    Long produtoNFId,
    String codigoProdutoNF,
    String descricaoProdutoNF,

    LocalDate dataValidade,

    BigDecimal quantidadeItens,

    BigDecimal valorUnitario,

    BigDecimal valorTotal,

    LocalDateTime dataCriacao,

    LocalDateTime dataUpdate

) {
}