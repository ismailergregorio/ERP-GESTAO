package com.devteciot.API_erp.Controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.devteciot.API_erp.DTO.DTOFornecedores.DTOFornecedoresGet;
import com.devteciot.API_erp.DTO.DTOFornecedores.DTOFornecedoresPost;
import com.devteciot.API_erp.Services.ServiceFornecedor;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/fornecedores")
@RequiredArgsConstructor
public class ControllerFornecedor {

 private final ServiceFornecedor serviceFornecedor;

 @PostMapping
 @ResponseStatus(HttpStatus.CREATED)
 public DTOFornecedoresGet salvar(@Valid @RequestBody DTOFornecedoresPost dto) {
  return serviceFornecedor.saveFornecedor(dto);
 }

 @GetMapping
 public List<DTOFornecedoresGet> listar() {
  return serviceFornecedor.getListaFornecedor();
 }

 @GetMapping("/{id}")
 public DTOFornecedoresGet buscarPorId(@PathVariable Long id) {
  return serviceFornecedor.getFornecedor(id);
 }

 @GetMapping("/cnpj/{cnpj}")
 public DTOFornecedoresGet buscarPorCnpj(@PathVariable String cnpj) {
  return serviceFornecedor.getFornecedor(cnpj);
 }

 @GetMapping("/nome/{nome}")
 public DTOFornecedoresGet buscarPorNome(@PathVariable String nome) {
  return serviceFornecedor.getFornecedorNome(nome);
 }

 @PutMapping("/{id}")
 public DTOFornecedoresGet atualizar(
   @PathVariable Long id,
   @Valid @RequestBody DTOFornecedoresPost dto) {

  return serviceFornecedor.updateFornecedor(id, dto);
 }

 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void excluir(@PathVariable Long id) {
  serviceFornecedor.deleteFornecedor(id);
 }
}