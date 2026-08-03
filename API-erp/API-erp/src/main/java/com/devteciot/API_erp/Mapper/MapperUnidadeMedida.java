package com.devteciot.API_erp.Mapper;

import com.devteciot.API_erp.DTO.DTOUnidadeMedida.DTOUnidadeMediddaGet;
import com.devteciot.API_erp.Models.ModelTbUnidadeMedida;

public class MapperUnidadeMedida {
 public static DTOUnidadeMediddaGet toDTOUnidadeMedida(ModelTbUnidadeMedida dto) {
  return new DTOUnidadeMediddaGet(
    dto.getId(),
    dto.getNome(),
    dto.getSigua(),
    dto.getAtivo(),
    dto.getDataCriacao());
 }
}
