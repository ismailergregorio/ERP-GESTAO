package com.devteciot.dev_erp.Models.ModelNF;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProdutoNF {

    private String codigo;
    private String descricao;
    private String ncm;
    private String cfop;
    private String unidade;

    private BigDecimal quantidade;
    private BigDecimal valorUnitario;
    private BigDecimal valorTotal;
}