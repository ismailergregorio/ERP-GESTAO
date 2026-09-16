package com.devteciot.dev_erp.DTO.DTONf;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class NotaFiscalDTO {

    private String chaveAcesso;
    private String numero;
    private String serie;
    private LocalDateTime dataEmissao;
    private BigDecimal valorTotal;

    private FornecedorDTO fornecedor;

    private List<ProdutoDTO> produtos;
}