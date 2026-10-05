package com.devteciot.dev_erp.Service;

import com.devteciot.dev_erp.DTO.DTOEstoque.EstoqueProdutoGetDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Models.EntradaProduto;
import com.devteciot.dev_erp.Models.Produto;
import com.devteciot.dev_erp.Repository.EntradaProdutoRepository;
import com.devteciot.dev_erp.Repository.ProdutoRepository;
import com.devteciot.dev_erp.Repository.SaidaProdutoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EstoqueService {

    private final ProdutoRepository produtoRepository;
    private final EntradaProdutoRepository entradaProdutoRepository;
    private final SaidaProdutoRepository saidaProdutoRepository;

    /** Registra fisicamente uma entrada no estoque e atualiza o custo médio ponderado. */
    @Transactional
    public void registrarEntrada(Long produtoId, BigDecimal quantidade, BigDecimal valorUnitario) {
        if (quantidade == null || quantidade.signum() <= 0) {
            throw new IllegalArgumentException("A quantidade de entrada deve ser maior que zero.");
        }
        if (quantidade.stripTrailingZeros().scale() > 0) {
            throw new IllegalArgumentException("A quantidade de estoque deve ser inteira.");
        }

        Produto produto = produtoRepository.findByIdForUpdate(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + produtoId));

        int estoqueAtual = produto.getEstoque() == null ? 0 : produto.getEstoque();
        int quantidadeEntrada = quantidade.intValueExact();
        BigDecimal custoAtual = produto.getValorUnitario() == null ? BigDecimal.ZERO : produto.getValorUnitario();
        BigDecimal custoEntrada = valorUnitario == null ? BigDecimal.ZERO : valorUnitario;

        BigDecimal valorAtualEstoque = custoAtual.multiply(BigDecimal.valueOf(estoqueAtual));
        BigDecimal valorNovaEntrada = custoEntrada.multiply(quantidade);
        BigDecimal quantidadeFinal = BigDecimal.valueOf(estoqueAtual + quantidadeEntrada);

        BigDecimal novoCustoMedio = quantidadeFinal.signum() == 0
                ? BigDecimal.ZERO
                : valorAtualEstoque.add(valorNovaEntrada)
                        .divide(quantidadeFinal, 2, RoundingMode.HALF_UP);

        produto.setEstoque(estoqueAtual + quantidadeEntrada);
        produto.setValorUnitario(novoCustoMedio);
        produtoRepository.save(produto);
    }

    /** Retira quantidade do estoque. O custo médio não é alterado pela saída. */
    @Transactional
    public void registrarSaida(Long produtoId, int quantidade) {
        if (quantidade <= 0) {
            throw new IllegalArgumentException("A quantidade de saída deve ser maior que zero.");
        }

        Produto produto = produtoRepository.findByIdForUpdate(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + produtoId));

        int estoqueAtual = produto.getEstoque() == null ? 0 : produto.getEstoque();
        if (quantidade > estoqueAtual) {
            throw new IllegalArgumentException(
                    "Estoque insuficiente para " + produto.getNome() +
                    ". Disponível: " + estoqueAtual + ".");
        }

        produto.setEstoque(estoqueAtual - quantidade);
        produtoRepository.save(produto);
    }


    /** Reverte uma entrada já lançada no estoque. */
    @Transactional
    public void removerEntrada(Long produtoId, int quantidade) {
        if (quantidade <= 0) return;
        Produto produto = produtoRepository.findByIdForUpdate(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + produtoId));
        int estoque = produto.getEstoque() == null ? 0 : produto.getEstoque();
        if (quantidade > estoque) {
            throw new IllegalArgumentException("Não é possível desativar a entrada do produto '" + produto.getNome() + "' porque o estoque atual é menor que a quantidade da entrada.");
        }
        produto.setEstoque(estoque - quantidade);
        produtoRepository.save(produto);
    }

    /** Devolve quantidade ao estoque sem alterar o custo médio. */
    @Transactional
    public void devolverAoEstoque(Long produtoId, int quantidade) {
        if (quantidade <= 0) return;
        Produto produto = produtoRepository.findByIdForUpdate(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + produtoId));
        int estoque = produto.getEstoque() == null ? 0 : produto.getEstoque();
        produto.setEstoque(estoque + quantidade);
        produtoRepository.save(produto);
    }

    public List<EstoqueProdutoGetDTO> listar() {
        return produtoRepository.findByAtivoTrue().stream().map(this::toDTO).toList();
    }

    public EstoqueProdutoGetDTO buscar(Long produtoId) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + produtoId));
        return toDTO(produto);
    }

    private EstoqueProdutoGetDTO toDTO(Produto p) {
        LocalDate validade = entradaProdutoRepository.findByProdutoId(p.getId()).stream()
                .filter(i -> Boolean.TRUE.equals(i.getEntrada().getAtivo()))
                .filter(i -> i.getDataValidade() != null)
                .filter(i -> i.getQuantidadeItens() != null && i.getQuantidadeItens().signum() > 0)
                .map(EntradaProduto::getDataValidade)
                .filter(d -> !d.isBefore(LocalDate.now()))
                .min(LocalDate::compareTo)
                .orElse(null);

        int estoque = p.getEstoque() == null ? 0 : p.getEstoque();
        String status;
        if (estoque <= p.getEstoqueMinimo()) status = "BAIXO";
        else if (estoque >= p.getEstoqueMaximo() && p.getEstoqueMaximo() > 0) status = "MAXIMO";
        else status = "NORMAL";

        return new EstoqueProdutoGetDTO(
                p.getId(), p.getNome(), p.getUnidadeMedida().getSigla(),
                p.getCategoria().getNome(), estoque, p.getEstoqueMinimo(),
                p.getEstoqueMaximo(), p.getValorUnitario(), validade, status);
    }
}
