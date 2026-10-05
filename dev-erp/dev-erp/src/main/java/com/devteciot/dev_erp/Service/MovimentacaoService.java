package com.devteciot.dev_erp.Service;

import com.devteciot.dev_erp.DTO.DTOMovimentacao.MovimentacaoGetDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Models.EntradaProduto;
import com.devteciot.dev_erp.Models.SaidaProduto;
import com.devteciot.dev_erp.Repository.EntradaProdutoRepository;
import com.devteciot.dev_erp.Repository.ProdutoRepository;
import com.devteciot.dev_erp.Repository.SaidaProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MovimentacaoService {
    private final EntradaProdutoRepository entradaProdutoRepository;
    private final SaidaProdutoRepository saidaProdutoRepository;
    private final ProdutoRepository produtoRepository;

    public List<MovimentacaoGetDTO> listar() {
        return produtoRepository.findByAtivoTrue().stream()
                .flatMap(p -> movimentosProduto(p.getId()))
                .sorted(Comparator.comparing(MovimentacaoGetDTO::data, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    public List<MovimentacaoGetDTO> listarPorProduto(Long produtoId) {
        produtoRepository.findById(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + produtoId));
        return movimentosProduto(produtoId)
                .sorted(Comparator.comparing(MovimentacaoGetDTO::data, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    private Stream<MovimentacaoGetDTO> movimentosProduto(Long produtoId) {
        Stream<MovimentacaoGetDTO> entradas = entradaProdutoRepository.findByProdutoId(produtoId).stream()
                .filter(i -> Boolean.TRUE.equals(i.getEntrada().getAtivo()))
                .map(this::entrada);
        Stream<MovimentacaoGetDTO> saidas = saidaProdutoRepository.findByProdutoIdOrderBySaidaDataCriacaoAsc(produtoId).stream()
                .filter(i -> Boolean.TRUE.equals(i.getSaida().getAtivo()))
                .map(this::saida);
        return Stream.concat(entradas, saidas);
    }

    private MovimentacaoGetDTO entrada(EntradaProduto i) {
        String numero = i.getEntrada().getNf() != null
                ? i.getEntrada().getNf().getNumero()
                : i.getEntrada().getNumeroNFManual();
        return new MovimentacaoGetDTO(
                i.getId(), "ENTRADA", i.getProduto().getId(), i.getProduto().getNome(),
                i.getQuantidadeItens().intValueExact(), i.getValorUnitario(), i.getValorTotal(),
                i.getDataValidade(), i.getEntrada().getDataCriacao(), i.getEntrada().getId(), numero,
                null, null, i.getEntrada().getObs());
    }

    private MovimentacaoGetDTO saida(SaidaProduto i) {
        return new MovimentacaoGetDTO(
                i.getId(), "SAIDA", i.getProduto().getId(), i.getProduto().getNome(),
                i.getQuantidade(), i.getValorUnitario(), i.getValorTotal(), null,
                i.getSaida().getDataCriacao(), i.getSaida().getId(), null,
                i.getSaida().getFuncionario().getNome(), i.getSaida().getSetor().getNome(), i.getSaida().getFinalidade());
    }
}
