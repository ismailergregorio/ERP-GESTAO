package com.devteciot.API_erp.Services.ServicesSaida;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devteciot.API_erp.Models.ModelSaida.ModelTbSaida;
import com.devteciot.API_erp.Models.ModelSaida.ModelTbTipoSaida;
import com.devteciot.API_erp.DTO.DTOSaida.DTOSaida.DTOSaidaGet;
import com.devteciot.API_erp.DTO.DTOSaida.DTOSaida.DTOSaidaPost;
import com.devteciot.API_erp.Mapper.MapperSaida.MapperSaida;
import com.devteciot.API_erp.Models.ModelTbFuncionario;
import com.devteciot.API_erp.Repository.RepositoryFuncionario;
import com.devteciot.API_erp.Repository.RepositorySaida;
import com.devteciot.API_erp.Repository.RepositoryTipoSaida;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceSaida {

 private final RepositorySaida repositorySaida;
 private final RepositoryFuncionario repositoryFuncionario;
 private final RepositoryTipoSaida repositoryTipoSaida;

 @Transactional
 public DTOSaidaGet saveSaida(DTOSaidaPost dto) {

  ModelTbFuncionario funcionario = repositoryFuncionario.findById(dto.funcionario_id())
    .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));

  ModelTbTipoSaida tipoSaida = repositoryTipoSaida.findById(dto.tipoSaida_id())
    .orElseThrow(() -> new RuntimeException("Tipo de saída não encontrado."));

  ModelTbSaida saida = new ModelTbSaida();

  saida.setFuncionario(funcionario);
  saida.setTipoSaida(tipoSaida);
  saida.setObservacao(dto.observacao());

  repositorySaida.save(saida);

  return MapperSaida.toDTOSaida(saida);
 }

 public List<DTOSaidaGet> getListaSaida() {

  return repositorySaida.findAll()
    .stream()
    .map(MapperSaida::toDTOSaida)
    .toList();
 }

 public DTOSaidaGet getSaida(Long id) {

  ModelTbSaida saida = repositorySaida.findById(id)
    .orElseThrow(() -> new RuntimeException("Saída não encontrada."));

  return MapperSaida.toDTOSaida(saida);
 }

 public List<DTOSaidaGet> getSaidasFuncionario(Long funcionarioId) {

  return repositorySaida.findByFuncionario(funcionarioId)
    .stream()
    .map(MapperSaida::toDTOSaida)
    .toList();
 }

 @Transactional
 public DTOSaidaGet updateSaida(Long id, DTOSaidaPost dto) {

  ModelTbSaida saida = repositorySaida.findById(id)
    .orElseThrow(() -> new RuntimeException("Saída não encontrada."));

  ModelTbFuncionario funcionario = repositoryFuncionario.findById(dto.funcionario_id())
    .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));

  ModelTbTipoSaida tipoSaida = repositoryTipoSaida.findById(dto.tipoSaida_id())
    .orElseThrow(() -> new RuntimeException("Tipo de saída não encontrado."));

  saida.setFuncionario(funcionario);
  saida.setTipoSaida(tipoSaida);
  saida.setObservacao(dto.observacao());

  repositorySaida.save(saida);

  return MapperSaida.toDTOSaida(saida);
 }

 @Transactional
 public void deleteSaida(Long id) {

  ModelTbSaida saida = repositorySaida.findById(id)
    .orElseThrow(() -> new RuntimeException("Saída não encontrada."));

  repositorySaida.delete(saida);
 }

}