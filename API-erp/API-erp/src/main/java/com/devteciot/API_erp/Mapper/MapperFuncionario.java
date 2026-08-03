package com.devteciot.API_erp.Mapper;

import com.devteciot.API_erp.DTO.DTOFuncionario.DTOFuncionarioGet;
import com.devteciot.API_erp.Models.ModelTbFuncionario;

public class MapperFuncionario {
 public static DTOFuncionarioGet toDTOFuncionario(ModelTbFuncionario dto) {
  return new DTOFuncionarioGet(
    dto.getId(),
    dto.getNome(),
    dto.getCpf(),
    dto.getCentroCusto_id().getId(),
    dto.getDataCriacao());
 }
}
