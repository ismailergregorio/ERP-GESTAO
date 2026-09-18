package com.devteciot.dev_erp.Service;

import com.devteciot.dev_erp.DTO.EntradaProduto.EntradaProdutoGetDTO;
import com.devteciot.dev_erp.DTO.EntradaProduto.EntradaProdutoPostDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.EntradaProdutoMapper;
import com.devteciot.dev_erp.Models.Entrada;
import com.devteciot.dev_erp.Models.EntradaProduto;
import com.devteciot.dev_erp.Models.Produto;
import com.devteciot.dev_erp.Models.ProdutoRegistroNF;
import com.devteciot.dev_erp.Repository.EntradaProdutoRepository;
import com.devteciot.dev_erp.Repository.EntradaRepository;
import com.devteciot.dev_erp.Repository.ProdutoRegistroNFRepository;
import com.devteciot.dev_erp.Repository.ProdutoRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EntradaProdutoService {

    private final EntradaProdutoRepository repository;

    private final EntradaRepository entradaRepository;

    private final ProdutoRepository produtoRepository;

    private final ProdutoRegistroNFRepository produtoNFRepository;

    private final EntradaProdutoMapper mapper;


    /*
     * =====================================================
     * CRIAR
     * =====================================================
     */

    public EntradaProdutoGetDTO criar(
            EntradaProdutoPostDTO dto) {

        /*
         * ================================================
         * VERIFICAR ENTRADA
         * ================================================
         */

        Entrada entrada = entradaRepository.findById(
                dto.entradaId()
        ).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Entrada não encontrada "
                                + "com o ID: "
                                + dto.entradaId()
                )
        );


        /*
         * ================================================
         * VERIFICAR PRODUTO
         * ================================================
         */

        Produto produto = produtoRepository.findById(
                dto.produtoId()
        ).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Produto não encontrado "
                                + "com o ID: "
                                + dto.produtoId()
                )
        );


        /*
         * ================================================
         * VERIFICAR PRODUTO DA NF
         * ================================================
         */

        ProdutoRegistroNF produtoNF =
                produtoNFRepository.findById(
                        dto.produtoNFId()
                ).orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Produto da NF não encontrado "
                                        + "com o ID: "
                                        + dto.produtoNFId()
                        )
                );


        /*
         * ================================================
         * CRIAR
         * ================================================
         */

        EntradaProduto entradaProduto =
                mapper.toEntity(dto);


        /*
         * ================================================
         * RELACIONAMENTOS
         * ================================================
         */

        entradaProduto.setEntrada(
                entrada
        );

        entradaProduto.setProduto(
                produto
        );

        entradaProduto.setProdutoNF(
                produtoNF
        );


        /*
         * ================================================
         * SALVAR
         * ================================================
         */

        EntradaProduto salvo =
                repository.save(
                        entradaProduto
                );


        return mapper.toGetDTO(
                salvo
        );
    }


    /*
     * =====================================================
     * LISTAR
     * =====================================================
     */

    public List<EntradaProdutoGetDTO> listar() {

        return repository.findAll()
                .stream()
                .map(item -> mapper.toGetDTO(item))
                .toList();
    }


    /*
     * =====================================================
     * BUSCAR POR ID
     * =====================================================
     */

    public EntradaProdutoGetDTO buscarPorId(
            Long id) {

        EntradaProduto entradaProduto =
                repository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Produto da entrada "
                                                + "não encontrado "
                                                + "com o ID: "
                                                + id
                                )
                        );

        return mapper.toGetDTO(
                entradaProduto
        );
    }


    /*
     * =====================================================
     * LISTAR POR ENTRADA
     * =====================================================
     */

    public List<EntradaProdutoGetDTO> listarPorEntrada(
            Long entradaId) {

        /*
         * Verificar se a entrada existe
         */

        entradaRepository.findById(
                entradaId
        ).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Entrada não encontrada "
                                + "com o ID: "
                                + entradaId
                )
        );


        return repository
                .findByEntradaId(entradaId)
                .stream()
                .map(item -> mapper.toGetDTO(item))
                .toList();
    }


    /*
     * =====================================================
     * LISTAR POR PRODUTO
     * =====================================================
     */

    public List<EntradaProdutoGetDTO> listarPorProduto(
            Long produtoId) {

        produtoRepository.findById(
                produtoId
        ).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Produto não encontrado "
                                + "com o ID: "
                                + produtoId
                )
        );


        return repository
                .findByProdutoId(produtoId)
                .stream()
                .map(item -> mapper.toGetDTO(item))
                .toList();
    }


    /*
     * =====================================================
     * LISTAR POR PRODUTO DA NF
     * =====================================================
     */

    public List<EntradaProdutoGetDTO> listarPorProdutoNF(
            Long produtoNFId) {

        produtoNFRepository.findById(
                produtoNFId
        ).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Produto da NF não encontrado "
                                + "com o ID: "
                                + produtoNFId
                )
        );


        return repository
                .findByProdutoNFId(produtoNFId)
                .stream()
                .map(item -> mapper.toGetDTO(item))
                .toList();
    }


    /*
     * =====================================================
     * ATUALIZAR
     * =====================================================
     */

    public EntradaProdutoGetDTO atualizar(
            Long id,
            EntradaProdutoPostDTO dto) {

        /*
         * ================================================
         * VERIFICAR REGISTRO
         * ================================================
         */

        EntradaProduto entradaProduto =
                repository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Produto da entrada "
                                                + "não encontrado "
                                                + "com o ID: "
                                                + id
                                )
                        );


        /*
         * ================================================
         * VERIFICAR ENTRADA
         * ================================================
         */

        Entrada entrada =
                entradaRepository.findById(
                        dto.entradaId()
                ).orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Entrada não encontrada "
                                        + "com o ID: "
                                        + dto.entradaId()
                        )
                );


        /*
         * ================================================
         * VERIFICAR PRODUTO
         * ================================================
         */

        Produto produto =
                produtoRepository.findById(
                        dto.produtoId()
                ).orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Produto não encontrado "
                                        + "com o ID: "
                                        + dto.produtoId()
                        )
                );


        /*
         * ================================================
         * VERIFICAR PRODUTO DA NF
         * ================================================
         */

        ProdutoRegistroNF produtoNF =
                produtoNFRepository.findById(
                        dto.produtoNFId()
                ).orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Produto da NF não encontrado "
                                        + "com o ID: "
                                        + dto.produtoNFId()
                        )
                );


        /*
         * ================================================
         * ATUALIZAR DADOS
         * ================================================
         */

        mapper.updateEntity(
                entradaProduto,
                dto
        );


        /*
         * ================================================
         * ATUALIZAR RELACIONAMENTOS
         * ================================================
         */

        entradaProduto.setEntrada(
                entrada
        );

        entradaProduto.setProduto(
                produto
        );

        entradaProduto.setProdutoNF(
                produtoNF
        );


        /*
         * ================================================
         * SALVAR
         * ================================================
         */

        EntradaProduto atualizado =
                repository.save(
                        entradaProduto
                );


        return mapper.toGetDTO(
                atualizado
        );
    }


    /*
     * =====================================================
     * EXCLUIR
     * =====================================================
     */

    public void excluir(
            Long id) {

        EntradaProduto entradaProduto =
                repository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Produto da entrada "
                                                + "não encontrado "
                                                + "com o ID: "
                                                + id
                                )
                        );

        repository.delete(
                entradaProduto
        );
    }
}