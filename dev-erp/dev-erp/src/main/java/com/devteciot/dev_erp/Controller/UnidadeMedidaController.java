package com.devteciot.dev_erp.Controller;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.devteciot.dev_erp.DTO.DTOUnidadeMediada.UnidadeMedidaGetDTO;
import com.devteciot.dev_erp.DTO.DTOUnidadeMediada.UnidadeMedidaPostDTO;
import com.devteciot.dev_erp.Service.UnidadeMedidaService;

import java.util.List;

@RestController
@RequestMapping("/api/unidades-medida")
@RequiredArgsConstructor
public class UnidadeMedidaController {

 private final UnidadeMedidaService service;

 /*
  * =====================================================
  * POST
  * =====================================================
  */

 @PostMapping
 public ResponseEntity<UnidadeMedidaGetDTO> criar(
   @Valid @RequestBody UnidadeMedidaPostDTO dto) {

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
 public ResponseEntity<List<UnidadeMedidaGetDTO>> listar() {

  return ResponseEntity.ok(
    service.listar());
 }

 /*
  * =====================================================
  * GET POR ID
  * =====================================================
  */

 @GetMapping("/{id}")
 public ResponseEntity<UnidadeMedidaGetDTO> buscarPorId(
   @PathVariable Long id) {

  return ResponseEntity.ok(
    service.buscarPorId(id));
 }

 /*
  * =====================================================
  * GET ATIVAS
  * =====================================================
  */

 @GetMapping("/ativas")
 public ResponseEntity<List<UnidadeMedidaGetDTO>> listarAtivas() {

  return ResponseEntity.ok(
    service.listarAtivas());
 }

 /*
  * =====================================================
  * PUT
  * =====================================================
  */

 @PutMapping("/{id}")
 public ResponseEntity<UnidadeMedidaGetDTO> atualizar(
   @PathVariable Long id,

   @Valid @RequestBody UnidadeMedidaPostDTO dto) {

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
