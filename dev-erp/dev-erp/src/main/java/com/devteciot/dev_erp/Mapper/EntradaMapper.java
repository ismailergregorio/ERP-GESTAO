package com.devteciot.dev_erp.Mapper;

import com.devteciot.dev_erp.DTO.DTOEntrada.EntradaGetDTO;
import com.devteciot.dev_erp.DTO.DTOEntrada.EntradaPostDTO;
import com.devteciot.dev_erp.Models.Entrada;
import org.springframework.stereotype.Component;

@Component
public class EntradaMapper {

 public Entrada toEntity(
   EntradaPostDTO dto) {

  Entrada entrada = new Entrada();

  entrada.setObs(dto.obs());
  entrada.setNumeroNFManual(dto.numeroNF());

  return entrada;
 }

 public EntradaGetDTO toGetDTO(
   Entrada entrada) {

  Long tiposEntradaId = null;
  String nomeTipoEntrada = null;

  if (entrada.getTipoEntrada() != null) {
   tiposEntradaId = entrada.getTipoEntrada().getId();
   nomeTipoEntrada = entrada.getTipoEntrada().getNome();
  }

  Long nfId = null;
  String numeroNF = null;

  if (entrada.getNf() != null) {
   nfId = entrada.getNf().getId();
   numeroNF = entrada.getNf().getNumero();
  }

  return new EntradaGetDTO(
    entrada.getId(),
    tiposEntradaId,
    nomeTipoEntrada,
    entrada.getObs(),
    entrada.getDataCriacao(),
    entrada.getDataUpdate(),
    nfId,
    numeroNF != null ? numeroNF : entrada.getNumeroNFManual(),
    entrada.getNumeroNFManual(),
    entrada.getAtivo());
 }

 public void updateEntity(
   Entrada entrada,
   EntradaPostDTO dto) {

  entrada.setObs(dto.obs());
  entrada.setNumeroNFManual(dto.numeroNF());
 }
}