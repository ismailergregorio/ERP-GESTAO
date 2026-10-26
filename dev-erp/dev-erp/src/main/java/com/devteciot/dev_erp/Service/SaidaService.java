package com.devteciot.dev_erp.Service;

import com.devteciot.dev_erp.DTO.DTOSaida.*;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.SaidaMapper;
import com.devteciot.dev_erp.Models.*;
import com.devteciot.dev_erp.Repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class SaidaService {
    private static final int MAX_ASSINATURA_BYTES = 2 * 1024 * 1024;
    private static final Set<String> CATEGORIAS_EPI = Set.of("epi", "uniforme");

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
        preencher(saida, dto.funcionarioId(), dto.setorId(), dto.tipoSaidaId(), dto.finalidade(), dto.obs());
        saida.setSaidaEpi(false);
        // A saída convencional aceita assinatura já na criação, mas mantém compatibilidade
        // com clientes antigos que não enviam o campo assinaturaBase64.
        if (dto.assinaturaBase64() != null && !dto.assinaturaBase64().isBlank()) {
            saida.setAssinaturaFuncionario(decodificarAssinatura(dto.assinaturaBase64()));
            saida.setDataAssinatura(LocalDateTime.now());
        }
        return criarItensEFinalizar(saida, dto.produtos());
    }

    @Transactional
    public SaidaGetDTO criarEpi(SaidaEpiPostDTO dto) {
        validarDuplicados(dto.produtos());
        byte[] assinatura = decodificarAssinatura(dto.assinaturaBase64());
        Saida saida = new Saida();
        preencher(saida, dto.funcionarioId(), dto.setorId(), dto.tipoSaidaId(), dto.finalidade(), dto.obs());
        saida.setSaidaEpi(true);
        saida.setAssinaturaFuncionario(assinatura);
        saida.setDataAssinatura(LocalDateTime.now());
        return criarItensEFinalizar(saida, dto.produtos(), true);
    }

    @Transactional
    public SaidaGetDTO registrarAssinatura(Long id, AssinaturaSaidaPostDTO dto) {
        Saida saida = obterAtiva(id);
        saida.setAssinaturaFuncionario(decodificarAssinatura(dto.assinaturaBase64()));
        saida.setDataAssinatura(LocalDateTime.now());
        return mapper.toGetDTO(repository.save(saida));
    }

    public List<SaidaGetDTO> listar() {
        return repository.findByAtivoTrueOrderByDataCriacaoDesc().stream().map(mapper::toGetDTO).toList();
    }

    public SaidaGetDTO buscarPorId(Long id) { return mapper.toGetDTO(obterAtiva(id)); }

    @Transactional
    public SaidaGetDTO atualizar(Long id, SaidaPostDTO dto) {
        validarDuplicados(dto.produtos());
        Saida saida = obterAtiva(id);
        if (Boolean.TRUE.equals(saida.getSaidaEpi())) {
            throw new IllegalArgumentException("Saídas de EPI/uniforme não podem ser alteradas pela rota convencional. Crie uma nova saída ou implemente um fluxo específico de correção.");
        }
        List<SaidaProduto> antigos = List.copyOf(saida.getProdutos());
        for (SaidaProduto item : antigos) estoqueService.devolverAoEstoque(item.getProduto().getId(), item.getQuantidade());
        saida.getProdutos().clear();
        saidaProdutoRepository.deleteAllBySaidaId(saida.getId());
        repository.saveAndFlush(saida);
        preencher(saida, dto.funcionarioId(), dto.setorId(), dto.tipoSaidaId(), dto.finalidade(), dto.obs());
        return criarItensEFinalizar(saida, dto.produtos());
    }

    @Transactional
    public void desativar(Long id) {
        Saida saida = obterAtiva(id);
        saida.setAtivo(false);
        repository.save(saida);
        for (SaidaProduto item : saida.getProdutos()) estoqueService.devolverAoEstoque(item.getProduto().getId(), item.getQuantidade());
    }

    private SaidaGetDTO criarItensEFinalizar(Saida saida, List<SaidaProdutoPostDTO> itens) {
        return criarItensEFinalizar(saida, itens, false);
    }

    private SaidaGetDTO criarItensEFinalizar(Saida saida, List<SaidaProdutoPostDTO> itens, boolean exigirCategoriaEpi) {
        saida = repository.saveAndFlush(saida);
        for (SaidaProdutoPostDTO itemDTO : itens) {
            Produto produto = produto(itemDTO.produtoId());
            if (exigirCategoriaEpi) validarCategoriaEpi(produto);
            validarEstoqueDisponivel(produto, itemDTO.quantidade());
            estoqueService.registrarSaida(produto.getId(), itemDTO.quantidade());
            SaidaProduto item = criarItem(saida, produto, itemDTO.quantidade());
            saida.getProdutos().add(item);
            saidaProdutoRepository.save(item);
        }
        return mapper.toGetDTO(repository.save(saida));
    }

    private void validarCategoriaEpi(Produto produto) {
        String categoria = produto.getCategoria() == null || produto.getCategoria().getNome() == null
                ? "" : produto.getCategoria().getNome().trim().toLowerCase(Locale.ROOT);
        if (!CATEGORIAS_EPI.contains(categoria)) {
            throw new IllegalArgumentException("O produto '" + produto.getNome() + "' não pertence às categorias EPI ou Uniforme e não pode constar em uma saída especializada.");
        }
    }

    private void preencher(Saida saida, Long funcionarioId, Long setorId, Long tipoSaidaId, String finalidade, String obs) {
        Funcionario funcionario = funcionarioRepository.findById(funcionarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado: " + funcionarioId));
        Setor setor = setorRepository.findById(setorId)
                .orElseThrow(() -> new ResourceNotFoundException("Setor não encontrado: " + setorId));
        TipoSaida tipo = tipoSaidaRepository.findById(tipoSaidaId)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de saída não encontrado: " + tipoSaidaId));
        if (!Boolean.TRUE.equals(funcionario.getAtivo()) || !Boolean.TRUE.equals(setor.getAtivo()) || !Boolean.TRUE.equals(tipo.getAtivo())) {
            throw new IllegalArgumentException("Funcionário, setor e tipo de saída devem estar ativos.");
        }
        saida.setFuncionario(funcionario);
        saida.setSetor(setor);
        saida.setTipoSaida(tipo);
        saida.setFinalidade(finalidade.trim());
        saida.setObs(obs == null || obs.isBlank() ? null : obs.trim());
        saida.setAtivo(true);
    }

    private byte[] decodificarAssinatura(String valor) {
        try {
            String base64 = valor == null ? "" : valor.trim();
            if (base64.startsWith("data:")) {
                int separador = base64.indexOf(',');
                if (separador < 0 || !base64.substring(0, separador).toLowerCase(Locale.ROOT).contains(";base64")) {
                    throw new IllegalArgumentException("Formato de assinatura inválido. Envie uma imagem PNG ou JPEG em Base64.");
                }
                base64 = base64.substring(separador + 1);
            }
            byte[] bytes = Base64.getDecoder().decode(base64);
            if (bytes.length == 0 || bytes.length > MAX_ASSINATURA_BYTES) {
                throw new IllegalArgumentException("A assinatura deve possuir conteúdo e ter no máximo 2 MB.");
            }
            BufferedImage imagem = ImageIO.read(new ByteArrayInputStream(bytes));
            if (imagem == null || imagem.getWidth() > 4000 || imagem.getHeight() > 4000) {
                throw new IllegalArgumentException("A assinatura deve ser uma imagem PNG ou JPEG válida de até 4000x4000 pixels.");
            }
            return bytes;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException("Não foi possível interpretar a assinatura. Envie uma imagem PNG ou JPEG em Base64.");
        }
    }

    private Produto produto(Long id) {
        return produtoRepository.findByIdForUpdate(id).orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + id));
    }

    private void validarEstoqueDisponivel(Produto produto, Integer quantidade) {
        if (!Boolean.TRUE.equals(produto.getAtivo())) throw new IllegalArgumentException("Produto inativo: " + produto.getNome());
        if (quantidade == null || quantidade <= 0) throw new IllegalArgumentException("A quantidade deve ser maior que zero.");
        int estoque = produto.getEstoque() == null ? 0 : produto.getEstoque();
        if (quantidade > estoque) throw new IllegalArgumentException("Estoque insuficiente para " + produto.getNome() + ". Disponível: " + estoque + ".");
    }

    private SaidaProduto criarItem(Saida saida, Produto produto, Integer quantidade) {
        BigDecimal valor = produto.getValorUnitario() == null ? BigDecimal.ZERO : produto.getValorUnitario();
        SaidaProduto item = new SaidaProduto();
        item.setSaida(saida); item.setProduto(produto); item.setQuantidade(quantidade);
        item.setValorUnitario(valor); item.setValorTotal(valor.multiply(BigDecimal.valueOf(quantidade)));
        return item;
    }

    private Saida obterAtiva(Long id) {
        Saida saida = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Saída não encontrada: " + id));
        if (!Boolean.TRUE.equals(saida.getAtivo())) throw new IllegalArgumentException("A saída está desativada.");
        return saida;
    }

    private void validarDuplicados(List<SaidaProdutoPostDTO> produtos) {
        if (produtos == null || produtos.isEmpty()) throw new IllegalArgumentException("A saída deve possuir pelo menos um produto.");
        Set<Long> ids = new HashSet<>();
        for (SaidaProdutoPostDTO item : produtos) {
            if (!ids.add(item.produtoId())) throw new IllegalArgumentException("O mesmo produto não pode ser informado mais de uma vez.");
        }
    }
}
