package com.devteciot.dev_erp.DTO.EntradaProdutoFinalizacao;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record EntradaFinalizacaoPostDTO(

  @NotNull(message = "O tipo de entrada é obrigatório") Long tiposEntradaId,

  String obs,

  Long nfId,

  @Size(max = 60, message = "O número da nota deve possuir no máximo 60 caracteres") String numeroNF,

  @NotNull(message = "A lista de produtos é obrigatória") @Size(min = 1, message = "A entrada deve possuir pelo menos um produto") @Valid List<EntradaProdutoFinalizacaoPostDTO> produtos

) {
}