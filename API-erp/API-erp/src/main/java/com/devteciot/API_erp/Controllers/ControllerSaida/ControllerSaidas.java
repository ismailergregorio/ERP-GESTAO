package com.devteciot.API_erp.Controllers.ControllerSaida;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.devteciot.API_erp.DTO.DTOSaida.DTOSaida.DTOSaidaGet;
import com.devteciot.API_erp.DTO.DTOSaida.DTOSaida.DTOSaidaPost;
import com.devteciot.API_erp.Services.ServicesSaida.ServiceSaida;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/saidas")
@RequiredArgsConstructor
public class ControllerSaidas {

 private final ServiceSaida serviceSaida;

 @PostMapping
 @ResponseStatus(HttpStatus.CREATED)
 public DTOSaidaGet salvar(@Valid @RequestBody DTOSaidaPost dto) {

  return serviceSaida.saveSaida(dto);
 }

 @GetMapping
 public List<DTOSaidaGet> listar() {

  return serviceSaida.getListaSaida();
 }

 @GetMapping("/{id}")
 public DTOSaidaGet buscar(@PathVariable Long id) {

  return serviceSaida.getSaida(id);
 }

 @GetMapping("/funcionario/{funcionarioId}")
 public List<DTOSaidaGet> buscarFuncionario(@PathVariable Long funcionarioId) {

  return serviceSaida.getSaidasFuncionario(funcionarioId);
 }

 @PutMapping("/{id}")
 public DTOSaidaGet atualizar(
   @PathVariable Long id,
   @Valid @RequestBody DTOSaidaPost dto) {

  return serviceSaida.updateSaida(id, dto);
 }

 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void excluir(@PathVariable Long id) {

  serviceSaida.deleteSaida(id);
 }

}
