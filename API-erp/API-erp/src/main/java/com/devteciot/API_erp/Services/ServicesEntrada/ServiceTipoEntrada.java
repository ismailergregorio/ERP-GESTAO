package com.devteciot.API_erp.Services.ServicesEntrada;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.devteciot.API_erp.DTO.DTOEntrada.DTOTipoEntrada.DTOTipoEntradaGet;
import com.devteciot.API_erp.DTO.DTOEntrada.DTOTipoEntrada.DTOTipoEntradaPost;
import com.devteciot.API_erp.Mapper.MapperEntrada.MapperTipoEntrada;
import com.devteciot.API_erp.Models.ModelEntrada.ModelTbTipoEntrada;
import com.devteciot.API_erp.Repository.RepositoryTipoEntrada;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceTipoEntrada {

 private final RepositoryTipoEntrada repositoryTipoEntrada;

 @Transactional
 public DTOTipoEntradaGet saveTipoEntrada(DTOTipoEntradaPost dto) {

  Optional<ModelTbTipoEntrada> tipoEntrada = repositoryTipoEntrada.findByNome(dto.nome());

  if (tipoEntrada.isPresent()) {
   throw new RuntimeException("Tipo de entrada já cadastrado.");
  }

  ModelTbTipoEntrada novoTipoEntrada = new ModelTbTipoEntrada();
  novoTipoEntrada.setNome(dto.nome());

  repositoryTipoEntrada.save(novoTipoEntrada);

  return MapperTipoEntrada.toDTOTipoEntrada(novoTipoEntrada);
 }

 public List<DTOTipoEntradaGet> getListaTipoEntrada() {

  return repositoryTipoEntrada.findAll()
    .stream()
    .map(MapperTipoEntrada::toDTOTipoEntrada)
    .toList();
 }

 public DTOTipoEntradaGet getTipoEntrada(Long id) {

  ModelTbTipoEntrada tipoEntrada = repositoryTipoEntrada.findById(id)
    .orElseThrow(() -> new RuntimeException("Tipo de entrada não encontrado."));

  return MapperTipoEntrada.toDTOTipoEntrada(tipoEntrada);
 }

 public DTOTipoEntradaGet getTipoEntradaNome(String nome) {

  ModelTbTipoEntrada tipoEntrada = repositoryTipoEntrada.findByNome(nome)
    .orElseThrow(() -> new RuntimeException("Tipo de entrada não encontrado."));

  return MapperTipoEntrada.toDTOTipoEntrada(tipoEntrada);
 }

 @Transactional
 public DTOTipoEntradaGet updateTipoEntrada(Long id, DTOTipoEntradaPost dto) {

  ModelTbTipoEntrada tipoEntrada = repositoryTipoEntrada.findById(id)
    .orElseThrow(() -> new RuntimeException("Tipo de entrada não encontrado."));

  Optional<ModelTbTipoEntrada> existente = repositoryTipoEntrada.findByNome(dto.nome());

  if (existente.isPresent() &&
    !existente.get().getId().equals(id)) {

   throw new RuntimeException("Já existe um tipo de entrada com esse nome.");
  }

  tipoEntrada.setNome(dto.nome());

  repositoryTipoEntrada.save(tipoEntrada);

  return MapperTipoEntrada.toDTOTipoEntrada(tipoEntrada);
 }

 @Transactional
 public void deleteTipoEntrada(Long id) {

  ModelTbTipoEntrada tipoEntrada = repositoryTipoEntrada.findById(id)
    .orElseThrow(() -> new RuntimeException("Tipo de entrada não encontrado."));

  repositoryTipoEntrada.delete(tipoEntrada);
 }

}
