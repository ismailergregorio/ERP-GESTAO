package com.devteciot.API_erp.Services.ServicesEntrada;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.devteciot.API_erp.Models.ModelEntrada.ModelTbEntrada;
import com.devteciot.API_erp.Models.ModelEntrada.ModelTbEntradaProduto;
import com.devteciot.API_erp.Repository.RepositoryEntrada;
import com.devteciot.API_erp.Repository.RepositoryEntradaProduto;
import com.devteciot.API_erp.Repository.RepositoryProduto;
import com.devteciot.API_erp.DTO.DTOEntrada.DTOEntradaProduto.DTOEntrdaProdutoGet;
import com.devteciot.API_erp.DTO.DTOEntrada.DTOEntradaProduto.DTOEntrdaProdutoPost;
import com.devteciot.API_erp.Mapper.MapperEntrada.MapperEntradaProduto;
import com.devteciot.API_erp.Models.ModelTbProdutos;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceEntradaProduto {

 private final RepositoryEntradaProduto repositoryEntradaProduto;
 private final RepositoryEntrada repositoryEntrada;
 private final RepositoryProduto repositoryProdutos;

 @Transactional
 public DTOEntrdaProdutoGet saveEntradaProduto(DTOEntrdaProdutoPost dto) {

  ModelTbEntrada entrada = repositoryEntrada.findById(dto.entrada_id())
    .orElseThrow(() -> new RuntimeException("Entrada não encontrada."));

  ModelTbProdutos produto = repositoryProdutos.findById(dto.produto_id())
    .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

  ModelTbEntradaProduto entradaProduto = new ModelTbEntradaProduto();

  entradaProduto.setEntrada_id(entrada);
  entradaProduto.setProduto_id(produto);
  entradaProduto.setQuantidade(dto.quantidade());
  entradaProduto.setValorUnitario(dto.valorUnitario());

  BigDecimal total = dto.valorUnitario()
    .multiply(BigDecimal.valueOf(dto.quantidade()));

  entradaProduto.setValorTotal(total);

  repositoryEntradaProduto.save(entradaProduto);

  return MapperEntradaProduto.toDTOEntradaProduto(entradaProduto);
 }

 public List<DTOEntrdaProdutoGet> getListaEntradaProduto() {

  return repositoryEntradaProduto.findAll()
    .stream()
    .map(MapperEntradaProduto::toDTOEntradaProduto)
    .toList();
 }

 public DTOEntrdaProdutoGet getEntradaProduto(Long id) {

  ModelTbEntradaProduto entradaProduto = repositoryEntradaProduto.findById(id)
    .orElseThrow(() -> new RuntimeException("Item da entrada não encontrado."));

  return MapperEntradaProduto.toDTOEntradaProduto(entradaProduto);
 }

 @Transactional
 public DTOEntrdaProdutoGet updateEntradaProduto(Long id, DTOEntrdaProdutoPost dto) {

  ModelTbEntradaProduto entradaProduto = repositoryEntradaProduto.findById(id)
    .orElseThrow(() -> new RuntimeException("Item da entrada não encontrado."));

  ModelTbEntrada entrada = repositoryEntrada.findById(dto.entrada_id())
    .orElseThrow(() -> new RuntimeException("Entrada não encontrada."));

  ModelTbProdutos produto = repositoryProdutos.findById(dto.produto_id())
    .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

  entradaProduto.setEntrada_id(entrada);
  entradaProduto.setProduto_id(produto);
  entradaProduto.setQuantidade(dto.quantidade());
  entradaProduto.setValorUnitario(dto.valorUnitario());

  BigDecimal total = dto.valorUnitario()
    .multiply(BigDecimal.valueOf(dto.quantidade()));

  entradaProduto.setValorTotal(total);

  repositoryEntradaProduto.save(entradaProduto);

  return MapperEntradaProduto.toDTOEntradaProduto(entradaProduto);
 }

 @Transactional
 public void deleteEntradaProduto(Long id) {

  ModelTbEntradaProduto entradaProduto = repositoryEntradaProduto.findById(id)
    .orElseThrow(() -> new RuntimeException("Item da entrada não encontrado."));

  repositoryEntradaProduto.delete(entradaProduto);
 }

}
