package com.devteciot.dev_erp.Mapper;

import com.devteciot.dev_erp.DTO.DTOFornecedor.FornecedorGetDTO;
import com.devteciot.dev_erp.DTO.DTOFornecedor.FornecedorPostDTO;
import com.devteciot.dev_erp.Models.Fornecedor;

import org.springframework.stereotype.Component;

@Component
public class FornecedorMapper {

 public Fornecedor toEntity(
   FornecedorPostDTO dto) {

  Fornecedor fornecedor = new Fornecedor();

  fornecedor.setRazaoSocial(
    dto.razaoSocial());

  fornecedor.setNomeFantasia(
    dto.nomeFantasia());

  fornecedor.setInscricaoEstadual(
    dto.inscricaoEstadual());

  fornecedor.setCnpj(
    dto.cnpj());

  fornecedor.setTelefone(
    dto.telefone());

  fornecedor.setEmail(
    dto.email());

  return fornecedor;
 }

 public FornecedorGetDTO toGetDTO(
   Fornecedor fornecedor) {

  return new FornecedorGetDTO(

    fornecedor.getId(),

    fornecedor.getRazaoSocial(),

    fornecedor.getNomeFantasia(),

    fornecedor.getInscricaoEstadual(),

    fornecedor.getCnpj(),

    fornecedor.getTelefone(),

    fornecedor.getEmail(),

    fornecedor.getDataCriacao(),

    fornecedor.getDataUpdate(),

    fornecedor.getAtivo());
 }

 public void updateEntity(
   Fornecedor fornecedor,
   FornecedorPostDTO dto) {

  fornecedor.setRazaoSocial(
    dto.razaoSocial());

  fornecedor.setNomeFantasia(
    dto.nomeFantasia());

  fornecedor.setInscricaoEstadual(
    dto.inscricaoEstadual());

  fornecedor.setCnpj(
    dto.cnpj());

  fornecedor.setTelefone(
    dto.telefone());

  fornecedor.setEmail(
    dto.email());
 }
}
