package com.devteciot.dev_erp.DTO.DTOTipoSaida;
import jakarta.validation.constraints.*;
public record TipoSaidaPostDTO(@NotBlank @Size(max=150) String nome) {}
