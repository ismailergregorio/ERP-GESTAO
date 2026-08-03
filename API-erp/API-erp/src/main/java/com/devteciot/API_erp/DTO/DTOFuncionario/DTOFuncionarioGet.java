package com.devteciot.API_erp.DTO.DTOFuncionario;

import java.time.LocalDateTime;

public record DTOFuncionarioGet(
  Long id,
  String nome,
  String cpf,
  Long centroCusto_id,
  LocalDateTime dataCriacao){

}