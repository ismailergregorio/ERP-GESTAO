package com.devteciot.dev_erp.Controller;

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

import com.devteciot.dev_erp.DTO.DTOEntrada.EntradaGetDTO;
import com.devteciot.dev_erp.DTO.DTOEntrada.EntradaPostDTO;
import com.devteciot.dev_erp.Service.EntradaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/entradas")
@RequiredArgsConstructor
public class EntradaController {

 private final EntradaService service;

 // ============================================================
 // POST
 // ============================================================

 @PostMapping
 public ResponseEntity<EntradaGetDTO> criar(
   @Valid @RequestBody EntradaPostDTO dto) {

  EntradaGetDTO entrada = service.criar(dto);

  return ResponseEntity
    .status(HttpStatus.CREATED)
    .body(entrada);
 }

 // ============================================================
 // GET
 // ============================================================

 @GetMapping
 public ResponseEntity<List<EntradaGetDTO>> listar() {

  return ResponseEntity.ok(
    service.listar());
 }

 // ============================================================
 // GET POR ID
 // ============================================================

 @GetMapping("/{id}")
 public ResponseEntity<EntradaGetDTO> buscarPorId(
   @PathVariable Long id) {

  return ResponseEntity.ok(
    service.buscarPorId(id));
 }

 // ============================================================
 // GET POR TIPO
 // ============================================================

 @GetMapping("/tipo/{tipoEntradaId}")
 public ResponseEntity<List<EntradaGetDTO>> listarPorTipo(
   @PathVariable Long tipoEntradaId) {

  return ResponseEntity.ok(
    service.listarPorTipo(tipoEntradaId));
 }

 // ============================================================
 // GET POR NF
 // ============================================================

 @GetMapping("/nf/{nfId}")
 public ResponseEntity<List<EntradaGetDTO>> listarPorNF(
   @PathVariable Long nfId) {

  return ResponseEntity.ok(
    service.listarPorNF(nfId));
 }

 // ============================================================
 // PUT
 // ============================================================

 @PutMapping("/{id}")
 public ResponseEntity<EntradaGetDTO> atualizar(
   @PathVariable Long id,
   @Valid @RequestBody EntradaPostDTO dto) {

  return ResponseEntity.ok(
    service.atualizar(id, dto));
 }

 // ============================================================
 // DELETE
 // ============================================================

 @DeleteMapping("/{id}")
 public ResponseEntity<Void> excluir(
   @PathVariable Long id) {

  service.excluir(id);

  return ResponseEntity.noContent().build();
 }
}