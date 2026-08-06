package com.devteciot.API_erp.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.devteciot.API_erp.DTO.DTOFuncionario.DTOFuncionarioGet;
import com.devteciot.API_erp.DTO.DTOFuncionario.DTOFuncionarioPost;
import com.devteciot.API_erp.Mapper.MapperFuncionario;
import com.devteciot.API_erp.Models.ModelTbCentroCusto;
import com.devteciot.API_erp.Models.ModelTbFuncionario;
import com.devteciot.API_erp.Repository.RepositoryCentroCusto;
import com.devteciot.API_erp.Repository.RepositoryFuncionario;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceFuncionario {

 private final RepositoryFuncionario repositoryFuncionario;
 private final RepositoryCentroCusto repositoryCentroCusto;

 @Transactional
 public DTOFuncionarioGet saveFuncionario(DTOFuncionarioPost dto) {

  Optional<ModelTbFuncionario> funcionario = repositoryFuncionario.findByCpf(dto.cpf());

  if (funcionario.isPresent()) {
   throw new RuntimeException("Funcionário já cadastrado.");
  }

  ModelTbCentroCusto centroCusto = repositoryCentroCusto.findById(dto.centroCustoId())
    .orElseThrow(() -> new RuntimeException("Centro de custo não encontrado."));

  ModelTbFuncionario novoFuncionario = new ModelTbFuncionario();

  novoFuncionario.setNome(dto.nome());
  novoFuncionario.setCpf(dto.cpf());
  novoFuncionario.setCentroCusto_id(centroCusto);

  repositoryFuncionario.save(novoFuncionario);

  return MapperFuncionario.toDTOFuncionario(novoFuncionario);
 }

 public List<DTOFuncionarioGet> getListaFuncionario() {

  return repositoryFuncionario.findAll()
    .stream()
    .map(MapperFuncionario::toDTOFuncionario)
    .toList();
 }

 public DTOFuncionarioGet getFuncionario(Long id) {

  ModelTbFuncionario funcionario = repositoryFuncionario.findById(id)
    .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));

  return MapperFuncionario.toDTOFuncionario(funcionario);
 }

 public DTOFuncionarioGet getFuncionarioCpf(String cpf) {

  ModelTbFuncionario funcionario = repositoryFuncionario.findByCpf(cpf)
    .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));

  return MapperFuncionario.toDTOFuncionario(funcionario);
 }

 public DTOFuncionarioGet getFuncionarioNome(String nome) {

  ModelTbFuncionario funcionario = repositoryFuncionario.findByNome(nome)
    .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));

  return MapperFuncionario.toDTOFuncionario(funcionario);
 }

 @Transactional
 public DTOFuncionarioGet updateFuncionario(Long id, DTOFuncionarioPost dto) {

  ModelTbFuncionario funcionario = repositoryFuncionario.findById(id)
    .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));

  Optional<ModelTbFuncionario> funcionarioExistente = repositoryFuncionario.findByCpf(dto.cpf());

  if (funcionarioExistente.isPresent()
    && !funcionarioExistente.get().getId().equals(id)) {

   throw new RuntimeException("Já existe um funcionário com este CPF.");
  }

  ModelTbCentroCusto centroCusto = repositoryCentroCusto.findById(dto.centroCustoId())
    .orElseThrow(() -> new RuntimeException("Centro de custo não encontrado."));

  funcionario.setNome(dto.nome());
  funcionario.setCpf(dto.cpf());
  funcionario.setCentroCusto_id(centroCusto);

  repositoryFuncionario.save(funcionario);

  return MapperFuncionario.toDTOFuncionario(funcionario);
 }

 @Transactional
 public void deleteFuncionario(Long id) {

  ModelTbFuncionario funcionario = repositoryFuncionario.findById(id)
    .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));

  repositoryFuncionario.delete(funcionario);
 }
}
