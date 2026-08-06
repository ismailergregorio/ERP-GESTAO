package com.devteciot.API_erp.Mapper.MapperEntrada;

import com.devteciot.API_erp.DTO.DTOEntrada.DTOEntrada.DTOEntradaGet;
import com.devteciot.API_erp.Models.ModelEntrada.ModelTbEntrada;

public class MapperEntrada {
  public static DTOEntradaGet toDTOEntrada(ModelTbEntrada dto){
   return new DTOEntradaGet(
    dto.getId(),
    dto.getNotaFiscal(),
    dto.getFornecedor().getId(),
    dto.getTipoEntrada().getId(),
    dto.getObservacao(),
    dto.getDataCriacao()
   );
  }
}
