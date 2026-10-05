package com.devteciot.dev_erp.DTO.DTOSetor;
import jakarta.validation.constraints.*;
public record SetorPostDTO(@NotBlank @Size(max=150) String nome) {}
