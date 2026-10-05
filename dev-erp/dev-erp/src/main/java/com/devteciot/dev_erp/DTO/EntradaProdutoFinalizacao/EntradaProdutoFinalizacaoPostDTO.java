package com.devteciot.dev_erp.DTO.EntradaProdutoFinalizacao;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EntradaProdutoFinalizacaoPostDTO(

  @NotNull(message = "O produto é obrigatório") Long produtoId,

  Long produtoNFId,

  LocalDate dataValidade,

  @NotNull(message = "A quantidade de itens é obrigatória") @DecimalMin(value = "0.01", message = "A quantidade deve ser maior que zero") BigDecimal quantidadeItens,

  @NotNull(message = "O valor unitário é obrigatório") @DecimalMin(value = "0.00", message = "O valor unitário não pode ser negativo") BigDecimal valorUnitario,

  @NotNull(message = "O valor total é obrigatório") @DecimalMin(value = "0.00", message = "O valor total não pode ser negativo") BigDecimal valorTotal

) {
}