package com.devteciot.dev_erp.Mapper;

import com.devteciot.dev_erp.DTO.DTOProdutos.ProdutoGetDTO;
import com.devteciot.dev_erp.DTO.DTOProdutos.ProdutoPostDTO;
import com.devteciot.dev_erp.Models.Produto;

import org.springframework.stereotype.Component;

@Component
public class ProdutoMapper {

 public Produto toEntity(
   ProdutoPostDTO dto) {

  Produto produto = new Produto();

  produto.setNome(dto.nome());

  produto.setEstoque(
    dto.estoque() != null
      ? dto.estoque()
      : 0);

  produto.setEstoqueMinimo(
    dto.estoqueMinimo() != null
      ? dto.estoqueMinimo()
      : 0);

  produto.setEstoqueMaximo(
    dto.estoqueMaximo() != null
      ? dto.estoqueMaximo()
      : 0);

  produto.setValorUnitario(
    dto.valorUnitario());

  return produto;
 }

 public ProdutoGetDTO toGetDTO(
   Produto produto) {

  return new ProdutoGetDTO(

    produto.getId(),

    produto.getNome(),

    produto.getUnidadeMedida().getId(),

    produto.getUnidadeMedida().getNome(),

    produto.getUnidadeMedida().getSigla(),

    produto.getCategoria().getId(),

    produto.getCategoria().getNome(),

    produto.getDataCriacao(),

    produto.getDataUpdate(),

    produto.getAtivo(),

    produto.getEstoque(),

    produto.getEstoqueMinimo(),

    produto.getEstoqueMaximo(),

    produto.getValorUnitario());
 }

 public void updateEntity(
   Produto produto,
   ProdutoPostDTO dto) {

  produto.setNome(dto.nome());

  if (dto.estoque() != null) {
   produto.setEstoque(dto.estoque());
  }

  if (dto.estoqueMinimo() != null) {
   produto.setEstoqueMinimo(
     dto.estoqueMinimo());
  }

  if (dto.estoqueMaximo() != null) {
   produto.setEstoqueMaximo(
     dto.estoqueMaximo());
  }

  produto.setValorUnitario(
    dto.valorUnitario());
 }
}