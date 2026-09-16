package com.devteciot.dev_erp.DTO.DTONf;

import lombok.Data;

@Data
public class FornecedorDTO {

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