package com.devteciot.dev_erp.Controller;

import com.devteciot.dev_erp.DTO.EntradaProduto.EntradaProdutoGetDTO;
import com.devteciot.dev_erp.DTO.EntradaProduto.EntradaProdutoPostDTO;
import com.devteciot.dev_erp.Service.EntradaProdutoService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entrada-produtos")
@RequiredArgsConstructor
public class EntradaProdutoController {

 private final EntradaProdutoService service;

 /*
  * =====================================================
  * CRIAR
  * =====================================================
  */

 @PostMapping
 public ResponseEntity<EntradaProdutoGetDTO> criar(
   @Valid @RequestBody EntradaProdutoPostDTO dto) {

  EntradaProdutoGetDTO resposta = service.criar(dto);

  return ResponseEntity
    .status(HttpStatus.CREATED)
    .body(resposta);
 }

 /*
  * =====================================================
  * LISTAR
  * =====================================================
  */

 @GetMapping
 public ResponseEntity<List<EntradaProdutoGetDTO>> listar() {

  return ResponseEntity.ok(
    service.listar());
 }

 /*
  * =====================================================
  * BUSCAR POR ID
  * =====================================================
  */

 @GetMapping("/{id}")
 public ResponseEntity<EntradaProdutoGetDTO> buscarPorId(
   @PathVariable Long id) {

  return ResponseEntity.ok(
    service.buscarPorId(id));
 }

 /*
  * =====================================================
  * LISTAR POR ENTRADA
  * =====================================================
  */

 @GetMapping("/entrada/{entradaId}")
 public ResponseEntity<List<EntradaProdutoGetDTO>> listarPorEntrada(
   @PathVariable Long entradaId) {

  return ResponseEntity.ok(
    service.listarPorEntrada(
      entradaId));
 }

 /*
  * =====================================================
  * LISTAR POR PRODUTO
  * =====================================================
  */

 @GetMapping("/produto/{produtoId}")
 public ResponseEntity<List<EntradaProdutoGetDTO>> listarPorProduto(
   @PathVariable Long produtoId) {

  return ResponseEntity.ok(
    service.listarPorProduto(
      produtoId));
 }

 /*
  * =====================================================
  * LISTAR POR PRODUTO DA NF
  * =====================================================
  */

 @GetMapping("/produto-nf/{produtoNFId}")
 public ResponseEntity<List<EntradaProdutoGetDTO>> listarPorProdutoNF(
   @PathVariable Long produtoNFId) {

  return ResponseEntity.ok(
    service.listarPorProdutoNF(
      produtoNFId));
 }

 /*
  * =====================================================
  * ATUALIZAR
  * =====================================================
  */

 @PutMapping("/{id}")
 public ResponseEntity<EntradaProdutoGetDTO> atualizar(
   @PathVariable Long id,
   @Valid @RequestBody EntradaProdutoPostDTO dto) {

  return ResponseEntity.ok(
    service.atualizar(
      id,
      dto));
 }

 /*
  * =====================================================
  * EXCLUIR
  * =====================================================
  */

 @DeleteMapping("/{id}")
 public ResponseEntity<Void> excluir(
   @PathVariable Long id) {

  service.excluir(id);

  return ResponseEntity.noContent().build();
 }
}