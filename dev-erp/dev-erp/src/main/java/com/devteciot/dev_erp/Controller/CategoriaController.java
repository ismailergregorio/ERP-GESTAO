package com.devteciot.dev_erp.Controller;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.devteciot.dev_erp.DTO.DTOCategoria.CategoriaGetDTO;
import com.devteciot.dev_erp.DTO.DTOCategoria.CategoriaPostDTO;
import com.devteciot.dev_erp.Service.CategoriaService;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

 private final CategoriaService service;

 @PostMapping
 public ResponseEntity<CategoriaGetDTO> criar(
   @Valid @RequestBody CategoriaPostDTO dto) {

  return ResponseEntity
    .status(HttpStatus.CREATED)
    .body(service.criar(dto));
 }

 @GetMapping
 public ResponseEntity<List<CategoriaGetDTO>> listar() {

  return ResponseEntity.ok(
    service.listar());
 }

 @GetMapping("/{id}")
 public ResponseEntity<CategoriaGetDTO> buscarPorId(
   @PathVariable Long id) {

  return ResponseEntity.ok(
    service.buscarPorId(id));
 }

 @GetMapping("/ativas")
 public ResponseEntity<List<CategoriaGetDTO>> listarAtivas() {

  return ResponseEntity.ok(
    service.listarAtivas());
 }

 @PutMapping("/{id}")
 public ResponseEntity<CategoriaGetDTO> atualizar(
   @PathVariable Long id,
   @Valid @RequestBody CategoriaPostDTO dto) {

  return ResponseEntity.ok(
    service.atualizar(id, dto));
 }

 @DeleteMapping("/{id}")
 public ResponseEntity<Void> excluir(
   @PathVariable Long id) {

  service.excluir(id);

  return ResponseEntity.noContent().build();
 }
}