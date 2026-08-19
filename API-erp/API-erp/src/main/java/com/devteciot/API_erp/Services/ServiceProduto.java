package com.devteciot.API_erp.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.devteciot.API_erp.DTO.DTOProdutos.DTOProdutosGet;
import com.devteciot.API_erp.DTO.DTOProdutos.DTOProdutosPost;
import com.devteciot.API_erp.Mapper.MapperProdutos;
import com.devteciot.API_erp.Models.ModelTbCategoria;
import com.devteciot.API_erp.Models.ModelTbUnidadeMedida;
import com.devteciot.API_erp.Models.ModelProdutos.ModelTbProdutos;
import com.devteciot.API_erp.Repository.RepositoryCategoria;
import com.devteciot.API_erp.Repository.RepositoryProduto;
import com.devteciot.API_erp.Repository.RepositoryUnidadeMedida;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceProduto {

 private final RepositoryProduto repositoryProdutos;
 private final RepositoryCategoria repositoryCategoria;
 private final RepositoryUnidadeMedida repositoryUnidadeMedida;

 @Transactional
 public DTOProdutosGet saveProduto(DTOProdutosPost dto) {

  Optional<ModelTbProdutos> produto = repositoryProdutos.findByNome(dto.nome());

  if (produto.isPresent()) {
   throw new RuntimeException("Produto já cadastrado.");
  }

  ModelTbCategoria categoria = repositoryCategoria.findById(dto.categoriaId())
    .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

  ModelTbUnidadeMedida unidade = repositoryUnidadeMedida.findById(dto.unidadeMedidaId())
    .orElseThrow(() -> new RuntimeException("Unidade de medida não encontrada."));

  ModelTbProdutos novoProduto = new ModelTbProdutos();

  novoProduto.setNome(dto.nome());
  novoProduto.setCategoria(categoria);
  novoProduto.setUnidadeMedida(unidade);
  novoProduto.setValorUnitario(dto.valorUnitario());
  novoProduto.setEstoque(dto.estoque());
  novoProduto.setEstoqueMinimo(dto.estoqueMinimo());
  novoProduto.setEstoqueMaximo(dto.estoqueMaximo());

  repositoryProdutos.save(novoProduto);

  return MapperProdutos.toDTOProdutos(novoProduto);
 }

 public List<DTOProdutosGet> getListaProduto() {

  return repositoryProdutos.findAll()
    .stream()
    .map(MapperProdutos::toDTOProdutos)
    .toList();
 }

 public DTOProdutosGet getProduto(Long id) {

  ModelTbProdutos produto = repositoryProdutos.findById(id)
    .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

  return MapperProdutos.toDTOProdutos(produto);
 }

 public DTOProdutosGet getProdutoNome(String nome) {

  ModelTbProdutos produto = repositoryProdutos.findByNome(nome)
    .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

  return MapperProdutos.toDTOProdutos(produto);
 }

 @Transactional
 public DTOProdutosGet updateProduto(Long id, DTOProdutosPost dto) {

  ModelTbProdutos produto = repositoryProdutos.findById(id)
    .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

  Optional<ModelTbProdutos> existente = repositoryProdutos.findByNome(dto.nome());

  if (existente.isPresent() && !existente.get().getId().equals(id)) {
   throw new RuntimeException("Já existe um produto com esse nome.");
  }

  ModelTbCategoria categoria = repositoryCategoria.findById(dto.categoriaId())
    .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

  ModelTbUnidadeMedida unidade = repositoryUnidadeMedida.findById(dto.unidadeMedidaId())
    .orElseThrow(() -> new RuntimeException("Unidade de medida não encontrada."));

  produto.setNome(dto.nome());
  produto.setCategoria(categoria);
  produto.setUnidadeMedida(unidade);
  produto.setValorUnitario(dto.valorUnitario());
  produto.setEstoque(dto.estoque());
  produto.setEstoqueMinimo(dto.estoqueMinimo());
  produto.setEstoqueMaximo(dto.estoqueMaximo());

  repositoryProdutos.save(produto);

  return MapperProdutos.toDTOProdutos(produto);
 }

 @Transactional
 public void deleteProduto(Long id) {

  ModelTbProdutos produto = repositoryProdutos.findById(id)
    .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

  repositoryProdutos.delete(produto);
 }
}
