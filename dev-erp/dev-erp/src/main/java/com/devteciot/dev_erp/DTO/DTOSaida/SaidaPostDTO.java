package com.devteciot.dev_erp.DTO.DTOSaida;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;
public record SaidaPostDTO(@NotNull Long funcionarioId,@NotNull Long setorId,@NotNull Long tipoSaidaId,@NotBlank @Size(max=255) String finalidade,@Size(max=500) String obs,@NotEmpty List<@Valid SaidaProdutoPostDTO> produtos) {}
