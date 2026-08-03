package com.devteciot.API_erp.DTO.DTOFuncionario;

import java.time.LocalDateTime;

public record DTOFuncionarioPost(
  String nome,
  String cpf,
  Long centroCusto_id,
  LocalDateTime dataCriacao) {

}
