package com.devteciot.dev_erp.Mapper;

import com.devteciot.dev_erp.DTO.DTONotaFiscal.NotaFiscalGetDTO;
import com.devteciot.dev_erp.DTO.DTONotaFiscal.NotaFiscalPostDTO;
import com.devteciot.dev_erp.Models.NotaFiscal;

import org.springframework.stereotype.Component;

@Component
public class NotaFiscalMapper {

 public NotaFiscal toEntity(
   NotaFiscalPostDTO dto) {

  NotaFiscal nf = new NotaFiscal();

  nf.setNumero(
    dto.numero());

  nf.setChaveAcesso(
    dto.chaveAcesso());

  return nf;
 }

 public NotaFiscalGetDTO toGetDTO(
   NotaFiscal nf) {

  return new NotaFiscalGetDTO(

    nf.getId(),

    nf.getNumero(),

    nf.getFornecedor().getId(),

    nf.getFornecedor().getRazaoSocial(),

    nf.getFornecedor().getNomeFantasia(),

    nf.getChaveAcesso(),

    nf.getDataCriacao(),

    nf.getDataUpdate(),

    nf.getNf_vinculada());
 }

 public void updateEntity(
   NotaFiscal nf,
   NotaFiscalPostDTO dto) {

  nf.setNumero(
    dto.numero());

  nf.setChaveAcesso(
    dto.chaveAcesso());
 }
}