package com.devteciot.API_erp.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.devteciot.API_erp.DTO.DTOCentroCusto.DTOCentroCustoGet;
import com.devteciot.API_erp.DTO.DTOCentroCusto.DTOCentroCustoPost;
import com.devteciot.API_erp.Mapper.MapperCentroCusto;
import com.devteciot.API_erp.Models.ModelTbCentroCusto;
import com.devteciot.API_erp.Repository.RepositoryCentroCusto;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class ServiceCentroCusto {
 private final RepositoryCentroCusto repositoryCentroCusto;

 @Transactional
 public DTOCentroCustoGet saveCentroCusto(DTOCentroCustoPost dto) {

  Optional<ModelTbCentroCusto> centroCusto = repositoryCentroCusto.findByNome(dto.nome());

  if (centroCusto.isPresent()) {
   throw new RuntimeException("Centro de custo já cadastrado.");
  }

  ModelTbCentroCusto novoCentroCusto = new ModelTbCentroCusto();
  novoCentroCusto.setNome(dto.nome());

  repositoryCentroCusto.save(novoCentroCusto);

  return MapperCentroCusto.toDTOCentroCusto(novoCentroCusto);
 }

 public List<DTOCentroCustoGet> getListaCentroCusto() {

  return repositoryCentroCusto.findAll()
    .stream()
    .map(MapperCentroCusto::toDTOCentroCusto)
    .toList();
 }

 public DTOCentroCustoGet getCentroCusto(Long id) {

  ModelTbCentroCusto centroCusto = repositoryCentroCusto.findById(id)
    .orElseThrow(() -> new RuntimeException("Centro de custo não encontrado."));

  return MapperCentroCusto.toDTOCentroCusto(centroCusto);
 }

 @Transactional
 public DTOCentroCustoGet updateCentroCusto(Long id, DTOCentroCustoPost dto) {

  ModelTbCentroCusto centroCusto = repositoryCentroCusto.findById(id)
    .orElseThrow(() -> new RuntimeException("Centro de custo não encontrado."));

  Optional<ModelTbCentroCusto> existente = repositoryCentroCusto.findByNome(dto.nome());

  if (existente.isPresent() && !existente.get().getId().equals(id)) {
   throw new RuntimeException("Já existe um centro de custo com esse nome.");
  }

  centroCusto.setNome(dto.nome());

  repositoryCentroCusto.save(centroCusto);

  return MapperCentroCusto.toDTOCentroCusto(centroCusto);
 }

 @Transactional
 public void deleteCentroCusto(Long id) {

  ModelTbCentroCusto centroCusto = repositoryCentroCusto.findById(id)
    .orElseThrow(() -> new RuntimeException("Centro de custo não encontrado."));

  repositoryCentroCusto.delete(centroCusto);
 }
}
