package com.devteciot.API_erp.Controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.devteciot.API_erp.DTO.DTOCategoria.DTOCategoriaGet;
import com.devteciot.API_erp.DTO.DTOCategoria.DTOCategoriaPost;
import com.devteciot.API_erp.Services.ServiceCategoria;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

 private final ServiceCategoria serviceCategoria;

 @PostMapping
 @ResponseStatus(HttpStatus.CREATED)
 public DTOCategoriaGet salvar(@Valid @RequestBody DTOCategoriaPost dto) {
  return serviceCategoria.saveCategoria(dto);
 }

 @GetMapping
 public List<DTOCategoriaGet> listar() {
  return serviceCategoria.getListaCategoria();
 }

 @GetMapping("/{id}")
 public DTOCategoriaGet buscarPorId(@PathVariable Long id) {
  return serviceCategoria.getCategoria(id);
 }

 @PutMapping("/{id}")
 public DTOCategoriaGet atualizar(
   @PathVariable Long id,
   @Valid @RequestBody DTOCategoriaPost dto) {

  return serviceCategoria.updateCategoria(id, dto);
 }

 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void excluir(@PathVariable Long id) {
  serviceCategoria.deleteCategoria(id);
 }
}
