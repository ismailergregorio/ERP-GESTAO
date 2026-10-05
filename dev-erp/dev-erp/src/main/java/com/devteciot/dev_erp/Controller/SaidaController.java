package com.devteciot.dev_erp.Controller;

import com.devteciot.dev_erp.DTO.DTOSaida.SaidaGetDTO;
import com.devteciot.dev_erp.DTO.DTOSaida.SaidaPostDTO;
import com.devteciot.dev_erp.Service.SaidaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saidas")
@RequiredArgsConstructor
public class SaidaController {

 private final SaidaService service;

 @PostMapping
 public ResponseEntity<SaidaGetDTO> criar(
   @Valid @RequestBody SaidaPostDTO dto) {

  return ResponseEntity
    .status(HttpStatus.CREATED)
    .body(service.criar(dto));
 }

 @GetMapping
 public ResponseEntity<List<SaidaGetDTO>> listar() {
  return ResponseEntity.ok(service.listar());
 }

 @GetMapping("/{id}")
 public ResponseEntity<SaidaGetDTO> buscarPorId(
   @PathVariable Long id) {

  return ResponseEntity.ok(service.buscarPorId(id));
 }

 @PutMapping("/{id}")
 public ResponseEntity<SaidaGetDTO> atualizar(
   @PathVariable Long id,
   @Valid @RequestBody SaidaPostDTO dto) {

  return ResponseEntity.ok(service.atualizar(id, dto));
 }

 @DeleteMapping("/{id}")
 public ResponseEntity<Void> desativar(
   @PathVariable Long id) {

  service.desativar(id);
  return ResponseEntity.noContent().build();
 }
}
