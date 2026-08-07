package com.devteciot.API_erp.Controllers.ControllerSaida;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.devteciot.API_erp.DTO.DTOSaida.DTOTipoSaida.DTOTipoSaidaGet;
import com.devteciot.API_erp.DTO.DTOSaida.DTOTipoSaida.DTOTipoSaidaPost;
import com.devteciot.API_erp.Services.ServicesSaida.ServiceTipoSaida;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tipos-saida")
@RequiredArgsConstructor
public class ControllerTipoSaida {

 private final ServiceTipoSaida serviceTipoSaida;

 @PostMapping
 @ResponseStatus(HttpStatus.CREATED)
 public DTOTipoSaidaGet salvar(@Valid @RequestBody DTOTipoSaidaPost dto) {
  return serviceTipoSaida.saveTipoSaida(dto);
 }

 @GetMapping
 public List<DTOTipoSaidaGet> listar() {
  return serviceTipoSaida.getListaTipoSaida();
 }

 @GetMapping("/{id}")
 public DTOTipoSaidaGet buscarPorId(@PathVariable Long id) {
  return serviceTipoSaida.getTipoSaida(id);
 }

 @GetMapping("/nome/{nome}")
 public DTOTipoSaidaGet buscarPorNome(@PathVariable String nome) {
  return serviceTipoSaida.getTipoSaidaNome(nome);
 }

 @PutMapping("/{id}")
 public DTOTipoSaidaGet atualizar(
   @PathVariable Long id,
   @Valid @RequestBody DTOTipoSaidaPost dto) {

  return serviceTipoSaida.updateTipoSaida(id, dto);
 }

 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void excluir(@PathVariable Long id) {
  serviceTipoSaida.deleteTipoSaida(id);
 }
}
