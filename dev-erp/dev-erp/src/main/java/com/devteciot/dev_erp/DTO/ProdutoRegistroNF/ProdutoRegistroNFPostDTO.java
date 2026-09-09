package com.devteciot.dev_erp.DTO.ProdutoRegistroNF;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProdutoRegistroNFPostDTO(

  @NotBlank(message = "O código do produto é obrigatório") @Size(max = 100, message = "O código deve possuir no máximo 100 caracteres") String codigo,

  @NotBlank(message = "A descrição do produto é obrigatória") @Size(max = 255, message = "A descrição deve possuir no máximo 255 caracteres") String descricao,

  @NotBlank(message = "A unidade do produto é obrigatória") @Size(max = 20, message = "A unidade deve possuir no máximo 20 caracteres") String unidade,

  @NotNull(message = "A quantidade é obrigatória") @DecimalMin(value = "0.001", message = "A quantidade deve ser maior que zero") BigDecimal quantidade,

  @NotNull(message = "O valor unitário é obrigatório") @DecimalMin(value = "0.00", message = "O valor unitário não pode ser negativo") BigDecimal valorUnitario,

  @NotNull(message = "O valor total é obrigatório") @DecimalMin(value = "0.00", message = "O valor total não pode ser negativo") BigDecimal valorTotal,

  @NotNull(message = "A nota fiscal é obrigatória") Long nfId

) {
}