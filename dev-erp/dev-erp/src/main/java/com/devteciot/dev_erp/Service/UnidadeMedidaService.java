package com.devteciot.dev_erp.Service;

import com.devteciot.dev_erp.DTO.DTOUnidadeMediada.UnidadeMedidaGetDTO;
import com.devteciot.dev_erp.DTO.DTOUnidadeMediada.UnidadeMedidaPostDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.UnidadeMedidaMapper;
import com.devteciot.dev_erp.Models.UnidadeMedida;
import com.devteciot.dev_erp.Repository.UnidadeMedidaRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnidadeMedidaService {

 private final UnidadeMedidaRepository repository;

 private final UnidadeMedidaMapper mapper;

 /*
  * =====================================================
  * CRIAR
  * =====================================================
  */

 public UnidadeMedidaGetDTO criar(
   UnidadeMedidaPostDTO dto) {

  if (repository.existsByNomeIgnoreCase(dto.nome())) {

   throw new IllegalArgumentException(
     "Já existe uma unidade de medida com o nome: "
       + dto.nome());
  }

  if (repository.existsBySiglaIgnoreCase(dto.sigla())) {

   throw new IllegalArgumentException(
     "Já existe uma unidade de medida com a sigla: "
       + dto.sigla());
  }

  UnidadeMedida unidade = mapper.toEntity(dto);

  UnidadeMedida salva = repository.save(unidade);

  return mapper.toGetDTO(salva);
 }

 /*
  * =====================================================
  * LISTAR
  * =====================================================
  */

 public List<UnidadeMedidaGetDTO> listar() {

  return repository.findAll()
    .stream()
    .map(mapper::toGetDTO)
    .toList();
 }

 /*
  * =====================================================
  * BUSCAR POR ID
  * =====================================================
  */

 public UnidadeMedidaGetDTO buscarPorId(
   Long id) {

  UnidadeMedida unidade = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Unidade de medida não encontrada "
        + "com o ID: " + id));

  return mapper.toGetDTO(unidade);
 }

 /*
  * =====================================================
  * LISTAR ATIVAS
  * =====================================================
  */

 public List<UnidadeMedidaGetDTO> listarAtivas() {

  return repository.findByAtivoTrue()
    .stream()
    .map(mapper::toGetDTO)
    .toList();
 }

 /*
  * =====================================================
  * ATUALIZAR
  * =====================================================
  */

 public UnidadeMedidaGetDTO atualizar(
   Long id,
   UnidadeMedidaPostDTO dto) {

  UnidadeMedida unidade = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Unidade de medida não encontrada "
        + "com o ID: " + id));

  mapper.updateEntity(unidade, dto);

  UnidadeMedida atualizada = repository.save(unidade);

  return mapper.toGetDTO(atualizada);
 }

 /*
  * =====================================================
  * EXCLUIR
  * =====================================================
  */

 public void excluir(Long id) {

  UnidadeMedida unidade = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Unidade de medida não encontrada "
        + "com o ID: " + id));

  unidade.setAtivo(false);

  repository.save(unidade);
 }
}
