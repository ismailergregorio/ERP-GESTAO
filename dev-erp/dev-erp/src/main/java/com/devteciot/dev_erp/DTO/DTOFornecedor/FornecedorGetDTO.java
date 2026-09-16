package com.devteciot.dev_erp.DTO.DTOFornecedor;

import java.time.LocalDateTime;

public record FornecedorGetDTO(

  Long id,

  String razaoSocial,

  String nomeFantasia,

  String inscricaoEstadual,

  String cnpj,

  String telefone,

  String email,

  LocalDateTime dataCriacao,

  LocalDateTime dataUpdate,

  Boolean ativo
) {
}