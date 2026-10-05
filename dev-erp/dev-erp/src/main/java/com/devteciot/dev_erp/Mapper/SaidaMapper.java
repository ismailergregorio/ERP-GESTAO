package com.devteciot.dev_erp.Mapper;
import com.devteciot.dev_erp.DTO.DTOSaida.*; import com.devteciot.dev_erp.Models.*; import org.springframework.stereotype.Component; import java.util.*;
@Component public class SaidaMapper {
 public SaidaGetDTO toGetDTO(Saida s){ List<SaidaProdutoGetDTO> ps=s.getProdutos().stream().map(this::toProduto).toList(); return new SaidaGetDTO(s.getId(),s.getFuncionario().getId(),s.getFuncionario().getNome(),s.getSetor().getId(),s.getSetor().getNome(),s.getTipoSaida().getId(),s.getTipoSaida().getNome(),s.getFinalidade(),s.getObs(),s.getAtivo(),s.getDataCriacao(),s.getDataUpdate(),ps); }
 private SaidaProdutoGetDTO toProduto(SaidaProduto i){ return new SaidaProdutoGetDTO(i.getId(),i.getProduto().getId(),i.getProduto().getNome(),i.getProduto().getUnidadeMedida().getSigla(),i.getQuantidade(),i.getValorUnitario(),i.getValorTotal()); }
}
