package com.devteciot.dev_erp.Mapper;

import com.devteciot.dev_erp.DTO.DTOCategoria.CategoriaGetDTO;
import com.devteciot.dev_erp.DTO.DTOCategoria.CategoriaPostDTO;
import com.devteciot.dev_erp.Models.Categoria;

import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

 public Categoria toEntity(CategoriaPostDTO dto) {

  Categoria categoria = new Categoria();

  categoria.setNome(dto.nome());

  return categoria;
 }

 public CategoriaGetDTO toGetDTO(Categoria categoria) {

  return new CategoriaGetDTO(
    categoria.getId(),
    categoria.getNome(),
    categoria.getDataCriacao(),
    categoria.getDataUpdate(),
    categoria.getAtivo());
 }

 public void updateEntity(
   Categoria categoria,
   CategoriaPostDTO dto) {

  categoria.setNome(dto.nome());
 }
}