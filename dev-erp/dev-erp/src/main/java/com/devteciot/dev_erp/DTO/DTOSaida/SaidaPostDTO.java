package com.devteciot.dev_erp.DTO.DTOSaida;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

/** Saída convencional. A assinatura é opcional na criação e pode ser enviada depois pela rota /{id}/assinatura. */
public record SaidaPostDTO(
        @NotNull Long funcionarioId,
        @NotNull Long setorId,
        @NotNull Long tipoSaidaId,
        @NotBlank @Size(max = 255) String finalidade,
        @Size(max = 500) String obs,
        @NotEmpty List<@Valid SaidaProdutoPostDTO> produtos,
        String assinaturaBase64
) {}
