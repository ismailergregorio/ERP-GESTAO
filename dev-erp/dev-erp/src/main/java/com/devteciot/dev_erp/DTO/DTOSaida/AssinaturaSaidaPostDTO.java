package com.devteciot.dev_erp.DTO.DTOSaida;

import jakarta.validation.constraints.NotBlank;

public record AssinaturaSaidaPostDTO(@NotBlank String assinaturaBase64) {}
