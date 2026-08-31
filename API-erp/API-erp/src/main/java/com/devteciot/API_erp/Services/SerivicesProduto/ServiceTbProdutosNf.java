package com.devteciot.API_erp.Services.SerivicesProduto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devteciot.API_erp.Models.ModelNf.ModelNF;
import com.devteciot.API_erp.Models.ModelProdutos.ModelTbProdutosNf;
import com.devteciot.API_erp.Repository.RepositoryNF;
import com.devteciot.API_erp.Repository.RepositoryProdutosNf;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceTbProdutosNf {

    private final RepositoryProdutosNf repository;
    private final RepositoryNF repositoryNf;

    /**
     * Salva uma lista de produtos vinculados a uma NF.
     *
     * O produtoRelacionado é opcional.
     */
    @Transactional
    public List<ModelTbProdutosNf> salvarProdutos(
            Long nfId,
            List<ModelTbProdutosNf> produtos) {

        if (nfId == null) {
            throw new IllegalArgumentException(
                    "O ID da NF é obrigatório."
            );
        }

        if (produtos == null || produtos.isEmpty()) {
            throw new IllegalArgumentException(
                    "A lista de produtos não pode estar vazia."
            );
        }

        ModelNF nf = repositoryNf.findById(nfId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Nota fiscal não encontrada: " + nfId
                        )
                );

        List<ModelTbProdutosNf> produtosSalvos =
                new ArrayList<>();

        LocalDateTime agora = LocalDateTime.now();

        for (ModelTbProdutosNf produto : produtos) {

            if (produto == null) {
                continue;
            }

            /*
             * A NF é definida pelo serviço.
             */
            produto.setNf(nf);

            /*
             * produtoRelacionado NÃO é obrigatório.
             *
             * Se vier preenchido, será mantido.
             * Se vier null, o produto será salvo normalmente.
             */

            if (produto.getDataCriacao() == null) {
                produto.setDataCriacao(agora);
            }

            produto.setDataAtualizacao(agora);

            produtosSalvos.add(produto);
        }

        if (produtosSalvos.isEmpty()) {
            throw new IllegalArgumentException(
                    "Nenhum produto válido foi informado."
            );
        }

        return repository.saveAll(produtosSalvos);
    }

    /**
     * Busca todos os produtos de uma NF.
     */
    @Transactional(readOnly = true)
    public List<ModelTbProdutosNf> buscarPorNf(Long nfId) {

        if (nfId == null) {
            throw new IllegalArgumentException(
                    "O ID da NF é obrigatório."
            );
        }

        return repository.findByNfId(nfId);
    }

    /**
     * Busca um produto pelo ID.
     */
    @Transactional(readOnly = true)
    public ModelTbProdutosNf buscarPorId(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Produto da NF não encontrado: " + id
                        )
                );
    }

    /**
     * Atualiza um produto.
     *
     * O produtoRelacionado continua sendo opcional.
     */
    @Transactional
    public ModelTbProdutosNf atualizar(
            Long id,
            ModelTbProdutosNf produtoAtualizado) {

        ModelTbProdutosNf produto =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Produto da NF não encontrado: "
                                                + id
                                )
                        );

        produto.setCodigo(
                produtoAtualizado.getCodigo()
        );

        produto.setDescricao(
                produtoAtualizado.getDescricao()
        );

        produto.setCodigoEAN(
                produtoAtualizado.getCodigoEAN()
        );

        produto.setNcm(
                produtoAtualizado.getNcm()
        );

        produto.setCest(
                produtoAtualizado.getCest()
        );

        produto.setCfop(
                produtoAtualizado.getCfop()
        );

        produto.setUnidadeComercial(
                produtoAtualizado.getUnidadeComercial()
        );

        produto.setUnidadeTributaria(
                produtoAtualizado.getUnidadeTributaria()
        );

        produto.setQuantidade(
                produtoAtualizado.getQuantidade()
        );

        produto.setQuantidadeTributaria(
                produtoAtualizado.getQuantidadeTributaria()
        );

        produto.setValorUnitario(
                produtoAtualizado.getValorUnitario()
        );

        produto.setValorUnitarioTributario(
                produtoAtualizado
                        .getValorUnitarioTributario()
        );

        produto.setValorTotal(
                produtoAtualizado.getValorTotal()
        );

        /*
         * Pode ser null.
         */
        produto.setProdutoRelacionado(
                produtoAtualizado.getProdutoRelacionado()
        );

        produto.setDataAtualizacao(
                LocalDateTime.now()
        );

        return repository.save(produto);
    }

    /**
     * Remove um produto.
     */
    @Transactional
    public void deletar(Long id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException(
                    "Produto da NF não encontrado: " + id
            );
        }

        repository.deleteById(id);
    }

    /**
     * Remove todos os produtos de uma NF.
     */
    @Transactional
    public void deletarPorNf(Long nfId) {

        List<ModelTbProdutosNf> produtos =
                repository.findByNfId(nfId);

        if (!produtos.isEmpty()) {
            repository.deleteAll(produtos);
        }
    }
}