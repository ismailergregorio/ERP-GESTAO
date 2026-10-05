package com.devteciot.dev_erp.DTO.DTOSaida;
import java.time.LocalDateTime; import java.util.List;
public record SaidaGetDTO(Long id,Long funcionarioId,String funcionario,Long setorId,String setor,Long tipoSaidaId,String tipoSaida,String finalidade,String obs,Boolean ativo,LocalDateTime dataCriacao,LocalDateTime dataUpdate,List<SaidaProdutoGetDTO> produtos) {}
