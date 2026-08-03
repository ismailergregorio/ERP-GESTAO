package com.devteciot.API_erp.DTO.DTOFornecedores;

import java.time.LocalDateTime;

public record DTOFornecedoresGet(
    Long id,
    String nome,
    String cnpj,
    String telefone,
    String email,
    LocalDateTime dataCriacao) {

}
