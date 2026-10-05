package com.devteciot.dev_erp.DTO.DTOSetor;
import java.time.LocalDateTime;
public record SetorGetDTO(Long id,String nome,Boolean ativo,LocalDateTime dataCriacao,LocalDateTime dataUpdate) {}
