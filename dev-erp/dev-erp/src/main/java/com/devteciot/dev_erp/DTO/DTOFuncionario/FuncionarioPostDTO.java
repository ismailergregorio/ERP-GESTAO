package com.devteciot.dev_erp.DTO.DTOFuncionario;
import jakarta.validation.constraints.*;
public record FuncionarioPostDTO(@NotBlank @Size(max=150) String nome,@Size(max=30) String cpf) {}
