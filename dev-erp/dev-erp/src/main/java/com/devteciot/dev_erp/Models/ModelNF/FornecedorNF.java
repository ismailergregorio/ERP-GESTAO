package com.devteciot.dev_erp.Models.ModelNF;

import lombok.Data;

@Data
public class FornecedorNF {

 private String cnpj;
 private String razaoSocial;
 private String nomeFantasia;
 private String inscricaoEstadual;

 private String logradouro;
 private String numero;
 private String bairro;
 private String municipio;
 private String uf;
 private String cep;
}