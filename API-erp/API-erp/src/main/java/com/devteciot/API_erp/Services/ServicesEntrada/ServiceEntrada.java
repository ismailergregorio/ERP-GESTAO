package com.devteciot.API_erp.Services.ServicesEntrada;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.devteciot.API_erp.Models.ModelEntrada.ModelTbEntrada;
import com.devteciot.API_erp.Models.ModelEntrada.ModelTbTipoEntrada;
import com.devteciot.API_erp.DTO.DTOEntrada.DTOEntrada.DTOEntradaGet;
import com.devteciot.API_erp.DTO.DTOEntrada.DTOEntrada.DTOEntradaPost;
import com.devteciot.API_erp.Mapper.MapperEntrada.MapperEntrada;
import com.devteciot.API_erp.Models.ModelTbFornecedores;
import com.devteciot.API_erp.Repository.RepositoryEntrada;
import com.devteciot.API_erp.Repository.RepositoryFornecedor;
import com.devteciot.API_erp.Repository.RepositoryTipoEntrada;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceEntrada {

 private final RepositoryEntrada repositoryEntrada;
 private final RepositoryFornecedor repositoryFornecedor;
 private final RepositoryTipoEntrada repositoryTipoEntrada;

 @Transactional
 public DTOEntradaGet saveEntrada(DTOEntradaPost dto) {

  ModelTbFornecedores fornecedor = repositoryFornecedor.findById(dto.fornecedor_id())
    .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado."));

  ModelTbTipoEntrada tipoEntrada = repositoryTipoEntrada.findById(dto.tipoEntrada_id())
    .orElseThrow(() -> new RuntimeException("Tipo de entrada não encontrado."));

  ModelTbEntrada entrada = new ModelTbEntrada();

  entrada.setNotaFiscal(dto.notaFiscal());
  entrada.setFornecedor(fornecedor);
  entrada.setTipoEntrada(tipoEntrada);
  entrada.setObservacao(dto.observacao());

  repositoryEntrada.save(entrada);

  return MapperEntrada.toDTOEntrada(entrada);
 }

 public List<DTOEntradaGet> getListaEntrada() {

  return repositoryEntrada.findAll()
    .stream()
    .map(MapperEntrada::toDTOEntrada)
    .toList();
 }

 public DTOEntradaGet getEntrada(Long id) {

  ModelTbEntrada entrada = repositoryEntrada.findById(id)
    .orElseThrow(() -> new RuntimeException("Entrada não encontrada."));

  return MapperEntrada.toDTOEntrada(entrada);
 }

 public DTOEntradaGet getEntradaNotaFiscal(Integer notaFiscal) {

  ModelTbEntrada entrada = repositoryEntrada.findByNotaFiscal(notaFiscal)
    .orElseThrow(() -> new RuntimeException("Entrada não encontrada."));

  return MapperEntrada.toDTOEntrada(entrada);
 }

 @Transactional
 public DTOEntradaGet updateEntrada(Long id, DTOEntradaPost dto) {

  ModelTbEntrada entrada = repositoryEntrada.findById(id)
    .orElseThrow(() -> new RuntimeException("Entrada não encontrada."));

  ModelTbFornecedores fornecedor = repositoryFornecedor.findById(dto.fornecedor_id())
    .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado."));

  ModelTbTipoEntrada tipoEntrada = repositoryTipoEntrada.findById(dto.tipoEntrada_id())
    .orElseThrow(() -> new RuntimeException("Tipo de entrada não encontrado."));

  entrada.setNotaFiscal(dto.notaFiscal());
  entrada.setFornecedor(fornecedor);
  entrada.setTipoEntrada(tipoEntrada);
  entrada.setObservacao(dto.observacao());

  repositoryEntrada.save(entrada);

  return MapperEntrada.toDTOEntrada(entrada);
 }

 @Transactional
 public void deleteEntrada(Long id) {

  ModelTbEntrada entrada = repositoryEntrada.findById(id)
    .orElseThrow(() -> new RuntimeException("Entrada não encontrada."));

  repositoryEntrada.delete(entrada);
 }

}