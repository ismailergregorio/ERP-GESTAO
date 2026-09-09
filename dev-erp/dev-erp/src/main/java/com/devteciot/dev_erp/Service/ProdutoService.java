package com.devteciot.dev_erp.Service;


import com.devteciot.dev_erp.DTO.DTOProdutos.ProdutoGetDTO;
import com.devteciot.dev_erp.DTO.DTOProdutos.ProdutoPostDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.ProdutoMapper;
import com.devteciot.dev_erp.Models.Categoria;
import com.devteciot.dev_erp.Models.Produto;
import com.devteciot.dev_erp.Models.UnidadeMedida;
import com.devteciot.dev_erp.Repository.CategoriaRepository;
import com.devteciot.dev_erp.Repository.ProdutoRepository;
import com.devteciot.dev_erp.Repository.UnidadeMedidaRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

 private final ProdutoRepository repository;

 private final CategoriaRepository categoriaRepository;

 private final UnidadeMedidaRepository unidadeMedidaRepository;

 private final ProdutoMapper mapper;

 /*
  * =====================================================
  * CRIAR
  * =====================================================
  */

 public ProdutoGetDTO criar(
   ProdutoPostDTO dto) {

  if (repository.existsByNomeIgnoreCase(dto.nome())) {

   throw new IllegalArgumentException(
     "Já existe um produto com o nome: "
       + dto.nome());
  }

  Categoria categoria = categoriaRepository.findById(
    dto.categoriaId()).orElseThrow(
      () -> new ResourceNotFoundException(
        "Categoria não encontrada com o ID: "
          + dto.categoriaId()));

  UnidadeMedida unidadeMedida = unidadeMedidaRepository.findById(
    dto.unidadeMedidaId()).orElseThrow(
      () -> new ResourceNotFoundException(
        "Unidade de medida não encontrada "
          + "com o ID: "
          + dto.unidadeMedidaId()));

  if (!categoria.getAtivo()) {

   throw new IllegalArgumentException(
     "A categoria selecionada está inativa.");
  }

  if (!unidadeMedida.getAtivo()) {

   throw new IllegalArgumentException(
     "A unidade de medida selecionada está inativa.");
  }

  Produto produto = mapper.toEntity(dto);

  produto.setCategoria(categoria);

  produto.setUnidadeMedida(unidadeMedida);

  produto.setAtivo(true);

  Produto salvo = repository.save(produto);

  return mapper.toGetDTO(salvo);
 }

 /*
  * =====================================================
  * LISTAR
  * =====================================================
  */

 public List<ProdutoGetDTO> listar() {

  return repository.findAll()
    .stream()
    .map(mapper::toGetDTO)
    .toList();
 }

 /*
  * =====================================================
  * LISTAR ATIVOS
  * =====================================================
  */

 public List<ProdutoGetDTO> listarAtivos() {

  return repository.findByAtivoTrue()
    .stream()
    .map(mapper::toGetDTO)
    .toList();
 }

 /*
  * =====================================================
  * BUSCAR POR ID
  * =====================================================
  */

 public ProdutoGetDTO buscarPorId(
   Long id) {

  Produto produto = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Produto não encontrado com o ID: "
        + id));

  return mapper.toGetDTO(produto);
 }

 /*
  * =====================================================
  * ATUALIZAR
  * =====================================================
  */

 public ProdutoGetDTO atualizar(
   Long id,
   ProdutoPostDTO dto) {

  Produto produto = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Produto não encontrado com o ID: "
        + id));

  Categoria categoria = categoriaRepository.findById(
    dto.categoriaId()).orElseThrow(
      () -> new ResourceNotFoundException(
        "Categoria não encontrada com o ID: "
          + dto.categoriaId()));

  UnidadeMedida unidadeMedida = unidadeMedidaRepository.findById(
    dto.unidadeMedidaId()).orElseThrow(
      () -> new ResourceNotFoundException(
        "Unidade de medida não encontrada "
          + "com o ID: "
          + dto.unidadeMedidaId()));

  if (!categoria.getAtivo()) {

   throw new IllegalArgumentException(
     "A categoria selecionada está inativa.");
  }

  if (!unidadeMedida.getAtivo()) {

   throw new IllegalArgumentException(
     "A unidade de medida selecionada está inativa.");
  }

  mapper.updateEntity(
    produto,
    dto);

  produto.setCategoria(categoria);

  produto.setUnidadeMedida(unidadeMedida);

  Produto atualizado = repository.save(produto);

  return mapper.toGetDTO(atualizado);
 }

 /*
  * =====================================================
  * EXCLUSÃO LÓGICA
  * =====================================================
  */

 public void excluir(Long id) {

  Produto produto = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Produto não encontrado com o ID: "
        + id));

  produto.setAtivo(false);

  repository.save(produto);
 }
}