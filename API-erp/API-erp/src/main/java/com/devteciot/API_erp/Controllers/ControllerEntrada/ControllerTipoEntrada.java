package com.devteciot.API_erp.Controllers.ControllerEntrada;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.devteciot.API_erp.DTO.DTOEntrada.DTOTipoEntrada.DTOTipoEntradaGet;
import com.devteciot.API_erp.DTO.DTOEntrada.DTOTipoEntrada.DTOTipoEntradaPost;
import com.devteciot.API_erp.Services.ServicesEntrada.ServiceTipoEntrada;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tipos-entrada")
@RequiredArgsConstructor
public class ControllerTipoEntrada {

 private final ServiceTipoEntrada serviceTipoEntrada;

 @PostMapping
 @ResponseStatus(HttpStatus.CREATED)
 public DTOTipoEntradaGet salvar(
   @Valid @RequestBody DTOTipoEntradaPost dto) {

  return serviceTipoEntrada.saveTipoEntrada(dto);
 }

 @GetMapping
 public List<DTOTipoEntradaGet> listar() {
  return serviceTipoEntrada.getListaTipoEntrada();
 }

 @GetMapping("/{id}")
 public DTOTipoEntradaGet buscarPorId(@PathVariable Long id) {
  return serviceTipoEntrada.getTipoEntrada(id);
 }

 @GetMapping("/nome/{nome}")
 public DTOTipoEntradaGet buscarPorNome(@PathVariable String nome) {
  return serviceTipoEntrada.getTipoEntradaNome(nome);
 }

 @PutMapping("/{id}")
 public DTOTipoEntradaGet atualizar(
   @PathVariable Long id,
   @Valid @RequestBody DTOTipoEntradaPost dto) {

  return serviceTipoEntrada.updateTipoEntrada(id, dto);
 }

 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void excluir(@PathVariable Long id) {
  serviceTipoEntrada.deleteTipoEntrada(id);
 }
}