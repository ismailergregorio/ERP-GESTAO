package com.devteciot.dev_erp.Service;

import com.devteciot.dev_erp.DTO.DTONotaFiscal.NotaFiscalGetDTO;
import com.devteciot.dev_erp.DTO.DTONotaFiscal.NotaFiscalPostDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.NotaFiscalMapper;
import com.devteciot.dev_erp.Models.Entrada;
import com.devteciot.dev_erp.Models.Fornecedor;
import com.devteciot.dev_erp.Models.NotaFiscal;
import com.devteciot.dev_erp.Repository.EntradaRepository;
import com.devteciot.dev_erp.Repository.FornecedorRepository;
import com.devteciot.dev_erp.Repository.EntradaProdutoRepository;
import com.devteciot.dev_erp.Repository.NotaFiscalRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotaFiscalService {

    private final NotaFiscalRepository repository;
    private final FornecedorRepository fornecedorRepository;
    private final NotaFiscalMapper mapper;
    private final EntradaRepository entradaRepository;
    private final EntradaProdutoRepository entradaProdutoRepository;
    private final EntradaService entradaService;

    @Transactional
    public NotaFiscalGetDTO criar(NotaFiscalPostDTO dto) {

        if (repository.existsByChaveAcesso(dto.chaveAcesso())) {
            throw new IllegalArgumentException(
                    "Já existe uma nota fiscal cadastrada com esta chave de acesso.");
        }

        Fornecedor fornecedor = fornecedorRepository.findById(dto.fornecedorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Fornecedor não encontrado com o ID: " + dto.fornecedorId()));

        if (!Boolean.TRUE.equals(fornecedor.getAtivo())) {
            throw new IllegalArgumentException("O fornecedor informado está inativo.");
        }

        if (repository.existsByNumeroAndFornecedorId(dto.numero(), dto.fornecedorId())) {
            throw new IllegalArgumentException(
                    "Já existe uma nota fiscal com o número " + dto.numero()
                            + " para este fornecedor.");
        }

        NotaFiscal nf = mapper.toEntity(dto);
        nf.setFornecedor(fornecedor);
        nf.setNf_vinculada(false);
        nf.setAtivo(true);

        return mapper.toGetDTO(repository.save(nf));
    }

    public List<NotaFiscalGetDTO> listar() {
        return repository.findByAtivoTrueOrderByDataCriacaoDesc()
                .stream()
                .map(mapper::toGetDTO)
                .toList();
    }

    public NotaFiscalGetDTO buscarPorId(Long id) {
        NotaFiscal nf = buscarAtiva(id);
        return mapper.toGetDTO(nf);
    }

    public List<NotaFiscalGetDTO> listarPorFornecedor(Long fornecedorId) {
        fornecedorRepository.findById(fornecedorId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Fornecedor não encontrado com o ID: " + fornecedorId));

        return repository.findByFornecedorId(fornecedorId)
                .stream()
                .filter(nf -> Boolean.TRUE.equals(nf.getAtivo()))
                .map(mapper::toGetDTO)
                .toList();
    }

    @Transactional
    public NotaFiscalGetDTO atualizar(Long id, NotaFiscalPostDTO dto) {

        NotaFiscal nf = buscarAtiva(id);

        Fornecedor fornecedor = fornecedorRepository.findById(dto.fornecedorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Fornecedor não encontrado com o ID: " + dto.fornecedorId()));

        if (!Boolean.TRUE.equals(fornecedor.getAtivo())) {
            throw new IllegalArgumentException("O fornecedor informado está inativo.");
        }

        if (!nf.getChaveAcesso().equals(dto.chaveAcesso())
                && repository.existsByChaveAcesso(dto.chaveAcesso())) {
            throw new IllegalArgumentException(
                    "Já existe uma nota fiscal cadastrada com esta chave de acesso.");
        }

        boolean numeroAlterado = !nf.getNumero().equals(dto.numero());
        boolean fornecedorAlterado = !nf.getFornecedor().getId().equals(dto.fornecedorId());

        if ((numeroAlterado || fornecedorAlterado)
                && repository.existsByNumeroAndFornecedorId(dto.numero(), dto.fornecedorId())) {
            throw new IllegalArgumentException(
                    "Já existe uma nota fiscal com o número " + dto.numero()
                            + " para este fornecedor.");
        }

        mapper.updateEntity(nf, dto);
        nf.setFornecedor(fornecedor);

        return mapper.toGetDTO(repository.save(nf));
    }

    /**
     * Vincula uma NF já cadastrada a uma entrada já finalizada.
     *
     * Esta operação NÃO movimenta estoque. O estoque já foi alterado
     * quando a entrada foi finalizada.
     */
    @Transactional
    public NotaFiscalGetDTO vincularEntrada(Long nfId, Long entradaId) {

        NotaFiscal nf = buscarAtiva(nfId);

        List<Entrada> entradasDaNF =
                entradaRepository.findByNfIdAndAtivoTrue(nfId);

        if (!entradasDaNF.isEmpty()) {
            if (entradasDaNF.stream().anyMatch(e -> e.getId().equals(entradaId))) {
                return mapper.toGetDTO(nf);
            }

            throw new IllegalArgumentException(
                    "A nota fiscal já está vinculada a outra entrada ativa.");
        }

        Entrada entrada = entradaRepository.findByIdAndAtivoTrue(entradaId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Entrada não encontrada ou está inativa com o ID: " + entradaId));

        if (entrada.getNf() != null) {
            throw new IllegalArgumentException(
                    "A entrada já está vinculada a uma nota fiscal.");
        }

        if (entradaProdutoRepository.findByEntradaId(entradaId).isEmpty()) {
            throw new IllegalArgumentException(
                    "A entrada selecionada não possui produtos finalizados.");
        }

        entrada.setNf(nf);
        entrada.setNumeroNFManual(null);
        entradaRepository.save(entrada);

        nf.setNf_vinculada(true);
        repository.save(nf);

        return mapper.toGetDTO(nf);
    }

    /**
     * Desativa a NF e desfaz as entradas ativas vinculadas.
     * O estoque é revertido pelo EntradaService.
     */
    @Transactional
    public void excluir(Long id) {

        NotaFiscal nf = buscarAtiva(id);

        List<Entrada> entradas = entradaRepository.findByNfIdAndAtivoTrue(id);

        for (Entrada entrada : entradas) {
            entradaService.excluir(entrada.getId());
        }

        nf.setNf_vinculada(false);
        nf.setAtivo(false);

        repository.save(nf);
    }

    private NotaFiscal buscarAtiva(Long id) {
        NotaFiscal nf = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Nota fiscal não encontrada com o ID: " + id));

        if (!Boolean.TRUE.equals(nf.getAtivo())) {
            throw new ResourceNotFoundException(
                    "Nota fiscal não encontrada ou está inativa com o ID: " + id);
        }

        return nf;
    }
}
