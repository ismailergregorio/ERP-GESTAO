package com.devteciot.dev_erp.DTO.EntradaProdutoFinalizacao;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record EntradaFinalizacaoPostDTO(

  @NotNull(message = "O tipo de entrada é obrigatório") Long tiposEntradaId,

  String obs,

  Long nfId,

  @NotNull(message = "A lista de produtos é obrigatória") @Valid List<EntradaProdutoFinalizacaoPostDTO> produtos

) {
}