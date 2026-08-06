package com.devteciot.API_erp.Controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.devteciot.API_erp.DTO.DTOFuncionario.DTOFuncionarioGet;
import com.devteciot.API_erp.DTO.DTOFuncionario.DTOFuncionarioPost;
import com.devteciot.API_erp.Services.ServiceFuncionario;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/funcionarios")
@RequiredArgsConstructor
public class ControllerFuncionario {

 private final ServiceFuncionario serviceFuncionario;

 @PostMapping
 @ResponseStatus(HttpStatus.CREATED)
 public DTOFuncionarioGet salvar(@Valid @RequestBody DTOFuncionarioPost dto) {
  return serviceFuncionario.saveFuncionario(dto);
 }

 @GetMapping
 public List<DTOFuncionarioGet> listar() {
  return serviceFuncionario.getListaFuncionario();
 }

 @GetMapping("/{id}")
 public DTOFuncionarioGet buscarPorId(@PathVariable Long id) {
  return serviceFuncionario.getFuncionario(id);
 }

 @GetMapping("/cpf/{cpf}")
 public DTOFuncionarioGet buscarPorCpf(@PathVariable String cpf) {
  return serviceFuncionario.getFuncionarioCpf(cpf);
 }

 @GetMapping("/nome/{nome}")
 public DTOFuncionarioGet buscarPorNome(@PathVariable String nome) {
  return serviceFuncionario.getFuncionarioNome(nome);
 }

 @PutMapping("/{id}")
 public DTOFuncionarioGet atualizar(
   @PathVariable Long id,
   @Valid @RequestBody DTOFuncionarioPost dto) {

  return serviceFuncionario.updateFuncionario(id, dto);
 }

 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void excluir(@PathVariable Long id) {
  serviceFuncionario.deleteFuncionario(id);
 }
}