package com.devteciot.API_erp.Services.SerivicesProduto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devteciot.API_erp.DTO.DTOProdutos.DTOProdutoNfGet;
import com.devteciot.API_erp.DTO.DTOProdutos.DTOProdutoNfPost;
import com.devteciot.API_erp.Mapper.MapperProduto.ProdutoNfMapper;
import com.devteciot.API_erp.Models.ModelNf.ModelNF;
import com.devteciot.API_erp.Models.ModelProdutos.ModelTbProdutos;
import com.devteciot.API_erp.Models.ModelProdutos.ModelTbProdutosNf;
import com.devteciot.API_erp.Repository.RepositoryNF;
import com.devteciot.API_erp.Repository.RepositoryProduto;
import com.devteciot.API_erp.Repository.RepositoryProdutosNf;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceTbProdutosNf {

        private final RepositoryProdutosNf repository;
        private final RepositoryNF repositoryNf;
        private final RepositoryProduto repositoryProdutos;
        private final ProdutoNfMapper mapper;

        /**
         * Salva uma lista de produtos vinculados a uma NF.
         *
         * O produtoRelacionado é opcional.
         */
        @Transactional
        public List<DTOProdutoNfGet> salvarProdutos(
                        Long nfId,
                        List<DTOProdutoNfPost> produtos) {

                if (nfId == null) {
                        throw new IllegalArgumentException(
                                        "O ID da NF é obrigatório.");
                }

                if (produtos == null || produtos.isEmpty()) {
                        throw new IllegalArgumentException(
                                        "A lista de produtos não pode estar vazia.");
                }

                ModelNF nf = repositoryNf.findById(nfId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Nota fiscal não encontrada: " + nfId));

                List<ModelTbProdutosNf> produtosSalvos = new ArrayList<>();

                LocalDateTime agora = LocalDateTime.now();

                for (DTOProdutoNfPost dto : produtos) {

                        if (dto == null) {
                                continue;
                        }

                        ModelTbProdutos produtoRelacionado = null;

                        /*
                         * O produto relacionado é opcional.
                         */
                        if (dto.produtoRelacionadoId() != null) {

                                produtoRelacionado = repositoryProdutos
                                                .findById(dto.produtoRelacionadoId())
                                                .orElseThrow(() -> new RuntimeException(
                                                                "Produto relacionado não encontrado: "
                                                                                + dto.produtoRelacionadoId()));
                        }

                        /*
                         * Converte o DTO para entidade.
                         */
                        ModelTbProdutosNf produto = mapper.toEntity(
                                        dto,
                                        nf,
                                        produtoRelacionado);

                        /*
                         * Datas controladas pelo serviço.
                         */
                        produto.setDataCriacao(agora);
                        produto.setDataAtualizacao(agora);

                        produtosSalvos.add(produto);
                }

                if (produtosSalvos.isEmpty()) {
                        throw new IllegalArgumentException(
                                        "Nenhum produto válido foi informado.");
                }

                /*
                 * Salva no banco.
                 */
                List<ModelTbProdutosNf> salvos = repository.saveAll(produtosSalvos);

                /*
                 * Converte as entidades para DTO de resposta.
                 */
                return salvos.stream()
                                .map(mapper::toResponseDTO)
                                .toList();
        }

        /**
         * Busca todos os produtos de uma NF.
         */
        @Transactional(readOnly = true)
        public List<DTOProdutoNfGet> buscarPorNf(Long nfId) {

                if (nfId == null) {
                        throw new IllegalArgumentException(
                                        "O ID da NF é obrigatório.");
                }

                return repository.findByNfId(nfId)
                                .stream()
                                .map(mapper::toResponseDTO)
                                .toList();
        }

        /**
         * Busca um produto pelo ID.
         */
        @Transactional(readOnly = true)
        public DTOProdutoNfGet buscarPorId(Long id) {

                if (id == null) {
                        throw new IllegalArgumentException(
                                        "O ID do produto da NF é obrigatório.");
                }

                ModelTbProdutosNf produto = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Produto da NF não encontrado: "
                                                                + id));

                return mapper.toResponseDTO(produto);
        }

        /**
         * Atualiza um produto.
         *
         * O produtoRelacionado continua sendo opcional.
         */
        @Transactional
        public DTOProdutoNfGet atualizar(
                        Long id,
                        DTOProdutoNfPost dto) {

                if (id == null) {
                        throw new IllegalArgumentException(
                                        "O ID do produto da NF é obrigatório.");
                }

                ModelTbProdutosNf produto = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Produto da NF não encontrado: "
                                                                + id));

                /*
                 * Atualiza os dados simples.
                 */
                produto.setCodigo(dto.codigo());
                produto.setDescricao(dto.descricao());
                produto.setCodigoEAN(dto.codigoEAN());
                produto.setNcm(dto.ncm());
                produto.setCest(dto.cest());
                produto.setCfop(dto.cfop());
                produto.setUnidadeComercial(dto.unidadeComercial());
                produto.setUnidadeTributaria(dto.unidadeTributaria());

                produto.setQuantidade(dto.quantidade());
                produto.setQuantidadeTributaria(dto.quantidadeTributaria());
                produto.setValorUnitario(dto.valorUnitario());
                produto.setValorUnitarioTributario(
                                dto.valorUnitarioTributario());
                produto.setValorTotal(dto.valorTotal());

                /*
                 * Atualiza o produto relacionado.
                 *
                 * Se vier null, remove o relacionamento.
                 */
                if (dto.produtoRelacionadoId() != null) {

                        ModelTbProdutos produtoRelacionado = repositoryProdutos
                                        .findById(dto.produtoRelacionadoId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Produto relacionado não encontrado: "
                                                                        + dto.produtoRelacionadoId()));

                        produto.setProdutoRelacionado(produtoRelacionado);

                } else {

                        produto.setProdutoRelacionado(null);
                }

                produto.setDataAtualizacao(
                                LocalDateTime.now());

                ModelTbProdutosNf salvo = repository.save(produto);

                return mapper.toResponseDTO(salvo);
        }

        /**
         * Remove um produto.
         */
        @Transactional
        public void deletar(Long id) {

                if (id == null) {
                        throw new IllegalArgumentException(
                                        "O ID do produto da NF é obrigatório.");
                }

                if (!repository.existsById(id)) {
                        throw new RuntimeException(
                                        "Produto da NF não encontrado: " + id);
                }

                repository.deleteById(id);
        }

        /**
         * Remove todos os produtos de uma NF.
         */
        @Transactional
        public void deletarPorNf(Long nfId) {

                if (nfId == null) {
                        throw new IllegalArgumentException(
                                        "O ID da NF é obrigatório.");
                }

                List<ModelTbProdutosNf> produtos = repository.findByNfId(nfId);

                if (!produtos.isEmpty()) {
                        repository.deleteAll(produtos);
                }
        }
}