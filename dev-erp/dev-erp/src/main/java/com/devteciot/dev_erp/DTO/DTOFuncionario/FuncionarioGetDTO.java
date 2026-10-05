package com.devteciot.dev_erp.DTO.DTOFuncionario;
import java.time.LocalDateTime;
public record FuncionarioGetDTO(Long id,String nome,String cpf,Boolean ativo,LocalDateTime dataCriacao,LocalDateTime dataUpdate) {}
