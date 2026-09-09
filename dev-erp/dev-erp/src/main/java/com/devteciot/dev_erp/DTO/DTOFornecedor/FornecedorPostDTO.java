package com.devteciot.dev_erp.DTO.DTOFornecedor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record FornecedorPostDTO(

  @NotBlank(message = "A razão social é obrigatória") @Size(max = 150, message = "A razão social deve possuir no máximo 150 caracteres") String razaoSocial,

  @Size(max = 150, message = "O nome fantasia deve possuir no máximo 150 caracteres") String nomeFantasia,

  @Size(max = 30, message = "A inscrição estadual deve possuir no máximo 30 caracteres") String inscricaoEstadual,

  @NotBlank(message = "O CNPJ é obrigatório") @Size(max = 18, message = "O CNPJ deve possuir no máximo 18 caracteres") String cnpj,

  @Size(max = 20, message = "O telefone deve possuir no máximo 20 caracteres") String telefone,

  @Email(message = "Informe um e-mail válido") @Size(max = 150, message = "O e-mail deve possuir no máximo 150 caracteres") String email

) {
}