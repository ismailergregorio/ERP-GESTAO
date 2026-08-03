package com.devteciot.API_erp.Mapper;

import com.devteciot.API_erp.DTO.DTOCentroCusto.DTOCentroCustoGet;
import com.devteciot.API_erp.Models.ModelTbCentroCusto;

public class MapperCentroCusto {
 public static DTOCentroCustoGet toDTOCentroCusto(ModelTbCentroCusto dto) {
  return new DTOCentroCustoGet(
    dto.getId(),
    dto.getNome(),
    dto.getDataCriacao());
 }
}
