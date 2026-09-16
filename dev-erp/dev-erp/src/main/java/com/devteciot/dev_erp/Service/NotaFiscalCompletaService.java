package com.devteciot.dev_erp.Service;

import com.devteciot.dev_erp.DTO.DTONotaFiscal.NotaFiscalGetDTO;
import com.devteciot.dev_erp.DTO.DTONotaFiscal.NotaFiscalPostDTO;
import com.devteciot.dev_erp.DTO.NotaFiscalCompleta.NotaFiscalCompletaGetDTO;
import com.devteciot.dev_erp.DTO.NotaFiscalCompleta.NotaFiscalCompletaPostDTO;
import com.devteciot.dev_erp.DTO.ProdutoRegistroNF.ProdutoRegistroNFGetDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.NotaFiscalMapper;
import com.devteciot.dev_erp.Mapper.ProdutoRegistroNFMapper;
import com.devteciot.dev_erp.Models.Fornecedor;
import com.devteciot.dev_erp.Models.NotaFiscal;
import com.devteciot.dev_erp.Models.ProdutoRegistroNF;
import com.devteciot.dev_erp.Repository.FornecedorRepository;
import com.devteciot.dev_erp.Repository.NotaFiscalRepository;
import com.devteciot.dev_erp.Repository.ProdutoRegistroNFRepository;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotaFiscalCompletaService {

 private final NotaFiscalRepository notaFiscalRepository;

 private final ProdutoRegistroNFRepository produtoRegistroNFRepository;

 private final FornecedorRepository fornecedorRepository;

 private final NotaFiscalMapper notaFiscalMapper;

 private final ProdutoRegistroNFMapper produtoRegistroNFMapper;

 /*
  * =====================================================
  * CRIAR NF + PRODUTOS
  * =====================================================
  */

 @Transactional
 public NotaFiscalCompletaGetDTO criar(
   NotaFiscalCompletaPostDTO dto) {

  /*
   * ================================================
   * VERIFICAR CHAVE DE ACESSO
   * ================================================
   */

  if (notaFiscalRepository.existsByChaveAcesso(
    dto.chaveAcesso())) {

   throw new IllegalArgumentException(
     "Já existe uma nota fiscal cadastrada "
       + "com esta chave de acesso.");
  }

  /*
   * ================================================
   * VERIFICAR FORNECEDOR
   * ================================================
   */

  Fornecedor fornecedor = fornecedorRepository.findById(
    dto.fornecedorId()).orElseThrow(
      () -> new ResourceNotFoundException(
        "Fornecedor não encontrado "
          + "com o ID: "
          + dto.fornecedorId()));

  /*
   * ================================================
   * VERIFICAR FORNECEDOR ATIVO
   * ================================================
   */

  if (!Boolean.TRUE.equals(
    fornecedor.getAtivo())) {

   throw new IllegalArgumentException(
     "O fornecedor informado está inativo.");
  }

  /*
   * ================================================
   * VERIFICAR NÚMERO DA NF
   * ================================================
   */

  if (notaFiscalRepository
    .existsByNumeroAndFornecedorId(
      dto.numero(),
      dto.fornecedorId())) {

   throw new IllegalArgumentException(
     "Já existe uma nota fiscal com o número "
       + dto.numero()
       + " para este fornecedor.");
  }

  /*
   * ================================================
   * CRIAR NF
   * ================================================
   */

  NotaFiscal nf = notaFiscalMapper.toEntity(
    new NotaFiscalPostDTO(
      dto.numero(),
      dto.fornecedorId(),
      dto.chaveAcesso()));

  /*
   * ================================================
   * ASSOCIAR FORNECEDOR
   * ================================================
   */

  nf.setFornecedor(fornecedor);

  /*
   * ================================================
   * SALVAR NF
   * ================================================
   */

  NotaFiscal nfSalva = notaFiscalRepository.save(nf);

  /*
   * ================================================
   * SALVAR PRODUTOS
   * ================================================
   */

  for (var produtoDTO : dto.produtos()) {

   ProdutoRegistroNF produto = produtoRegistroNFMapper.toEntity(
     produtoDTO);

   /*
    * Associar produto à NF
    */

   produto.setNf(nfSalva);

   /*
    * Produto começa ativo
    */

   produto.setAtivo(true);

   /*
    * Salvar produto
    */

   produtoRegistroNFRepository.save(
     produto);
  }

  /*
   * ================================================
   * BUSCAR PRODUTOS SALVOS
   * ================================================
   */

  List<ProdutoRegistroNFGetDTO> produtos = produtoRegistroNFRepository
    .findByNfId(nfSalva.getId())
    .stream()
    .map(produtoRegistroNFMapper::toGetDTO)
    .toList();

  /*
   * ================================================
   * RETORNAR NF COMPLETA
   * ================================================
   */

  return new NotaFiscalCompletaGetDTO(

    nfSalva.getId(),

    nfSalva.getNumero(),

    fornecedor.getId(),

    fornecedor.getRazaoSocial(),

    fornecedor.getNomeFantasia(),

    nfSalva.getChaveAcesso(),

    nfSalva.getDataCriacao(),

    nfSalva.getDataUpdate(),

    produtos);
 }
}
