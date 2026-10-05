package com.devteciot.dev_erp.Controller;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.devteciot.dev_erp.DTO.DTONotaFiscal.NotaFiscalGetDTO;
import com.devteciot.dev_erp.DTO.DTONotaFiscal.NotaFiscalPostDTO;
import com.devteciot.dev_erp.Service.NotaFiscalService;

import java.util.List;

@RestController
@RequestMapping("/api/nf")
@RequiredArgsConstructor
public class NotaFiscalController {

 private final NotaFiscalService service;

 /*
  * =====================================================
  * POST
  * =====================================================
  */

 @PostMapping
 public ResponseEntity<NotaFiscalGetDTO> criar(
   @Valid @RequestBody NotaFiscalPostDTO dto) {

  return ResponseEntity
    .status(HttpStatus.CREATED)
    .body(
      service.criar(dto));
 }

 /*
  * =====================================================
  * GET
  * =====================================================
  */

 @GetMapping
 public ResponseEntity<List<NotaFiscalGetDTO>> listar() {

  return ResponseEntity.ok(
    service.listar());
 }

 /*
  * =====================================================
  * GET POR ID
  * =====================================================
  */

 @GetMapping("/{id}")
 public ResponseEntity<NotaFiscalGetDTO> buscarPorId(
   @PathVariable Long id) {

  return ResponseEntity.ok(
    service.buscarPorId(id));
 }

 /*
  * =====================================================
  * GET POR FORNECEDOR
  * =====================================================
  */

 @GetMapping("/fornecedor/{fornecedorId}")
 public ResponseEntity<List<NotaFiscalGetDTO>> listarPorFornecedor(
   @PathVariable Long fornecedorId) {

  return ResponseEntity.ok(
    service.listarPorFornecedor(
      fornecedorId));
 }

 /*
  * =====================================================
  * PUT
  * =====================================================
  */

 @PutMapping("/{id}")
 public ResponseEntity<NotaFiscalGetDTO> atualizar(
   @PathVariable Long id,

   @Valid @RequestBody NotaFiscalPostDTO dto) {

  return ResponseEntity.ok(
    service.atualizar(
      id,
      dto));
 }



 @PostMapping("/{nfId}/vincular-entrada/{entradaId}")
 public ResponseEntity<NotaFiscalGetDTO> vincularEntrada(
   @PathVariable Long nfId,
   @PathVariable Long entradaId) {

  return ResponseEntity.ok(
    service.vincularEntrada(nfId, entradaId));
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