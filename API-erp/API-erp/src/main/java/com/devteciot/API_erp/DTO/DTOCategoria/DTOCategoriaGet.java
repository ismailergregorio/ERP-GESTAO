package com.devteciot.API_erp.DTO.DTOCategoria;

import java.time.LocalDateTime;

public record DTOCategoriaGet(Long id, String nome, Boolean ativo, LocalDateTime dataCriacao) {

}
