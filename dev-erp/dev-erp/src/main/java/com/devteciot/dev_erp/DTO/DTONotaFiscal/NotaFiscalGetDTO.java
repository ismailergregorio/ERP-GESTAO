package com.devteciot.dev_erp.DTO.DTONotaFiscal;

import java.time.LocalDateTime;

public record NotaFiscalGetDTO(

    Long id,

    String numero,

    Long fornecedorId,

    String razaoSocialFornecedor,

    String nomeFantasiaFornecedor,

    String chaveAcesso,

    LocalDateTime dataCriacao,

    LocalDateTime dataUpdate,

    Boolean nf_vinculada

) {
}
