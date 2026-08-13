package com.devteciot.API_erp.Controllers.ControllerEntrada;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.devteciot.API_erp.DTO.DTOEntrada.DTOEntradaProduto.DTOEntrdaProdutoGet;
import com.devteciot.API_erp.DTO.DTOEntrada.DTOEntradaProduto.DTOEntrdaProdutoPost;
import com.devteciot.API_erp.Services.ServicesEntrada.ServiceEntradaProduto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/entrada-produtos")
@RequiredArgsConstructor
public class ControllerEntradaProduto {

    private final ServiceEntradaProduto serviceEntradaProduto;


    /*
     * =====================================================
     * POST - SALVAR UM PRODUTO
     * =====================================================
     */

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DTOEntrdaProdutoGet salvar(
            @Valid @RequestBody DTOEntrdaProdutoPost dto) {

        return serviceEntradaProduto
                .saveEntradaProduto(dto);
    }


    /*
     * =====================================================
     * POST - SALVAR LISTA DE PRODUTOS
     * =====================================================
     */

    @PostMapping("/lista")
    @ResponseStatus(HttpStatus.CREATED)
    public List<DTOEntrdaProdutoGet> salvarLista(
            @Valid @RequestBody List<DTOEntrdaProdutoPost> dtos) {

        return serviceEntradaProduto
                .postListaProdutos(dtos);
    }


    /*
     * =====================================================
     * GET - LISTAR TODOS OS PRODUTOS
     * =====================================================
     */

    @GetMapping
    public List<DTOEntrdaProdutoGet> listar() {

        return serviceEntradaProduto
                .getListaEntradaProduto();
    }


    /*
     * =====================================================
     * GET - BUSCAR PRODUTO PELO ID
     * =====================================================
     */

    @GetMapping("/{id}")
    public DTOEntrdaProdutoGet buscar(
            @PathVariable Long id) {

        return serviceEntradaProduto
                .getEntradaProduto(id);
    }


    /*
     * =====================================================
     * GET - LISTAR PRODUTOS DE UMA ENTRADA
     * =====================================================
     */

    @GetMapping("/entrada/{entradaId}")
    public List<DTOEntrdaProdutoGet> listarPorEntrada(
            @PathVariable Long entradaId) {

        return serviceEntradaProduto
                .getProdutosPorEntrada(entradaId);
    }


    /*
     * =====================================================
     * PUT - ATUALIZAR
     * =====================================================
     */

    @PutMapping("/{id}")
    public DTOEntrdaProdutoGet atualizar(
            @PathVariable Long id,
            @Valid @RequestBody DTOEntrdaProdutoPost dto) {

        return serviceEntradaProduto
                .updateEntradaProduto(
                        id,
                        dto
                );
    }


    /*
     * =====================================================
     * DELETE - EXCLUIR
     * =====================================================
     */

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(
            @PathVariable Long id) {

        serviceEntradaProduto
                .deleteEntradaProduto(id);
    }

}