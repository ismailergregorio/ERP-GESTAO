package com.devteciot.API_erp.Mapper;

import com.devteciot.API_erp.DTO.DTOFornecedores.DTOFornecedoresGet;
import com.devteciot.API_erp.Models.ModelTbFornecedores;

public class MapperFornecedores {
 public static DTOFornecedoresGet toDTOFornecedores(ModelTbFornecedores dto) {
  return new DTOFornecedoresGet(
    dto.getId(),
    dto.getNome(),
    dto.getCnpj(),
    dto.getTelefone(),
    dto.getEmail(),
    dto.getDataCriacao());
 }
}
