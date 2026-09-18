package com.devteciot.dev_erp.Mapper;

import com.devteciot.dev_erp.DTO.EntradaProduto.EntradaProdutoGetDTO;
import com.devteciot.dev_erp.DTO.EntradaProduto.EntradaProdutoPostDTO;
import com.devteciot.dev_erp.Models.EntradaProduto;

import org.springframework.stereotype.Component;

@Component
public class EntradaProdutoMapper {

 /*
  * =====================================================
  * DTO → ENTITY
  * =====================================================
  */

 public EntradaProduto toEntity(
   EntradaProdutoPostDTO dto) {

  EntradaProduto entradaProduto = new EntradaProduto();

  entradaProduto.setDataValidade(
    dto.dataValidade());

  entradaProduto.setQuantidadeItens(
    dto.quantidadeItens());

  entradaProduto.setValorUnitario(
    dto.valorUnitario());

  entradaProduto.setValorTotal(
    dto.valorTotal());

  return entradaProduto;
 }

 /*
  * =====================================================
  * ENTITY → DTO
  * =====================================================
  */

 public EntradaProdutoGetDTO toGetDTO(
   EntradaProduto entradaProduto) {

  Long entradaId = null;

  if (entradaProduto.getEntrada() != null) {
   entradaId = entradaProduto.getEntrada().getId();
  }

  Long produtoId = null;
  String nomeProduto = null;

  if (entradaProduto.getProduto() != null) {

   produtoId = entradaProduto.getProduto().getId();

   nomeProduto = entradaProduto.getProduto().getNome();
  }

  Long produtoNFId = null;
  String codigoProdutoNF = null;
  String descricaoProdutoNF = null;

  if (entradaProduto.getProdutoNF() != null) {

   produtoNFId = entradaProduto.getProdutoNF().getId();

   codigoProdutoNF = entradaProduto.getProdutoNF().getCodigo();

   descricaoProdutoNF = entradaProduto.getProdutoNF().getDescricao();
  }

  return new EntradaProdutoGetDTO(

    entradaProduto.getId(),

    entradaId,

    produtoId,
    nomeProduto,

    produtoNFId,
    codigoProdutoNF,
    descricaoProdutoNF,

    entradaProduto.getDataValidade(),

    entradaProduto.getQuantidadeItens(),

    entradaProduto.getValorUnitario(),

    entradaProduto.getValorTotal(),

    entradaProduto.getDataCriacao(),

    entradaProduto.getDataUpdate());
 }

 /*
  * =====================================================
  * ATUALIZAR ENTITY
  * =====================================================
  */

 public void updateEntity(
   EntradaProduto entradaProduto,
   EntradaProdutoPostDTO dto) {

  entradaProduto.setDataValidade(
    dto.dataValidade());

  entradaProduto.setQuantidadeItens(
    dto.quantidadeItens());

  entradaProduto.setValorUnitario(
    dto.valorUnitario());

  entradaProduto.setValorTotal(
    dto.valorTotal());
 }
}