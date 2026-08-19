package com.devteciot.API_erp.Mapper;

import com.devteciot.API_erp.DTO.DTOProdutos.DTOProdutosGet;
import com.devteciot.API_erp.Models.ModelProdutos.ModelTbProdutos;

public class MapperProdutos {
 public static DTOProdutosGet toDTOProdutos(ModelTbProdutos dto) {
  return new DTOProdutosGet(
    dto.getId(),
    dto.getNome(),
    dto.getUnidadeMedida().getId(),
    dto.getCategoria().getId(),
    dto.getValorUnitario(),
    dto.getEstoque(),
    dto.getEstoqueMinimo(),
    dto.getEstoqueMaximo(),
    dto.getAtivo(),
    dto.getDataCriacao());
 }
}
