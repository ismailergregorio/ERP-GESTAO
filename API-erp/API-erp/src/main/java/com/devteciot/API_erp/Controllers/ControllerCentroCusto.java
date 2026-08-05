package com.devteciot.API_erp.Controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.devteciot.API_erp.DTO.DTOCentroCusto.DTOCentroCustoGet;
import com.devteciot.API_erp.DTO.DTOCentroCusto.DTOCentroCustoPost;
import com.devteciot.API_erp.Services.ServiceCentroCusto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/centro-custo")
@RequiredArgsConstructor
public class ControllerCentroCusto {

 private final ServiceCentroCusto serviceCentroCusto;

 @PostMapping
 @ResponseStatus(HttpStatus.CREATED)
 public DTOCentroCustoGet salvar(@Valid @RequestBody DTOCentroCustoPost dto) {
  return serviceCentroCusto.saveCentroCusto(dto);
 }

 @GetMapping
 public List<DTOCentroCustoGet> listar() {
  return serviceCentroCusto.getListaCentroCusto();
 }

 @GetMapping("/{id}")
 public DTOCentroCustoGet buscarPorId(@PathVariable Long id) {
  return serviceCentroCusto.getCentroCusto(id);
 }

 @PutMapping("/{id}")
 public DTOCentroCustoGet atualizar(
   @PathVariable Long id,
   @Valid @RequestBody DTOCentroCustoPost dto) {

  return serviceCentroCusto.updateCentroCusto(id, dto);
 }

 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void excluir(@PathVariable Long id) {
  serviceCentroCusto.deleteCentroCusto(id);
 }
}
