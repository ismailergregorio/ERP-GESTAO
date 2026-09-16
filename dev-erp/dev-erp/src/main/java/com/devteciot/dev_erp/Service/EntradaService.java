package com.devteciot.dev_erp.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devteciot.dev_erp.DTO.DTOEntrada.EntradaGetDTO;
import com.devteciot.dev_erp.DTO.DTOEntrada.EntradaPostDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.EntradaMapper;
import com.devteciot.dev_erp.Models.Entrada;
import com.devteciot.dev_erp.Models.NotaFiscal;
import com.devteciot.dev_erp.Models.TipoEntrada;
import com.devteciot.dev_erp.Repository.EntradaRepository;
import com.devteciot.dev_erp.Repository.NotaFiscalRepository;
import com.devteciot.dev_erp.Repository.TipoEntradaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EntradaService {

 private final EntradaRepository repository;
 private final TipoEntradaRepository tipoEntradaRepository;
 private final NotaFiscalRepository notaFiscalRepository;
 private final EntradaMapper mapper;

 // ============================================================
 // CRIAR
 // ============================================================

 public EntradaGetDTO criar(
   EntradaPostDTO dto) {

  TipoEntrada tipoEntrada = tipoEntradaRepository
    .findById(dto.tiposEntradaId())
    .orElseThrow(() -> new ResourceNotFoundException(
      "Tipo de entrada não encontrado com o ID: "
        + dto.tiposEntradaId()));

  NotaFiscal nf = null;

  if (dto.nfId() != null) {

   nf = notaFiscalRepository
     .findById(dto.nfId())
     .orElseThrow(() -> new ResourceNotFoundException(
       "Nota fiscal não encontrada com o ID: "
         + dto.nfId()));
  }

  Entrada entrada = mapper.toEntity(dto);

  entrada.setTipoEntrada(tipoEntrada);
  entrada.setNf(nf);

  Entrada salvo = repository.save(entrada);

  return mapper.toGetDTO(salvo);
 }

 // ============================================================
 // LISTAR
 // ============================================================

 public List<EntradaGetDTO> listar() {

  return repository.findAll()
    .stream()
    .map(mapper::toGetDTO)
    .toList();
 }

 // ============================================================
 // BUSCAR POR ID
 // ============================================================

 public EntradaGetDTO buscarPorId(
   Long id) {

  Entrada entrada = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Entrada não encontrada com o ID: " + id));

  return mapper.toGetDTO(entrada);
 }

 // ============================================================
 // LISTAR POR TIPO DE ENTRADA
 // ============================================================

 public List<EntradaGetDTO> listarPorTipo(
   Long tipoEntradaId) {

  if (!tipoEntradaRepository.existsById(tipoEntradaId)) {

   throw new ResourceNotFoundException(
     "Tipo de entrada não encontrado com o ID: "
       + tipoEntradaId);
  }

  return repository.findByTipoEntradaId(tipoEntradaId)
    .stream()
    .map(mapper::toGetDTO)
    .toList();
 }

 // ============================================================
 // LISTAR POR NOTA FISCAL
 // ============================================================

 public List<EntradaGetDTO> listarPorNF(
   Long nfId) {

  if (!notaFiscalRepository.existsById(nfId)) {

   throw new ResourceNotFoundException(
     "Nota fiscal não encontrada com o ID: "
       + nfId);
  }

  return repository.findByNfId(nfId)
    .stream()
    .map(mapper::toGetDTO)
    .toList();
 }

 // ============================================================
 // ATUALIZAR
 // ============================================================

 public EntradaGetDTO atualizar(
   Long id,
   EntradaPostDTO dto) {

  Entrada entrada = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Entrada não encontrada com o ID: " + id));

  TipoEntrada tipoEntrada = tipoEntradaRepository
    .findById(dto.tiposEntradaId())
    .orElseThrow(() -> new ResourceNotFoundException(
      "Tipo de entrada não encontrado com o ID: "
        + dto.tiposEntradaId()));

  NotaFiscal nf = null;

  if (dto.nfId() != null) {

   nf = notaFiscalRepository
     .findById(dto.nfId())
     .orElseThrow(() -> new ResourceNotFoundException(
       "Nota fiscal não encontrada com o ID: "
         + dto.nfId()));
  }

  mapper.updateEntity(entrada, dto);

  entrada.setTipoEntrada(tipoEntrada);
  entrada.setNf(nf);

  Entrada atualizado = repository.save(entrada);

  return mapper.toGetDTO(atualizado);
 }

 // ============================================================
 // EXCLUIR
 // ============================================================

 public void excluir(
   Long id) {

  Entrada entrada = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Entrada não encontrada com o ID: " + id));

  repository.delete(entrada);
 }
}
