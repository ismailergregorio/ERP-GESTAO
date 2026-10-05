package com.devteciot.dev_erp.Service;

import com.devteciot.dev_erp.DTO.DTOSaida.*;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.SaidaMapper;
import com.devteciot.dev_erp.Models.*;
import com.devteciot.dev_erp.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SaidaService {

    private final SaidaRepository repository;
    private final ProdutoRepository produtoRepository;
    private final SaidaProdutoRepository saidaProdutoRepository;
    private final SaidaMapper mapper;
    private final FuncionarioRepository funcionarioRepository;
    private final SetorRepository setorRepository;
    private final TipoSaidaRepository tipoSaidaRepository;
    private final EstoqueService estoqueService;

    @Transactional
    public SaidaGetDTO criar(SaidaPostDTO dto) {
        validarDuplicados(dto.produtos());

        Saida saida = new Saida();
        preencher(saida, dto);
        saida = repository.saveAndFlush(saida);

        for (SaidaProdutoPostDTO itemDTO : dto.produtos()) {
            Produto produto = produto(itemDTO.produtoId());
            validarEstoqueDisponivel(produto, itemDTO.quantidade());
            estoqueService.registrarSaida(produto.getId(), itemDTO.quantidade());

            SaidaProduto item = criarItem(saida, produto, itemDTO.quantidade());
            saida.getProdutos().add(item);
            saidaProdutoRepository.save(item);
        }


        return mapper.toGetDTO(repository.save(saida));
    }

    public List<SaidaGetDTO> listar() {
        return repository.findByAtivoTrueOrderByDataCriacaoDesc()
                .stream().map(mapper::toGetDTO).toList();
    }

    public SaidaGetDTO buscarPorId(Long id) {
        return mapper.toGetDTO(obterAtiva(id));
    }

    @Transactional
    public SaidaGetDTO atualizar(Long id, SaidaPostDTO dto) {
        validarDuplicados(dto.produtos());
        Saida saida = obterAtiva(id);

        List<SaidaProduto> antigos = List.copyOf(saida.getProdutos());
        for (SaidaProduto item : antigos) {
            estoqueService.devolverAoEstoque(item.getProduto().getId(), item.getQuantidade());
        }

        saida.getProdutos().clear();
        saidaProdutoRepository.deleteAllBySaidaId(saida.getId());
        repository.saveAndFlush(saida);
        preencher(saida, dto);

        for (SaidaProdutoPostDTO itemDTO : dto.produtos()) {
            Produto produto = produto(itemDTO.produtoId());
            validarEstoqueDisponivel(produto, itemDTO.quantidade());
            estoqueService.registrarSaida(produto.getId(), itemDTO.quantidade());

            SaidaProduto item = criarItem(saida, produto, itemDTO.quantidade());
            saida.getProdutos().add(item);
            saidaProdutoRepository.save(item);
        }

        return mapper.toGetDTO(repository.save(saida));
    }

    @Transactional
    public void desativar(Long id) {
        Saida saida = obterAtiva(id);
        saida.setAtivo(false);
        repository.save(saida);

        for (SaidaProduto item : saida.getProdutos()) {
            estoqueService.devolverAoEstoque(item.getProduto().getId(), item.getQuantidade());
        }
    }

    private void preencher(Saida saida, SaidaPostDTO dto) {
        Funcionario funcionario = funcionarioRepository.findById(dto.funcionarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado: " + dto.funcionarioId()));
        Setor setor = setorRepository.findById(dto.setorId())
                .orElseThrow(() -> new ResourceNotFoundException("Setor não encontrado: " + dto.setorId()));
        TipoSaida tipo = tipoSaidaRepository.findById(dto.tipoSaidaId())
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de saída não encontrado: " + dto.tipoSaidaId()));

        if (!Boolean.TRUE.equals(funcionario.getAtivo()) || !Boolean.TRUE.equals(setor.getAtivo()) || !Boolean.TRUE.equals(tipo.getAtivo())) {
            throw new IllegalArgumentException("Funcionário, setor e tipo de saída devem estar ativos.");
        }

        saida.setFuncionario(funcionario);
        saida.setSetor(setor);
        saida.setTipoSaida(tipo);
        saida.setFinalidade(dto.finalidade().trim());
        saida.setObs(dto.obs() == null || dto.obs().isBlank() ? null : dto.obs().trim());
        saida.setAtivo(true);
    }

    private Produto produto(Long id) {
        return produtoRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + id));
    }

    private void validarEstoqueDisponivel(Produto produto, Integer quantidade) {
        if (!Boolean.TRUE.equals(produto.getAtivo())) {
            throw new IllegalArgumentException("Produto inativo: " + produto.getNome());
        }
        if (quantidade == null || quantidade <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser maior que zero.");
        }
        int estoque = produto.getEstoque() == null ? 0 : produto.getEstoque();
        if (quantidade > estoque) {
            throw new IllegalArgumentException("Estoque insuficiente para " + produto.getNome() + ". Disponível: " + estoque + ".");
        }
    }

    private SaidaProduto criarItem(Saida saida, Produto produto, Integer quantidade) {
        BigDecimal valor = produto.getValorUnitario() == null ? BigDecimal.ZERO : produto.getValorUnitario();
        SaidaProduto item = new SaidaProduto();
        item.setSaida(saida);
        item.setProduto(produto);
        item.setQuantidade(quantidade);
        item.setValorUnitario(valor);
        item.setValorTotal(valor.multiply(BigDecimal.valueOf(quantidade)));
        return item;
    }

    private Saida obterAtiva(Long id) {
        Saida saida = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Saída não encontrada: " + id));
        if (!Boolean.TRUE.equals(saida.getAtivo())) {
            throw new IllegalArgumentException("A saída está desativada.");
        }
        return saida;
    }

    private void validarDuplicados(List<SaidaProdutoPostDTO> produtos) {
        if (produtos == null || produtos.isEmpty()) {
            throw new IllegalArgumentException("A saída deve possuir pelo menos um produto.");
        }
        Set<Long> ids = new HashSet<>();
        for (SaidaProdutoPostDTO item : produtos) {
            if (!ids.add(item.produtoId())) {
                throw new IllegalArgumentException("O mesmo produto não pode ser informado mais de uma vez.");
            }
        }
    }
}
