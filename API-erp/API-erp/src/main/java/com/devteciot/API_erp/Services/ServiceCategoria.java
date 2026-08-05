package com.devteciot.API_erp.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devteciot.API_erp.DTO.DTOCategoria.DTOCategoriaGet;
import com.devteciot.API_erp.DTO.DTOCategoria.DTOCategoriaPost;
import com.devteciot.API_erp.Mapper.MapperCategoria;
import com.devteciot.API_erp.Models.ModelTbCategoria;
import com.devteciot.API_erp.Repository.RepositoryCategoria;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceCategoria {
 private final RepositoryCategoria repositoryCategoria;

 @Transactional
 public DTOCategoriaGet saveCategoria(DTOCategoriaPost dto) {

  Optional<ModelTbCategoria> categoria = repositoryCategoria.findByNome(dto.nome());

  if (categoria.isPresent()) {
   throw new RuntimeException("Categoria já cadastrada.");
  }

  ModelTbCategoria newCategoria = new ModelTbCategoria();
  newCategoria.setNome(dto.nome());

  repositoryCategoria.save(newCategoria);

  return MapperCategoria.toDTOCategoria(newCategoria);
 }

 public List<DTOCategoriaGet> getListaCategoria() {

  return repositoryCategoria.findAll()
    .stream()
    .map(MapperCategoria::toDTOCategoria)
    .toList();
 }

 public DTOCategoriaGet getCategoria(Long id) {

  ModelTbCategoria categoria = repositoryCategoria.findById(id)
    .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

  return MapperCategoria.toDTOCategoria(categoria);
 }

 @Transactional
 public DTOCategoriaGet updateCategoria(Long id, DTOCategoriaPost dto) {

  ModelTbCategoria categoria = repositoryCategoria.findById(id)
    .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

  Optional<ModelTbCategoria> categoriaExistente = repositoryCategoria.findByNome(dto.nome());

  if (categoriaExistente.isPresent()
    && !categoriaExistente.get().getId().equals(id)) {
   throw new RuntimeException("Já existe uma categoria com esse nome.");
  }

  categoria.setNome(dto.nome());

  repositoryCategoria.save(categoria);

  return MapperCategoria.toDTOCategoria(categoria);
 }

 @Transactional
 public void deleteCategoria(Long id) {

  ModelTbCategoria categoria = repositoryCategoria.findById(id)
    .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

  repositoryCategoria.delete(categoria);
 }
}