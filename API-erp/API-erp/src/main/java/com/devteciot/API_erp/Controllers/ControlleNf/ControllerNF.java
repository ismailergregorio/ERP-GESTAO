package com.devteciot.API_erp.Controllers.ControlleNf;

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

import com.devteciot.API_erp.DTO.DTONf.DTONfGet;
import com.devteciot.API_erp.DTO.DTONf.DTONfPost;
import com.devteciot.API_erp.Services.ServicesNF.ServiceNF;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/nf")
@RequiredArgsConstructor
public class ControllerNF {

  private final ServiceNF serviceNF;

  /*
   * =====================================================
   * LISTAR TODAS AS NFs
   * =====================================================
   */

  @GetMapping
  public ResponseEntity<List<DTONfGet>> listar() {

    return ResponseEntity.ok(
        serviceNF.listar());
  }

  /*
   * =====================================================
   * BUSCAR NF POR ID
   * =====================================================
   */

  @GetMapping("/{id}")
  public ResponseEntity<DTONfGet> buscarPorId(
      @PathVariable Long id) {

    return ResponseEntity.ok(
        serviceNF.buscarPorId(id));
  }

  /*
   * =====================================================
   * BUSCAR POR NÚMERO DA NF
   * =====================================================
   */

  @GetMapping("/numero/{nNF}")
  public ResponseEntity<DTONfGet> buscarPorNumero(
      @PathVariable Integer nNF) {

    return ResponseEntity.ok(
        serviceNF.buscarPorNumero(nNF));
  }

  /*
   * =====================================================
   * SALVAR NF
   * =====================================================
   */

  @PostMapping
  public ResponseEntity<DTONfGet> salvar(
      @RequestBody DTONfPost dto) {

    DTONfGet novaNF = serviceNF.salvar(dto);

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(novaNF);
  }

  /*
   * =====================================================
   * ATUALIZAR NF
   * =====================================================
   */

  @PutMapping("/{id}")
  public ResponseEntity<DTONfGet> atualizar(
      @PathVariable Long id,
      @RequestBody DTONfPost dto) {

    return ResponseEntity.ok(
        serviceNF.atualizar(
            id,
            dto));
  }

  /*
   * =====================================================
   * DELETAR NF
   * =====================================================
   */

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletar(
      @PathVariable Long id) {

    serviceNF.deletar(id);

    return ResponseEntity
        .noContent()
        .build();
  }
}