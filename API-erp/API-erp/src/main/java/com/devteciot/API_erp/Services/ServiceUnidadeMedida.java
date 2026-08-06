package com.devteciot.API_erp.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.devteciot.API_erp.DTO.DTOUnidadeMedida.DTOUnidadeMediddaGet;
import com.devteciot.API_erp.DTO.DTOUnidadeMedida.DTOUnidadeMediddaPost;
import com.devteciot.API_erp.Mapper.MapperUnidadeMedida;
import com.devteciot.API_erp.Models.ModelTbUnidadeMedida;
import com.devteciot.API_erp.Repository.RepositoryUnidadeMedida;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceUnidadeMedida {

 private final RepositoryUnidadeMedida repositoryUnidadeMedida;

 @Transactional
 public DTOUnidadeMediddaGet saveUnidadeMedida(DTOUnidadeMediddaPost dto) {

  Optional<ModelTbUnidadeMedida> unidade = repositoryUnidadeMedida.findByNome(dto.nome());

  if (unidade.isPresent()) {
   throw new RuntimeException("Unidade de medida já cadastrada.");
  }

  ModelTbUnidadeMedida novaUnidade = new ModelTbUnidadeMedida();

  novaUnidade.setNome(dto.nome());
  novaUnidade.setSigua(dto.sigua());

  repositoryUnidadeMedida.save(novaUnidade);

  return MapperUnidadeMedida.toDTOUnidadeMedida(novaUnidade);
 }

 public List<DTOUnidadeMediddaGet> getListaUnidadeMedida() {

  return repositoryUnidadeMedida.findAll()
    .stream()
    .map(MapperUnidadeMedida::toDTOUnidadeMedida)
    .toList();
 }

 public DTOUnidadeMediddaGet getUnidadeMedida(Long id) {

  ModelTbUnidadeMedida unidade = repositoryUnidadeMedida.findById(id)
    .orElseThrow(() -> new RuntimeException("Unidade de medida não encontrada."));

  return MapperUnidadeMedida.toDTOUnidadeMedida(unidade);
 }

 public DTOUnidadeMediddaGet getUnidadeMedidaNome(String nome) {

  ModelTbUnidadeMedida unidade = repositoryUnidadeMedida.findByNome(nome)
    .orElseThrow(() -> new RuntimeException("Unidade de medida não encontrada."));

  return MapperUnidadeMedida.toDTOUnidadeMedida(unidade);
 }

 @Transactional
 public DTOUnidadeMediddaGet updateUnidadeMedida(Long id, DTOUnidadeMediddaGet dto) {

  ModelTbUnidadeMedida unidade = repositoryUnidadeMedida.findById(id)
    .orElseThrow(() -> new RuntimeException("Unidade de medida não encontrada."));

  Optional<ModelTbUnidadeMedida> existente = repositoryUnidadeMedida.findByNome(dto.nome());

  if (existente.isPresent() && !existente.get().getId().equals(id)) {
   throw new RuntimeException("Já existe uma unidade de medida com esse nome.");
  }

  unidade.setNome(dto.nome());
  unidade.setSigua(dto.sigua());

  repositoryUnidadeMedida.save(unidade);

  return MapperUnidadeMedida.toDTOUnidadeMedida(unidade);
 }

 @Transactional
 public void deleteUnidadeMedida(Long id) {

  ModelTbUnidadeMedida unidade = repositoryUnidadeMedida.findById(id)
    .orElseThrow(() -> new RuntimeException("Unidade de medida não encontrada."));

  repositoryUnidadeMedida.delete(unidade);
 }
}