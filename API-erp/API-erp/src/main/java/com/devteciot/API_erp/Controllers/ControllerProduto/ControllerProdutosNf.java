package com.devteciot.API_erp.Controllers.ControllerProduto;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devteciot.API_erp.DTO.DTOProdutos.DTOProdutoNfGet;
import com.devteciot.API_erp.DTO.DTOProdutos.DTOProdutoNfPost;
import com.devteciot.API_erp.Services.SerivicesProduto.ServiceTbProdutosNf;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/produtos-nf")
@RequiredArgsConstructor
public class ControllerProdutosNf {

  private final ServiceTbProdutosNf service;

  /*
   * =====================================================
   * LISTAR PRODUTOS DE UMA NF
   * =====================================================
   */

  @GetMapping("/nf/{nfId}")
  public ResponseEntity<List<DTOProdutoNfGet>> buscarPorNf(
      @PathVariable Long nfId) {

    return ResponseEntity.ok(
        service.buscarPorNf(nfId));
  }

  /*
   * =====================================================
   * BUSCAR PRODUTO POR ID
   * =====================================================
   */

  @GetMapping("/{id}")
  public ResponseEntity<DTOProdutoNfGet> buscarPorId(
      @PathVariable Long id) {

    return ResponseEntity.ok(
        service.buscarPorId(id));
  }

  /*
   * =====================================================
   * SALVAR LISTA DE PRODUTOS
   * =====================================================
   */

  @PostMapping("/nf/{nfId}")
  public ResponseEntity<List<DTOProdutoNfGet>> salvarProdutos(
      @PathVariable Long nfId,
      @RequestBody List<DTOProdutoNfPost> produtos) {

    List<DTOProdutoNfGet> produtosSalvos = service.salvarProdutos(
        nfId,
        produtos);

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(produtosSalvos);
  }

  /*
   * =====================================================
   * ATUALIZAR PRODUTO
   * =====================================================
   */

  @PutMapping("/{id}")
  public ResponseEntity<DTOProdutoNfGet> atualizar(
      @PathVariable Long id,
      @RequestBody DTOProdutoNfPost produto) {

    return ResponseEntity.ok(
        service.atualizar(
            id,
            produto));
  }

  /*
   * =====================================================
   * DELETAR PRODUTO
   * =====================================================
   */

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletar(
      @PathVariable Long id) {

    service.deletar(id);

    return ResponseEntity
        .noContent()
        .build();
  }

  /*
   * =====================================================
   * DELETAR TODOS OS PRODUTOS DE UMA NF
   * =====================================================
   */

  @DeleteMapping("/nf/{nfId}")
  public ResponseEntity<Void> deletarPorNf(
      @PathVariable Long nfId) {

    service.deletarPorNf(nfId);

    return ResponseEntity
        .noContent()
        .build();
  }
}