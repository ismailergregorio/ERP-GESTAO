package com.devteciot.dev_erp.DTO.DTOSaida;

import java.math.BigDecimal;

public record SaidaProdutoGetDTO(
        Long id,
        Long produtoId,
        String produto,
        String unidade,
        Integer quantidade,
        BigDecimal valorUnitario,
        BigDecimal valorTotal
) {}
