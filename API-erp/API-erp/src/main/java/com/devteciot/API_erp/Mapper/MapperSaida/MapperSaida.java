package com.devteciot.API_erp.Mapper.MapperSaida;

import com.devteciot.API_erp.DTO.DTOSaida.DTOSaida.DTOSaidaGet;
import com.devteciot.API_erp.Models.ModelSaida.ModelTbSaida;

public class MapperSaida {
 public static DTOSaidaGet toDTOSaida(ModelTbSaida dto) {
  return new DTOSaidaGet(
    dto.getId(),
    dto.getFuncionario().getId(),
    dto.getTipoSaida().getId(),
    dto.getObservacao(),
    dto.getDataCriacao());
 }
}
