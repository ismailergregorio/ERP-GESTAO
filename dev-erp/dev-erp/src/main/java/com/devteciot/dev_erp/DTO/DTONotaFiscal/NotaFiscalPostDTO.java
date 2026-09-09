package com.devteciot.dev_erp.DTO.DTONotaFiscal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NotaFiscalPostDTO(

  @NotBlank(message = "O número da nota fiscal é obrigatório") @Size(max = 50, message = "O número da nota fiscal deve possuir no máximo 50 caracteres") String numero,

  @NotNull(message = "O fornecedor é obrigatório") Long fornecedorId,

  @NotBlank(message = "A chave de acesso é obrigatória") @Size(min = 44, max = 44, message = "A chave de acesso deve possuir 44 caracteres") String chaveAcesso

) {
}