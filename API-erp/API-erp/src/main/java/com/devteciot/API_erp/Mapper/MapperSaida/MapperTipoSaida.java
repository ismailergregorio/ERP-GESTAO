package com.devteciot.API_erp.Mapper.MapperSaida;

import com.devteciot.API_erp.DTO.DTOSaida.DTOTipoSaida.DTOTipoSaidaGet;
import com.devteciot.API_erp.Models.ModelSaida.ModelTbTipoSaida;

public class MapperTipoSaida {
 public static DTOTipoSaidaGet toDTOTipoSaida(ModelTbTipoSaida dto) {
  return new DTOTipoSaidaGet(
    dto.getId(),
    dto.getNome(),
    dto.getDataCriacao());
 }
}
