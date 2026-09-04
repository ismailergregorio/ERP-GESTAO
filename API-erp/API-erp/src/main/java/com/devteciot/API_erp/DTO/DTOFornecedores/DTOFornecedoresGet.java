package com.devteciot.API_erp.DTO.DTOFornecedores;

import java.time.LocalDateTime;
import java.util.List;

public record DTOFornecedoresGet(
        Long id,
        String razaoSocial,
        String nomeFantasia,
        String inscricaoEstadual,
        String cnpj,
        String telefone,
        String email,
        List<Integer> nfs,
        LocalDateTime dataCriacao) {
}
