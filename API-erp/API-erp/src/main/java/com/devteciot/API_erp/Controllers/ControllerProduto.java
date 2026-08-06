package com.devteciot.API_erp.Controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.devteciot.API_erp.DTO.DTOProdutos.DTOProdutosGet;
import com.devteciot.API_erp.DTO.DTOProdutos.DTOProdutosPost;
import com.devteciot.API_erp.Services.ServiceProduto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ControllerProduto {

    private final ServiceProduto serviceProduto;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DTOProdutosGet salvar(@Valid @RequestBody DTOProdutosPost dto) {
        return serviceProduto.saveProduto(dto);
    }

    @GetMapping
    public List<DTOProdutosGet> listar() {
        return serviceProduto.getListaProduto();
    }

    @GetMapping("/{id}")
    public DTOProdutosGet buscarPorId(@PathVariable Long id) {
        return serviceProduto.getProduto(id);
    }

    @GetMapping("/nome/{nome}")
    public DTOProdutosGet buscarPorNome(@PathVariable String nome) {
        return serviceProduto.getProdutoNome(nome);
    }

    @PutMapping("/{id}")
    public DTOProdutosGet atualizar(
            @PathVariable Long id,
            @Valid @RequestBody DTOProdutosPost dto) {

        return serviceProduto.updateProduto(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        serviceProduto.deleteProduto(id);
    }
}
