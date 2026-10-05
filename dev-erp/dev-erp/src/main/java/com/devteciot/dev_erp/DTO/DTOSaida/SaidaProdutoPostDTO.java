package com.devteciot.dev_erp.DTO.DTOSaida;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SaidaProdutoPostDTO(
        @NotNull Long produtoId,
        @NotNull @Min(value = 1, message = "A quantidade deve ser maior que zero") Integer quantidade
) {}
