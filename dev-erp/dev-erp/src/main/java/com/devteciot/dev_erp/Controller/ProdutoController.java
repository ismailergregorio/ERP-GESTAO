package com.devteciot.dev_erp.Controller;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.devteciot.dev_erp.DTO.DTOProdutos.ProdutoGetDTO;
import com.devteciot.dev_erp.DTO.DTOProdutos.ProdutoPostDTO;
import com.devteciot.dev_erp.Service.ProdutoService;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

 private final ProdutoService service;

 /*
  * =====================================================
  * POST
  * =====================================================
  */

 @PostMapping
 public ResponseEntity<ProdutoGetDTO> criar(
   @Valid @RequestBody ProdutoPostDTO dto) {

  return ResponseEntity
    .status(HttpStatus.CREATED)
    .body(service.criar(dto));
 }

 /*
  * =====================================================
  * GET
  * =====================================================
  */

 @GetMapping
 public ResponseEntity<List<ProdutoGetDTO>> listar() {

  return ResponseEntity.ok(
    service.listar());
 }

 /*
  * =====================================================
  * GET ATIVOS
  * =====================================================
  */

 @GetMapping("/ativos")
 public ResponseEntity<List<ProdutoGetDTO>> listarAtivos() {

  return ResponseEntity.ok(
    service.listarAtivos());
 }

 /*
  * =====================================================
  * GET POR ID
  * =====================================================
  */

 @GetMapping("/{id}")
 public ResponseEntity<ProdutoGetDTO> buscarPorId(
   @PathVariable Long id) {

  return ResponseEntity.ok(
    service.buscarPorId(id));
 }

 /*
  * =====================================================
  * PUT
  * =====================================================
  */

 @PutMapping("/{id}")
 public ResponseEntity<ProdutoGetDTO> atualizar(
   @PathVariable Long id,

   @Valid @RequestBody ProdutoPostDTO dto) {

  return ResponseEntity.ok(
    service.atualizar(id, dto));
 }

 /*
  * =====================================================
  * DELETE
  * =====================================================
  */

 @DeleteMapping("/{id}")
 public ResponseEntity<Void> excluir(
   @PathVariable Long id) {

  service.excluir(id);

  return ResponseEntity.noContent().build();
 }
}
