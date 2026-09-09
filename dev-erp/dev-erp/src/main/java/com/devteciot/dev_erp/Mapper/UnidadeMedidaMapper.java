package com.devteciot.dev_erp.Mapper;

import com.devteciot.dev_erp.DTO.DTOUnidadeMediada.UnidadeMedidaGetDTO;
import com.devteciot.dev_erp.DTO.DTOUnidadeMediada.UnidadeMedidaPostDTO;
import com.devteciot.dev_erp.Models.UnidadeMedida;

import org.springframework.stereotype.Component;

@Component
public class UnidadeMedidaMapper {

 public UnidadeMedida toEntity(
   UnidadeMedidaPostDTO dto) {

  UnidadeMedida unidade = new UnidadeMedida();

  unidade.setNome(dto.nome());

  unidade.setSigla(dto.sigla());

  return unidade;
 }

 public UnidadeMedidaGetDTO toGetDTO(
   UnidadeMedida unidade) {

  return new UnidadeMedidaGetDTO(
    unidade.getId(),
    unidade.getNome(),
    unidade.getSigla(),
    unidade.getDataCriacao(),
    unidade.getDataUpdate(),
    unidade.getAtivo());
 }

 public void updateEntity(
   UnidadeMedida unidade,
   UnidadeMedidaPostDTO dto) {

  unidade.setNome(dto.nome());

  unidade.setSigla(dto.sigla());
 }
}