package com.devteciot.API_erp.Controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.devteciot.API_erp.DTO.DTOUnidadeMedida.DTOUnidadeMediddaGet;
import com.devteciot.API_erp.DTO.DTOUnidadeMedida.DTOUnidadeMediddaPost;
import com.devteciot.API_erp.Services.ServiceUnidadeMedida;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/unidades-medida")
@RequiredArgsConstructor
public class ControllerUnidadeMedida {

 private final ServiceUnidadeMedida serviceUnidadeMedida;

 @PostMapping
 @ResponseStatus(HttpStatus.CREATED)
 public DTOUnidadeMediddaGet salvar(@Valid @RequestBody DTOUnidadeMediddaPost dto) {
  return serviceUnidadeMedida.saveUnidadeMedida(dto);
 }

 @GetMapping
 public List<DTOUnidadeMediddaGet> listar() {
  return serviceUnidadeMedida.getListaUnidadeMedida();
 }

 @GetMapping("/{id}")
 public DTOUnidadeMediddaGet buscarPorId(@PathVariable Long id) {
  return serviceUnidadeMedida.getUnidadeMedida(id);
 }

 @GetMapping("/nome/{nome}")
 public DTOUnidadeMediddaGet buscarPorNome(@PathVariable String nome) {
  return serviceUnidadeMedida.getUnidadeMedidaNome(nome);
 }

 @PutMapping("/{id}")
 public DTOUnidadeMediddaGet atualizar(
   @PathVariable Long id,
   @Valid @RequestBody DTOUnidadeMediddaGet dto) {

  return serviceUnidadeMedida.updateUnidadeMedida(id, dto);
 }

 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void excluir(@PathVariable Long id) {
  serviceUnidadeMedida.deleteUnidadeMedida(id);
 }
}
