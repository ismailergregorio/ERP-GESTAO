package com.devteciot.dev_erp.DTO.DTOCategoria;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaPostDTO(

  @NotBlank(message = "O nome da categoria é obrigatório") 
  @Size(max = 150, message = "O nome da categoria deve possuir no máximo 150 caracteres") 
  String nome

) {
}