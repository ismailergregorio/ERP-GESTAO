package com.devteciot.dev_erp.Controller;

import com.devteciot.dev_erp.DTO.EntradaProdutoFinalizacao.EntradaFinalizacaoGetDTO;
import com.devteciot.dev_erp.DTO.EntradaProdutoFinalizacao.EntradaFinalizacaoPostDTO;
import com.devteciot.dev_erp.Service.EntradaFinalizacaoService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/entradas")
@RequiredArgsConstructor
public class EntradaFinalizacaoController {

 private final EntradaFinalizacaoService service;

 /*
  * =====================================================
  * FINALIZAR ENTRADA
  * =====================================================
  */

 @PostMapping("/finalizar")
 public ResponseEntity<EntradaFinalizacaoGetDTO> finalizar(
   @Valid @RequestBody EntradaFinalizacaoPostDTO dto) {

  EntradaFinalizacaoGetDTO resposta = service.finalizar(dto);

  return ResponseEntity
    .status(HttpStatus.CREATED)
    .body(resposta);
 }
}