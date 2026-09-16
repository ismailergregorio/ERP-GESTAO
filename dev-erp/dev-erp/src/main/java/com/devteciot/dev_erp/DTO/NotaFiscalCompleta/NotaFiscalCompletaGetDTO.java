package com.devteciot.dev_erp.DTO.NotaFiscalCompleta;

import com.devteciot.dev_erp.DTO.ProdutoRegistroNF.ProdutoRegistroNFGetDTO;

import java.time.LocalDateTime;
import java.util.List;

public record NotaFiscalCompletaGetDTO(

  Long id,

  String numero,

  Long fornecedorId,

  String razaoSocialFornecedor,

  String nomeFantasiaFornecedor,

  String chaveAcesso,

  LocalDateTime dataCriacao,

  LocalDateTime dataUpdate,

  List<ProdutoRegistroNFGetDTO> produtos

) {
}
