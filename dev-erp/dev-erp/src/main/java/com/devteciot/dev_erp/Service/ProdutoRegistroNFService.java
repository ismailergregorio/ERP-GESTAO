package com.devteciot.dev_erp.Service;

import com.devteciot.dev_erp.DTO.ProdutoRegistroNF.ProdutoRegistroNFGetDTO;
import com.devteciot.dev_erp.DTO.ProdutoRegistroNF.ProdutoRegistroNFPostDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.ProdutoRegistroNFMapper;
import com.devteciot.dev_erp.Models.NotaFiscal;
import com.devteciot.dev_erp.Models.ProdutoRegistroNF;
import com.devteciot.dev_erp.Repository.NotaFiscalRepository;
import com.devteciot.dev_erp.Repository.ProdutoRegistroNFRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoRegistroNFService {

 private final ProdutoRegistroNFRepository repository;

 private final NotaFiscalRepository notaFiscalRepository;

 private final ProdutoRegistroNFMapper mapper;

 /*
  * =====================================================
  * CRIAR
  * =====================================================
  */

 public ProdutoRegistroNFGetDTO criar(
   ProdutoRegistroNFPostDTO dto) {

  /*
   * ================================================
   * VERIFICAR NF
   * ================================================
   */

  NotaFiscal nf = notaFiscalRepository.findById(
    dto.nfId()).orElseThrow(
      () -> new ResourceNotFoundException(
        "Nota fiscal não encontrada "
          + "com o ID: "
          + dto.nfId()));

  /*
   * ================================================
   * CRIAR PRODUTO
   * ================================================
   */

  ProdutoRegistroNF produto = mapper.toEntity(dto);

  /*
   * ================================================
   * RELACIONAR COM A NF
   * ================================================
   */

  produto.setNf(nf);

  produto.setAtivo(true);

  /*
   * ================================================
   * SALVAR
   * ================================================
   */

  ProdutoRegistroNF salvo = repository.save(produto);

  return mapper.toGetDTO(salvo);
 }

 /*
  * =====================================================
  * LISTAR
  * =====================================================
  */

 public List<ProdutoRegistroNFGetDTO> listar() {

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

 public List<ProdutoRegistroNFGetDTO> listarAtivos() {

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

 public ProdutoRegistroNFGetDTO buscarPorId(
   Long id) {

  ProdutoRegistroNF produto = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Produto da NF não encontrado "
        + "com o ID: "
        + id));

  return mapper.toGetDTO(produto);
 }

 /*
  * =====================================================
  * LISTAR POR NF
  * =====================================================
  */

 public List<ProdutoRegistroNFGetDTO> listarPorNF(
   Long nfId) {

  /*
   * Verificar se NF existe
   */

  notaFiscalRepository.findById(
    nfId).orElseThrow(
      () -> new ResourceNotFoundException(
        "Nota fiscal não encontrada "
          + "com o ID: "
          + nfId));

  return repository
    .findByNfId(nfId)
    .stream()
    .map(mapper::toGetDTO)
    .toList();
 }

 /*
  * =====================================================
  * ATUALIZAR
  * =====================================================
  */

 public ProdutoRegistroNFGetDTO atualizar(
   Long id,
   ProdutoRegistroNFPostDTO dto) {

  ProdutoRegistroNF produto = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Produto da NF não encontrado "
        + "com o ID: "
        + id));

  /*
   * ================================================
   * VERIFICAR NF
   * ================================================
   */

  NotaFiscal nf = notaFiscalRepository.findById(
    dto.nfId()).orElseThrow(
      () -> new ResourceNotFoundException(
        "Nota fiscal não encontrada "
          + "com o ID: "
          + dto.nfId()));

  /*
   * ================================================
   * ATUALIZAR
   * ================================================
   */

  mapper.updateEntity(
    produto,
    dto);

  produto.setNf(nf);

  ProdutoRegistroNF atualizado = repository.save(produto);

  return mapper.toGetDTO(
    atualizado);
 }

 /*
  * =====================================================
  * EXCLUSÃO LÓGICA
  * =====================================================
  */

 public void excluir(
   Long id) {

  ProdutoRegistroNF produto = repository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException(
      "Produto da NF não encontrado "
        + "com o ID: "
        + id));

  produto.setAtivo(false);

  repository.save(produto);
 }
}