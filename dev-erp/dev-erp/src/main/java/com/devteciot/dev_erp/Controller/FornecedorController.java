package com.devteciot.dev_erp.Controller;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.devteciot.dev_erp.DTO.DTOFornecedor.FornecedorGetDTO;
import com.devteciot.dev_erp.DTO.DTOFornecedor.FornecedorPostDTO;
import com.devteciot.dev_erp.Service.FornecedorService;

import java.util.List;

@RestController
@RequestMapping("/api/fornecedores")
@RequiredArgsConstructor
public class FornecedorController {

 private final FornecedorService service;

 /*
  * =====================================================
  * POST
  * =====================================================
  */

 @PostMapping
 public ResponseEntity<FornecedorGetDTO> criar(
   @Valid @RequestBody FornecedorPostDTO dto) {

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
 public ResponseEntity<List<FornecedorGetDTO>> listar() {

  return ResponseEntity.ok(
    service.listar());
 }

 /*
  * =====================================================
  * GET ATIVOS
  * =====================================================
  */

 @GetMapping("/ativos")
 public ResponseEntity<List<FornecedorGetDTO>> listarAtivos() {

  return ResponseEntity.ok(
    service.listarAtivos());
 }

 /*
  * =====================================================
  * GET POR ID
  * =====================================================
  */

 @GetMapping("/{id}")
 public ResponseEntity<FornecedorGetDTO> buscarPorId(
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
 public ResponseEntity<FornecedorGetDTO> atualizar(
   @PathVariable Long id,

   @Valid @RequestBody FornecedorPostDTO dto) {

  return ResponseEntity.ok(
    service.atualizar(id, dto));
 }

 /*
  * =====================================================
  * DELETE LÓGICO
  * =====================================================
  */

 @DeleteMapping("/{id}")
 public ResponseEntity<Void> excluir(
   @PathVariable Long id) {

  service.excluir(id);

  return ResponseEntity.noContent().build();
 }
}