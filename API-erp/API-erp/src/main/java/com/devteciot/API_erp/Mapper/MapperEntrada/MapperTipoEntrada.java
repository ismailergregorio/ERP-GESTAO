package com.devteciot.API_erp.Mapper.MapperEntrada;

import com.devteciot.API_erp.DTO.DTOEntrada.DTOTipoEntrada.DTOTipoEntradaGet;
import com.devteciot.API_erp.Models.ModelEntrada.ModelTbTipoEntrada;

public class MapperTipoEntrada {
 public static DTOTipoEntradaGet toDTOTipoEntrada(ModelTbTipoEntrada dto) {
  return new DTOTipoEntradaGet(
    dto.getId(),
    dto.getNome(),
    dto.getDataCriacao());
 }
}
