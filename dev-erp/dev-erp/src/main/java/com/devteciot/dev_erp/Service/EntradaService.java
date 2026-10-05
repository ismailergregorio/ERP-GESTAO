package com.devteciot.dev_erp.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devteciot.dev_erp.DTO.DTOEntrada.EntradaGetDTO;
import com.devteciot.dev_erp.DTO.DTOEntrada.EntradaPostDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.EntradaMapper;
import com.devteciot.dev_erp.Models.Entrada;
import com.devteciot.dev_erp.Models.NotaFiscal;
import com.devteciot.dev_erp.Models.TipoEntrada;
import com.devteciot.dev_erp.Repository.EntradaProdutoRepository;
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
    private final EntradaProdutoRepository entradaProdutoRepository;
    private final EstoqueService estoqueService;

    // ============================================================
    // CRIAR
    // ============================================================

    @Transactional
    public EntradaGetDTO criar(EntradaPostDTO dto) {

        TipoEntrada tipoEntrada = tipoEntradaRepository
                .findById(dto.tiposEntradaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Tipo de entrada não encontrado com o ID: "
                                + dto.tiposEntradaId()
                ));

        NotaFiscal nf = null;

        if (dto.nfId() != null) {

            nf = notaFiscalRepository
                    .findById(dto.nfId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Nota fiscal não encontrada com o ID: "
                                    + dto.nfId()
                    ));
        }

        Entrada entrada = mapper.toEntity(dto);

        entrada.setTipoEntrada(tipoEntrada);
        entrada.setNf(nf);

        /*
         * Entrada com NF:
         * o número vem da própria NotaFiscal.
         *
         * Entrada sem NF:
         * pode possuir um número de NF informado manualmente.
         */
        entrada.setNumeroNFManual(
                nf == null ? dto.numeroNF() : null
        );

        /*
         * Toda entrada nova começa ativa.
         */
        entrada.setAtivo(true);

        /*
         * IMPORTANTE:
         *
         * Não atualizamos o estoque aqui.
         *
         * O estoque será atualizado quando os produtos
         * da entrada forem finalizados.
         */
        Entrada salvo = repository.save(entrada);

        return mapper.toGetDTO(salvo);
    }

    // ============================================================
    // LISTAR
    // ============================================================

    public List<EntradaGetDTO> listar() {

        return repository
                .findByAtivoTrueOrderByDataCriacaoDesc()
                .stream()
                .map(mapper::toGetDTO)
                .toList();
    }

    // ============================================================
    // BUSCAR POR ID
    // ============================================================

    public EntradaGetDTO buscarPorId(Long id) {

        Entrada entrada = buscarEntradaAtiva(id);

        return mapper.toGetDTO(entrada);
    }

    // ============================================================
    // LISTAR POR TIPO DE ENTRADA
    // ============================================================

    public List<EntradaGetDTO> listarPorTipo(Long tipoEntradaId) {

        if (!tipoEntradaRepository.existsById(tipoEntradaId)) {

            throw new ResourceNotFoundException(
                    "Tipo de entrada não encontrado com o ID: "
                            + tipoEntradaId
            );
        }

        return repository
                .findByTipoEntradaIdAndAtivoTrue(tipoEntradaId)
                .stream()
                .map(mapper::toGetDTO)
                .toList();
    }

    // ============================================================
    // LISTAR POR NOTA FISCAL
    // ============================================================

    public List<EntradaGetDTO> listarPorNF(Long nfId) {

        if (!notaFiscalRepository.existsById(nfId)) {

            throw new ResourceNotFoundException(
                    "Nota fiscal não encontrada com o ID: "
                            + nfId
            );
        }

        return repository
                .findByNfIdAndAtivoTrue(nfId)
                .stream()
                .map(mapper::toGetDTO)
                .toList();
    }

    // ============================================================
    // ATUALIZAR
    // ============================================================

    @Transactional
    public EntradaGetDTO atualizar(
            Long id,
            EntradaPostDTO dto
    ) {

        Entrada entrada = buscarEntradaAtiva(id);

        TipoEntrada tipoEntrada = tipoEntradaRepository
                .findById(dto.tiposEntradaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Tipo de entrada não encontrado com o ID: "
                                + dto.tiposEntradaId()
                ));

        NotaFiscal nf = null;

        if (dto.nfId() != null) {

            nf = notaFiscalRepository
                    .findById(dto.nfId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Nota fiscal não encontrada com o ID: "
                                    + dto.nfId()
                    ));
        }

        mapper.updateEntity(entrada, dto);

        entrada.setTipoEntrada(tipoEntrada);
        entrada.setNf(nf);

        entrada.setNumeroNFManual(
                nf == null ? dto.numeroNF() : null
        );

        Entrada atualizado = repository.save(entrada);

        return mapper.toGetDTO(atualizado);
    }

    // ============================================================
    // DESATIVAR
    // ============================================================

    @Transactional
    public void excluir(Long id) {

        Entrada entrada = buscarEntradaAtiva(id);

        /*
         * Busca os produtos vinculados à entrada.
         */
        var itens = entradaProdutoRepository
                .findByEntradaId(entrada.getId());

        /*
         * Desativação lógica.
         *
         * Não fazemos DELETE físico.
         */
        entrada.setAtivo(false);

        repository.save(entrada);

        /*
         * A entrada anteriormente adicionou os produtos
         * ao estoque.
         *
         * Ao desativá-la, precisamos desfazer essa entrada.
         */
        for (var item : itens) {

            if (item.getProduto() == null) {
                continue;
            }

            if (item.getQuantidadeItens() == null) {
                continue;
            }

            int quantidade;

            try {

                quantidade = item
                        .getQuantidadeItens()
                        .intValueExact();

            } catch (ArithmeticException e) {

                throw new IllegalStateException(
                        "A quantidade do produto "
                                + item.getProduto().getId()
                                + " não é um número inteiro válido."
                );
            }

            if (quantidade <= 0) {
                continue;
            }

            estoqueService.removerEntrada(
                    item.getProduto().getId(),
                    quantidade
            );
        }

        /*
         * Se a entrada possuía uma NF, a desativação desfaz
         * também o estado de vinculação da nota.
         */
        if (entrada.getNf() != null) {
            NotaFiscal nf = entrada.getNf();
            nf.setNf_vinculada(false);
            notaFiscalRepository.save(nf);
        }
    }

    // ============================================================
    // BUSCAR ENTRADA ATIVA
    // ============================================================

    private Entrada buscarEntradaAtiva(Long id) {

        List<Entrada> entradas =
                repository.findByIdAndAtivoTrue(id);

        if (entradas == null || entradas.isEmpty()) {

            throw new ResourceNotFoundException(
                    "Entrada não encontrada ou está inativa com o ID: "
                            + id
            );
        }

        /*
         * O ID da entrada é único.
         *
         * O repository atual retorna List, então usamos
         * o primeiro registro encontrado.
         */
        return entradas.get(0);
    }
}