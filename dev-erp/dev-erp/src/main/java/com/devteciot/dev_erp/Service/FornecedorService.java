package com.devteciot.dev_erp.Service;


import com.devteciot.dev_erp.DTO.DTOFornecedor.FornecedorGetDTO;
import com.devteciot.dev_erp.DTO.DTOFornecedor.FornecedorPostDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.FornecedorMapper;
import com.devteciot.dev_erp.Models.Fornecedor;
import com.devteciot.dev_erp.Repository.FornecedorRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FornecedorService {

 private final FornecedorRepository repository;

 private final FornecedorMapper mapper;

 /*
  * =====================================================
  * CRIAR
  * =====================================================
  */

 public FornecedorGetDTO criar(
   FornecedorPostDTO dto) {

  if (repository.existsByCnpj(dto.cnpj())) {

   throw new IllegalArgumentException(
     "Já existe um fornecedor cadastrado "
       + "com o CNPJ: "
       + dto.cnpj());
  }

  Fornecedor fornecedor = mapper.toEntity(dto);

  fornecedor.setAtivo(true);

  Fornecedor salvo = repository.save(fornecedor);

  return mapper.toGetDTO(salvo);
 }

 /*
  * =====================================================
  * LISTAR TODOS
  * =====================================================
  */

 public List<FornecedorGetDTO> listar() {

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

 public List<FornecedorGetDTO> listarAtivos() {

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

 public FornecedorGetDTO buscarPorId(
   Long id) {

  Fornecedor fornecedor = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Fornecedor não encontrado "
        + "com o ID: "
        + id));

  return mapper.toGetDTO(fornecedor);
 }

 /*
  * =====================================================
  * ATUALIZAR
  * =====================================================
  */

 public FornecedorGetDTO atualizar(
   Long id,
   FornecedorPostDTO dto) {

  Fornecedor fornecedor = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Fornecedor não encontrado "
        + "com o ID: "
        + id));

  mapper.updateEntity(
    fornecedor,
    dto);

  Fornecedor atualizado = repository.save(fornecedor);

  return mapper.toGetDTO(atualizado);
 }

 /*
  * =====================================================
  * EXCLUSÃO LÓGICA
  * =====================================================
  */

 public void excluir(
   Long id) {

  Fornecedor fornecedor = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Fornecedor não encontrado "
        + "com o ID: "
        + id));

  fornecedor.setAtivo(false);

  repository.save(fornecedor);
 }
}
