package com.devteciot.dev_erp.DTO.DTOMovimentacao;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record MovimentacaoGetDTO(
        Long id,
        String tipo,
        Long produtoId,
        String produto,
        Integer quantidade,
        BigDecimal valorUnitario,
        BigDecimal valorTotal,
        LocalDate validade,
        LocalDateTime data,
        Long documentoId,
        String documento,
        String responsavel,
        String setor,
        String finalidade
) {}
