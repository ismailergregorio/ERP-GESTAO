package com.devteciot.API_erp.Controllers.ControllerEntrada;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.devteciot.API_erp.DTO.DTOEntrada.DTOEntrada.DTOEntradaGet;
import com.devteciot.API_erp.DTO.DTOEntrada.DTOEntrada.DTOEntradaPost;
import com.devteciot.API_erp.Services.ServicesEntrada.ServiceEntrada;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/entradas")
@RequiredArgsConstructor
public class ControllerEntrada {

 private final ServiceEntrada serviceEntrada;

 @PostMapping
 @ResponseStatus(HttpStatus.CREATED)
 public DTOEntradaGet salvar(@Valid @RequestBody DTOEntradaPost dto) {
  return serviceEntrada.saveEntrada(dto);
 }

 @GetMapping
 public List<DTOEntradaGet> listar() {
  return serviceEntrada.getListaEntrada();
 }

 @GetMapping("/{id}")
 public DTOEntradaGet buscarPorId(@PathVariable Long id) {
  return serviceEntrada.getEntrada(id);
 }

 @GetMapping("/nota-fiscal/{notaFiscal}")
 public DTOEntradaGet buscarPorNotaFiscal(@PathVariable Integer notaFiscal) {
  return serviceEntrada.getEntradaNotaFiscal(notaFiscal);
 }

 @PutMapping("/{id}")
 public DTOEntradaGet atualizar(
   @PathVariable Long id,
   @Valid @RequestBody DTOEntradaPost dto) {

  return serviceEntrada.updateEntrada(id, dto);
 }

 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void excluir(@PathVariable Long id) {
  serviceEntrada.deleteEntrada(id);
 }
}