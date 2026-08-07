package com.devteciot.API_erp.Services.ServicesSaida;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.devteciot.API_erp.DTO.DTOSaida.DTOTipoSaida.DTOTipoSaidaGet;
import com.devteciot.API_erp.DTO.DTOSaida.DTOTipoSaida.DTOTipoSaidaPost;
import com.devteciot.API_erp.Mapper.MapperSaida.MapperTipoSaida;
import com.devteciot.API_erp.Models.ModelSaida.ModelTbTipoSaida;
import com.devteciot.API_erp.Repository.RepositoryTipoSaida;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceTipoSaida {

 private final RepositoryTipoSaida repositoryTipoSaida;

 @Transactional
 public DTOTipoSaidaGet saveTipoSaida(DTOTipoSaidaPost dto) {

  Optional<ModelTbTipoSaida> tipoSaida = repositoryTipoSaida.findByNome(dto.nome());

  if (tipoSaida.isPresent()) {
   throw new RuntimeException("Tipo de saída já cadastrado.");
  }

  ModelTbTipoSaida novoTipoSaida = new ModelTbTipoSaida();
  novoTipoSaida.setNome(dto.nome());

  repositoryTipoSaida.save(novoTipoSaida);

  return MapperTipoSaida.toDTOTipoSaida(novoTipoSaida);
 }

 public List<DTOTipoSaidaGet> getListaTipoSaida() {

  return repositoryTipoSaida.findAll()
    .stream()
    .map(MapperTipoSaida::toDTOTipoSaida)
    .toList();
 }

 public DTOTipoSaidaGet getTipoSaida(Long id) {

  ModelTbTipoSaida tipoSaida = repositoryTipoSaida.findById(id)
    .orElseThrow(() -> new RuntimeException("Tipo de saída não encontrado."));

  return MapperTipoSaida.toDTOTipoSaida(tipoSaida);
 }

 public DTOTipoSaidaGet getTipoSaidaNome(String nome) {

  ModelTbTipoSaida tipoSaida = repositoryTipoSaida.findByNome(nome)
    .orElseThrow(() -> new RuntimeException("Tipo de saída não encontrado."));

  return MapperTipoSaida.toDTOTipoSaida(tipoSaida);
 }

 @Transactional
 public DTOTipoSaidaGet updateTipoSaida(Long id, DTOTipoSaidaPost dto) {

  ModelTbTipoSaida tipoSaida = repositoryTipoSaida.findById(id)
    .orElseThrow(() -> new RuntimeException("Tipo de saída não encontrado."));

  Optional<ModelTbTipoSaida> existente = repositoryTipoSaida.findByNome(dto.nome());

  if (existente.isPresent() && !existente.get().getId().equals(id)) {
   throw new RuntimeException("Já existe um tipo de saída com esse nome.");
  }

  tipoSaida.setNome(dto.nome());

  repositoryTipoSaida.save(tipoSaida);

  return MapperTipoSaida.toDTOTipoSaida(tipoSaida);
 }

 @Transactional
 public void deleteTipoSaida(Long id) {

  ModelTbTipoSaida tipoSaida = repositoryTipoSaida.findById(id)
    .orElseThrow(() -> new RuntimeException("Tipo de saída não encontrado."));

  repositoryTipoSaida.delete(tipoSaida);
 }
}
