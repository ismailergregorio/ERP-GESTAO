package com.devteciot.dev_erp.DTO.DTOUnidadeMediada;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UnidadeMedidaPostDTO(

  @NotBlank(message = "O nome da unidade de medida é obrigatório") 
  @Size(max = 100, message = "O nome deve possuir no máximo 100 caracteres") 
  String nome,

  @NotBlank(message = "A sigla da unidade de medida é obrigatória") 
  @Size(max = 10, message = "A sigla deve possuir no máximo 10 caracteres") 
  String sigla
) {
}