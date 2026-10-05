package com.devteciot.dev_erp.DTO.DTOEstoque;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EstoqueProdutoGetDTO(
        Long produtoId,
        String produto,
        String unidade,
        String categoria,
        Integer quantidadeEstoque,
        Integer estoqueMinimo,
        Integer estoqueMaximo,
        BigDecimal valorMedio,
        LocalDate validadeMaisProxima,
        String statusEstoque
) {}
