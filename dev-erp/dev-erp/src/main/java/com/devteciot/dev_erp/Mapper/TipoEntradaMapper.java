package com.devteciot.dev_erp.Mapper;

import com.devteciot.dev_erp.DTO.DTOTipoEntrada.TipoEntradaGetDTO;
import com.devteciot.dev_erp.DTO.DTOTipoEntrada.TipoEntradaPostDTO;
import com.devteciot.dev_erp.Models.TipoEntrada;
import org.springframework.stereotype.Component;

@Component
public class TipoEntradaMapper {

 public TipoEntrada toEntity(TipoEntradaPostDTO dto) {

  TipoEntrada tipoEntrada = new TipoEntrada();

  tipoEntrada.setNome(dto.nome());

  return tipoEntrada;
 }

 public TipoEntradaGetDTO toGetDTO(TipoEntrada tipoEntrada) {

  return new TipoEntradaGetDTO(
    tipoEntrada.getId(),
    tipoEntrada.getNome(),
    tipoEntrada.getDataCriacao(),
    tipoEntrada.getDataUpdate());
 }

 public void updateEntity(
   TipoEntrada tipoEntrada,
   TipoEntradaPostDTO dto) {

  tipoEntrada.setNome(dto.nome());
 }
}
