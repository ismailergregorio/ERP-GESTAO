package com.devteciot.dev_erp.DTO.NotaFiscalCompleta;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

import com.devteciot.dev_erp.DTO.ProdutoRegistroNF.ProdutoRegistroNFPostDTO;

public record NotaFiscalCompletaPostDTO(

  @NotBlank(message = "O número da NF é obrigatório") @Size(max = 50, message = "O número da NF deve possuir no máximo 50 caracteres") String numero,

  @NotNull(message = "O fornecedor é obrigatório") Long fornecedorId,

  @NotBlank(message = "A chave de acesso é obrigatória") @Size(min = 44, max = 44, message = "A chave de acesso deve possuir 44 caracteres") String chaveAcesso,

  @NotNull(message = "A lista de produtos é obrigatória") @Valid List<ProdutoRegistroNFPostDTO> produtos

) {
}
