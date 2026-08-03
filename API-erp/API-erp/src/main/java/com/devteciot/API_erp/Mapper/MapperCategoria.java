package com.devteciot.API_erp.Mapper;

import com.devteciot.API_erp.DTO.DTOCategoria.DTOCategoriaGet;
import com.devteciot.API_erp.Models.ModelTbCategoria;

public class MapperCategoria {
 public static DTOCategoriaGet toDTOUnidadeMedida(ModelTbCategoria dto) {
  return new DTOCategoriaGet(
    dto.getId(),
    dto.getNome(),
    dto.getAtivo(),
    dto.getDataCriacao());
 }
}
