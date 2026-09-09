package com.devteciot.dev_erp.Mapper;

import com.devteciot.dev_erp.DTO.ProdutoRegistroNF.ProdutoRegistroNFGetDTO;
import com.devteciot.dev_erp.DTO.ProdutoRegistroNF.ProdutoRegistroNFPostDTO;
import com.devteciot.dev_erp.Models.ProdutoRegistroNF;

import org.springframework.stereotype.Component;

@Component
public class ProdutoRegistroNFMapper {

 public ProdutoRegistroNF toEntity(
   ProdutoRegistroNFPostDTO dto) {

  ProdutoRegistroNF produto = new ProdutoRegistroNF();

  produto.setCodigo(
    dto.codigo());

  produto.setDescricao(
    dto.descricao());

  produto.setUnidade(
    dto.unidade());

  produto.setQuantidade(
    dto.quantidade());

  produto.setValorUnitario(
    dto.valorUnitario());

  produto.setValorTotal(
    dto.valorTotal());

  return produto;
 }

 public ProdutoRegistroNFGetDTO toGetDTO(
   ProdutoRegistroNF produto) {

  return new ProdutoRegistroNFGetDTO(

    produto.getId(),

    produto.getCodigo(),

    produto.getDescricao(),

    produto.getDataCriacao(),

    produto.getDataUpdate(),

    produto.getAtivo(),

    produto.getUnidade(),

    produto.getQuantidade(),

    produto.getValorUnitario(),

    produto.getValorTotal(),

    produto.getNf().getId(),

    produto.getNf().getNumero());
 }

 public void updateEntity(
   ProdutoRegistroNF produto,
   ProdutoRegistroNFPostDTO dto) {

  produto.setCodigo(
    dto.codigo());

  produto.setDescricao(
    dto.descricao());

  produto.setUnidade(
    dto.unidade());

  produto.setQuantidade(
    dto.quantidade());

  produto.setValorUnitario(
    dto.valorUnitario());

  produto.setValorTotal(
    dto.valorTotal());
 }
}