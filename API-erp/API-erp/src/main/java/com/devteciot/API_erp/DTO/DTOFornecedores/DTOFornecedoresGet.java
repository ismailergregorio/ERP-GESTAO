package com.devteciot.API_erp.DTO.DTOFornecedores;

import java.time.LocalDateTime;

public record DTOFornecedoresGet(
        Long id,
        String razaoSocial,
        String nomeFantasia,
        String inscricaoEstadual,
        String cnpj,
        String telefone,
        String email,
        LocalDateTime dataCriacao) {

}
