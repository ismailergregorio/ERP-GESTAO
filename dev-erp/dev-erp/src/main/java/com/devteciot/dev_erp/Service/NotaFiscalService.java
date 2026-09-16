package com.devteciot.dev_erp.Service;

import com.devteciot.dev_erp.DTO.DTONotaFiscal.NotaFiscalGetDTO;
import com.devteciot.dev_erp.DTO.DTONotaFiscal.NotaFiscalPostDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.NotaFiscalMapper;
import com.devteciot.dev_erp.Models.Fornecedor;
import com.devteciot.dev_erp.Models.NotaFiscal;
import com.devteciot.dev_erp.Repository.FornecedorRepository;
import com.devteciot.dev_erp.Repository.NotaFiscalRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotaFiscalService {

  private final NotaFiscalRepository repository;

  private final FornecedorRepository fornecedorRepository;

  private final NotaFiscalMapper mapper;

  /*
   * =====================================================
   * CRIAR
   * =====================================================
   */

  public NotaFiscalGetDTO criar(
      NotaFiscalPostDTO dto) {

    /*
     * ================================================
     * VERIFICAR CHAVE DE ACESSO
     * ================================================
     */

    if (repository.existsByChaveAcesso(
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
     * VERIFICAR SE FORNECEDOR ESTÁ ATIVO
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

    if (repository.existsByNumeroAndFornecedorId(
        dto.numero(),
        dto.fornecedorId())) {

      throw new IllegalArgumentException(
          "Já existe uma nota fiscal com o número "
              + dto.numero()
              + " para este fornecedor.");
    }

    /*
     * ================================================
     * CRIAR ENTIDADE
     * ================================================
     */

    NotaFiscal nf = mapper.toEntity(dto);

    /*
     * ================================================
     * ASSOCIAR FORNECEDOR
     * ================================================
     */

    nf.setFornecedor(
        fornecedor);

    /*
     * ================================================
     * SALVAR
     * ================================================
     */

    NotaFiscal salva = repository.save(nf);

    return mapper.toGetDTO(
        salva);
  }

  /*
   * =====================================================
   * LISTAR
   * =====================================================
   */

  public List<NotaFiscalGetDTO> listar() {

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

  public NotaFiscalGetDTO buscarPorId(
      Long id) {

    NotaFiscal nf = repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(
            "Nota fiscal não encontrada "
                + "com o ID: "
                + id));

    return mapper.toGetDTO(nf);
  }

  /*
   * =====================================================
   * LISTAR POR FORNECEDOR
   * =====================================================
   */

  public List<NotaFiscalGetDTO> listarPorFornecedor(
      Long fornecedorId) {

    /*
     * Verifica se o fornecedor existe
     */

    fornecedorRepository.findById(
        fornecedorId).orElseThrow(
            () -> new ResourceNotFoundException(
                "Fornecedor não encontrado "
                    + "com o ID: "
                    + fornecedorId));

    return repository
        .findByFornecedorId(
            fornecedorId)
        .stream()
        .map(mapper::toGetDTO)
        .toList();
  }

  /*
   * =====================================================
   * ATUALIZAR
   * =====================================================
   */

  public NotaFiscalGetDTO atualizar(
      Long id,
      NotaFiscalPostDTO dto) {

    NotaFiscal nf = repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(
            "Nota fiscal não encontrada "
                + "com o ID: "
                + id));

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
     * FORNECEDOR ATIVO
     * ================================================
     */

    if (!Boolean.TRUE.equals(
        fornecedor.getAtivo())) {

      throw new IllegalArgumentException(
          "O fornecedor informado está inativo.");
    }

    /*
     * ================================================
     * VERIFICAR CHAVE
     * ================================================
     */

    if (!nf.getChaveAcesso().equals(
        dto.chaveAcesso())) {

      if (repository.existsByChaveAcesso(
          dto.chaveAcesso())) {

        throw new IllegalArgumentException(
            "Já existe uma nota fiscal cadastrada "
                + "com esta chave de acesso.");
      }
    }

    /*
     * ================================================
     * VERIFICAR NÚMERO + FORNECEDOR
     * ================================================
     * 
     * O próprio registro não deve ser considerado.
     */

    boolean numeroAlterado = !nf.getNumero().equals(
        dto.numero());

    boolean fornecedorAlterado = !nf.getFornecedor().getId().equals(
        dto.fornecedorId());

    if (numeroAlterado || fornecedorAlterado) {

      if (repository.existsByNumeroAndFornecedorId(
          dto.numero(),
          dto.fornecedorId())) {

        throw new IllegalArgumentException(
            "Já existe uma nota fiscal com o número "
                + dto.numero()
                + " para este fornecedor.");
      }
    }

    /*
     * ================================================
     * ATUALIZAR
     * ================================================
     */

    mapper.updateEntity(
        nf,
        dto);

    nf.setFornecedor(
        fornecedor);

    NotaFiscal atualizada = repository.save(nf);

    return mapper.toGetDTO(
        atualizada);
  }

  /*
   * =====================================================
   * EXCLUIR
   * =====================================================
   */

  public void excluir(
      Long id) {

    NotaFiscal nf = repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(
            "Nota fiscal não encontrada "
                + "com o ID: "
                + id));

    repository.delete(nf);
  }
}