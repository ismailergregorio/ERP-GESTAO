package com.devteciot.dev_erp.Controller;

import com.devteciot.dev_erp.DTO.NotaFiscalCompleta.NotaFiscalCompletaGetDTO;
import com.devteciot.dev_erp.DTO.NotaFiscalCompleta.NotaFiscalCompletaPostDTO;
import com.devteciot.dev_erp.Service.NotaFiscalCompletaService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/nf")
@RequiredArgsConstructor
public class NotaFiscalCompletaController {

 private final NotaFiscalCompletaService service;

 /*
  * =====================================================
  * CRIAR NF + PRODUTOS
  * =====================================================
  */

 @PostMapping("/completa")
 public ResponseEntity<NotaFiscalCompletaGetDTO> criar(
   @Valid @RequestBody NotaFiscalCompletaPostDTO dto) {

  NotaFiscalCompletaGetDTO resposta = service.criar(dto);

  return ResponseEntity
    .status(HttpStatus.CREATED)
    .body(resposta);
 }
}
