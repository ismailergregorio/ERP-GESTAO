package com.devteciot.dev_erp.Models.ModelNF;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class NF {

    private String chaveAcesso;
    private String numero;
    private String serie;
    private LocalDateTime dataEmissao;
    private BigDecimal valorTotal;

    private FornecedorNF fornecedor;

    private List<ProdutoNF> produtos;
}