package com.devteciot.API_erp.Mapper.MapperSaida;

import com.devteciot.API_erp.DTO.DTOSaida.DTOSaidaProduto.DTOSaidaProdutoGet;
import com.devteciot.API_erp.Models.ModelSaida.ModelTbSaidaProduto;

public class MapperProdutoSaida {
 public static DTOSaidaProdutoGet toDTOSaidaProduto(ModelTbSaidaProduto dto) {
  return new DTOSaidaProdutoGet(
    dto.getId(),
    dto.getSaida_id().getId(),
    dto.getProduto_id().getId(),
    dto.getQuantidade(),
    dto.getValorUnitario(),
    dto.getValorTotal(),
    dto.getDataCriacao());
 };
}
