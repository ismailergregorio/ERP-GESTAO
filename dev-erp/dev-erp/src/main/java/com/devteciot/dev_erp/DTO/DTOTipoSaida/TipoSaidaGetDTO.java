package com.devteciot.dev_erp.DTO.DTOTipoSaida;
import java.time.LocalDateTime;
public record TipoSaidaGetDTO(Long id,String nome,Boolean ativo,LocalDateTime dataCriacao,LocalDateTime dataUpdate) {}
