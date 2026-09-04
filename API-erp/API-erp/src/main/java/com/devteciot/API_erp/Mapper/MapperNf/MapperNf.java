package com.devteciot.API_erp.Mapper.MapperNf;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Component;

import com.devteciot.API_erp.DTO.DTONf.DTONfGet;
import com.devteciot.API_erp.DTO.DTONf.DTONfPost;
import com.devteciot.API_erp.Models.ModelNf.ModelNF;
import com.devteciot.API_erp.Models.ModelProdutos.ModelTbProdutosNf;
import com.devteciot.API_erp.Models.ModelTbFornecedores;

@Component
public class MapperNf {

  public ModelNF toEntity(
      DTONfPost dto,
      ModelTbFornecedores fornecedor) {

    ModelNF entity = new ModelNF();

    entity.setNNF(dto.nNF());
    entity.setFornecedor(fornecedor);

    return entity;
  }

  public DTONfGet toResponseDTO(ModelNF entity) {

    List<Long> produtosIds;

    if (entity.getProdutos() != null) {

      produtosIds = entity.getProdutos()
          .stream()
          .filter(produto -> produto != null &&
              produto.getId() != null)
          .map(ModelTbProdutosNf::getId)
          .toList();

    } else {

      produtosIds = Collections.emptyList();
    }

    Long fornecedorId = null;

    if (entity.getFornecedor() != null) {
      fornecedorId = entity.getFornecedor().getId();
    }

    return new DTONfGet(
        entity.getId(),
        entity.getNNF(),
        fornecedorId,
        produtosIds,
        entity.getDataCriacao());
  }
}