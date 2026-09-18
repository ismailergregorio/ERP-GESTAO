package com.devteciot.dev_erp.DTO.EntradaProdutoFinalizacao;

import java.time.LocalDateTime;
import java.util.List;

import com.devteciot.dev_erp.DTO.EntradaProduto.EntradaProdutoGetDTO;

public record EntradaFinalizacaoGetDTO(

    Long id,

    Long tiposEntradaId,

    String nomeTipoEntrada,

    String obs,

    LocalDateTime dataCriacao,

    LocalDateTime dataUpdate,

    Long nfId,

    String numeroNF,

    List<EntradaProdutoGetDTO> produtos

) {
}