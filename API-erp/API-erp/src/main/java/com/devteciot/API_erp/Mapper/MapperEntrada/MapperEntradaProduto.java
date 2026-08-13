package com.devteciot.API_erp.Mapper.MapperEntrada;

import com.devteciot.API_erp.DTO.DTOEntrada.DTOEntradaProduto.DTOEntrdaProdutoGet;
import com.devteciot.API_erp.Models.ModelEntrada.ModelTbEntradaProduto;

public class MapperEntradaProduto {
 public static DTOEntrdaProdutoGet toDTOEntradaProduto(ModelTbEntradaProduto dto) {
  return new DTOEntrdaProdutoGet(
    dto.getId(),
    dto.getEntrada().getId(),
    dto.getProduto().getId(),
    dto.getQuantidade(),
    dto.getValorUnitario(),
    dto.getValorTotal(),
    dto.getDataCriacao(),
    dto.getDataAtualizacao());
 }
}
