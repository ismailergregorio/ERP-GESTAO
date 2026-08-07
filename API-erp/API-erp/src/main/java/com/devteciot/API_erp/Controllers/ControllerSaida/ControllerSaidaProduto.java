package com.devteciot.API_erp.Controllers.ControllerSaida;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.devteciot.API_erp.DTO.DTOSaida.DTOSaidaProduto.DTOSaidaProdutoGet;
import com.devteciot.API_erp.DTO.DTOSaida.DTOSaidaProduto.DTOSaidaProdutoPost;
import com.devteciot.API_erp.Services.ServicesSaida.ServiceSaidaProduto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/saida-produtos")
@RequiredArgsConstructor
public class ControllerSaidaProduto {

 private final ServiceSaidaProduto serviceSaidaProduto;

 @PostMapping
 @ResponseStatus(HttpStatus.CREATED)
 public DTOSaidaProdutoGet salvar(
   @Valid @RequestBody DTOSaidaProdutoPost dto) {

  return serviceSaidaProduto.saveSaidaProduto(dto);
 }

 @GetMapping
 public List<DTOSaidaProdutoGet> listar() {

  return serviceSaidaProduto.getListaSaidaProduto();
 }

 @GetMapping("/{id}")
 public DTOSaidaProdutoGet buscar(@PathVariable Long id) {

  return serviceSaidaProduto.getSaidaProduto(id);
 }

 @PutMapping("/{id}")
 public DTOSaidaProdutoGet atualizar(
   @PathVariable Long id,
   @Valid @RequestBody DTOSaidaProdutoPost dto) {

  return serviceSaidaProduto.updateSaidaProduto(id, dto);
 }

 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void excluir(@PathVariable Long id) {

  serviceSaidaProduto.deleteSaidaProduto(id);
 }

}
