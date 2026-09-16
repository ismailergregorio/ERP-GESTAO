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

import com.devteciot.dev_erp.DTO.DTOTipoEntrada.TipoEntradaGetDTO;
import com.devteciot.dev_erp.DTO.DTOTipoEntrada.TipoEntradaPostDTO;
import com.devteciot.dev_erp.Service.TipoEntradaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tipos-entradas")
@RequiredArgsConstructor
public class TipoEntradaController {

 private final TipoEntradaService service;

 // ============================================================
 // POST
 // ============================================================

 @PostMapping
 public ResponseEntity<TipoEntradaGetDTO> criar(
   @Valid @RequestBody TipoEntradaPostDTO dto) {

  TipoEntradaGetDTO tipoEntrada = service.criar(dto);

  return ResponseEntity
    .status(HttpStatus.CREATED)
    .body(tipoEntrada);
 }

 // ============================================================
 // GET
 // ============================================================

 @GetMapping
 public ResponseEntity<List<TipoEntradaGetDTO>> listar() {

  return ResponseEntity.ok(service.listar());
 }

 // ============================================================
 // GET POR ID
 // ============================================================

 @GetMapping("/{id}")
 public ResponseEntity<TipoEntradaGetDTO> buscarPorId(
   @PathVariable Long id) {

  return ResponseEntity.ok(service.buscarPorId(id));
 }

 // ============================================================
 // PUT
 // ============================================================

 @PutMapping("/{id}")
 public ResponseEntity<TipoEntradaGetDTO> atualizar(
   @PathVariable Long id,
   @Valid @RequestBody TipoEntradaPostDTO dto) {

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
