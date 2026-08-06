package com.devteciot.API_erp.Controllers.ControllerEntrada;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.devteciot.API_erp.DTO.DTOEntrada.DTOEntradaProduto.DTOEntrdaProdutoGet;
import com.devteciot.API_erp.DTO.DTOEntrada.DTOEntradaProduto.DTOEntrdaProdutoPost;
import com.devteciot.API_erp.Services.ServicesEntrada.ServiceEntradaProduto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/entrada-produtos")
@RequiredArgsConstructor
public class ControllerEntradaProduto {

 private final ServiceEntradaProduto serviceEntradaProduto;

 @PostMapping
 @ResponseStatus(HttpStatus.CREATED)
 public DTOEntrdaProdutoGet salvar(@Valid @RequestBody DTOEntrdaProdutoPost dto) {

  return serviceEntradaProduto.saveEntradaProduto(dto);
 }

 @GetMapping
 public List<DTOEntrdaProdutoGet> listar() {

  return serviceEntradaProduto.getListaEntradaProduto();
 }

 @GetMapping("/{id}")
 public DTOEntrdaProdutoGet buscar(@PathVariable Long id) {

  return serviceEntradaProduto.getEntradaProduto(id);
 }

 @PutMapping("/{id}")
 public DTOEntrdaProdutoGet atualizar(
   @PathVariable Long id,
   @Valid @RequestBody DTOEntrdaProdutoPost dto) {

  return serviceEntradaProduto.updateEntradaProduto(id, dto);
 }

 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void excluir(@PathVariable Long id) {

  serviceEntradaProduto.deleteEntradaProduto(id);
 }

}
