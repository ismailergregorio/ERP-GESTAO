package com.devteciot.dev_erp.DTO.DTOProdutos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProdutoPostDTO(

  @NotBlank(message = "O nome do produto é obrigatório") @Size(max = 150, message = "O nome do produto deve possuir no máximo 150 caracteres") String nome,

  @NotNull(message = "A unidade de medida é obrigatória") Long unidadeMedidaId,

  @NotNull(message = "A categoria é obrigatória") Long categoriaId,

  @Min(value = 0, message = "O estoque não pode ser negativo") Integer estoque,

  @Min(value = 0, message = "O estoque mínimo não pode ser negativo") Integer estoqueMinimo,

  @Min(value = 0, message = "O estoque máximo não pode ser negativo") Integer estoqueMaximo,

  @NotNull(message = "O valor unitário é obrigatório") @DecimalMin(value = "0.00", inclusive = true, message = "O valor unitário não pode ser negativo") BigDecimal valorUnitario

) {
}
