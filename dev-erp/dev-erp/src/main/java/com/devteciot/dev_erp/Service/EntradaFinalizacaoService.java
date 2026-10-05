package com.devteciot.dev_erp.Service;

import com.devteciot.dev_erp.DTO.EntradaProduto.EntradaProdutoGetDTO;
import com.devteciot.dev_erp.DTO.EntradaProdutoFinalizacao.EntradaFinalizacaoGetDTO;
import com.devteciot.dev_erp.DTO.EntradaProdutoFinalizacao.EntradaFinalizacaoPostDTO;
import com.devteciot.dev_erp.DTO.EntradaProdutoFinalizacao.EntradaProdutoFinalizacaoPostDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;

import com.devteciot.dev_erp.Mapper.EntradaProdutoMapper;

import com.devteciot.dev_erp.Models.Entrada;
import com.devteciot.dev_erp.Models.EntradaProduto;
import com.devteciot.dev_erp.Models.NotaFiscal;
import com.devteciot.dev_erp.Models.Produto;
import com.devteciot.dev_erp.Models.ProdutoRegistroNF;
import com.devteciot.dev_erp.Models.TipoEntrada;

import com.devteciot.dev_erp.Repository.EntradaProdutoRepository;
import com.devteciot.dev_erp.Repository.EntradaRepository;
import com.devteciot.dev_erp.Repository.NotaFiscalRepository;
import com.devteciot.dev_erp.Repository.ProdutoRegistroNFRepository;
import com.devteciot.dev_erp.Repository.ProdutoRepository;
import com.devteciot.dev_erp.Repository.TipoEntradaRepository;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class EntradaFinalizacaoService {

        private final EntradaRepository entradaRepository;

        private final EntradaProdutoRepository entradaProdutoRepository;

        private final TipoEntradaRepository tipoEntradaRepository;

        private final NotaFiscalRepository notaFiscalRepository;

        private final ProdutoRepository produtoRepository;

        private final ProdutoRegistroNFRepository produtoNFRepository;

        private final EntradaProdutoMapper entradaProdutoMapper;

        private final EstoqueService estoqueService;

        /*
         * =====================================================
         * FINALIZAR ENTRADA
         * =====================================================
         */

        @Transactional
        public EntradaFinalizacaoGetDTO finalizar(
                        EntradaFinalizacaoPostDTO dto) {

                /*
                 * =================================================
                 * 1 - VERIFICAR TIPO DE ENTRADA
                 * =================================================
                 */

                TipoEntrada tipoEntrada = tipoEntradaRepository.findById(
                                dto.tiposEntradaId()).orElseThrow(
                                                () -> new ResourceNotFoundException(
                                                                "Tipo de entrada não encontrado "
                                                                                + "com o ID: "
                                                                                + dto.tiposEntradaId()));

                if (dto.produtos() == null || dto.produtos().isEmpty()) {
                        throw new IllegalArgumentException(
                                        "A entrada deve possuir pelo menos um produto.");
                }

                Set<Long> produtosInformados = new HashSet<>();
                for (EntradaProdutoFinalizacaoPostDTO item : dto.produtos()) {
                        if (!produtosInformados.add(item.produtoId())) {
                                throw new IllegalArgumentException(
                                                "O mesmo produto não pode ser informado mais de uma vez na entrada.");
                        }
                }

                /*
                 * =================================================
                 * 2 - VERIFICAR NF
                 * =================================================
                 */

                NotaFiscal nf = null;

                if (dto.nfId() != null) {

                        nf = notaFiscalRepository.findById(
                                        dto.nfId()).orElseThrow(
                                                        () -> new ResourceNotFoundException(
                                                                        "Nota fiscal não encontrada "
                                                                                        + "com o ID: "
                                                                                        + dto.nfId()));

                        if (!Boolean.TRUE.equals(nf.getAtivo())) {
                                throw new IllegalArgumentException(
                                                "A nota fiscal informada está inativa.");
                        }

                        if (Boolean.TRUE.equals(nf.getNf_vinculada())
                                        || !entradaRepository.findByNfIdAndAtivoTrue(nf.getId()).isEmpty()) {
                                throw new IllegalArgumentException(
                                                "A nota fiscal já está vinculada a uma entrada ativa.");
                        }
                }

                /*
                 * =================================================
                 * 3 - CRIAR ENTRADA
                 * =================================================
                 */

                Entrada entrada = new Entrada();

                entrada.setTipoEntrada(tipoEntrada);

                entrada.setObs(dto.obs());

                entrada.setNf(nf);

                String numeroNFInformado = dto.numeroNF();

                if (nf != null) {
                        numeroNFInformado = null;
                }

                entrada.setNumeroNFManual(numeroNFInformado);

                /*
                 * =================================================
                 * 4 - SALVAR ENTRADA
                 * =================================================
                 *
                 * Neste momento o banco gera o ID.
                 *
                 * Exemplo:
                 *
                 * entrada.id = 15
                 *
                 */

                Entrada entradaSalva = entradaRepository.saveAndFlush(
                                entrada);

                /*
                 * =================================================
                 * 5 - CADASTRAR PRODUTOS
                 * =================================================
                 */

                for (EntradaProdutoFinalizacaoPostDTO produtoDTO : dto.produtos()) {

                        /*
                         * =============================================
                         * VERIFICAR PRODUTO INTERNO
                         * =============================================
                         */

                        Produto produto = produtoRepository.findById(
                                        produtoDTO.produtoId()).orElseThrow(
                                                        () -> new ResourceNotFoundException(
                                                                        "Produto não encontrado "
                                                                                        + "com o ID: "
                                                                                        + produtoDTO.produtoId()));

                        /*
                         * =============================================
                         * VERIFICAR PRODUTO DA NF
                         * =============================================
                         */

                        ProdutoRegistroNF produtoNF = null;

                        if (produtoDTO.produtoNFId() != null) {

                                if (nf == null) {
                                        throw new IllegalArgumentException(
                                                        "Uma entrada sem NF não pode possuir produto vinculado a NF.");
                                }

                                produtoNF = produtoNFRepository.findById(
                                                produtoDTO.produtoNFId()).orElseThrow(
                                                                () -> new ResourceNotFoundException(
                                                                                "Produto da NF não encontrado "
                                                                                                + "com o ID: "
                                                                                                + produtoDTO.produtoNFId()));

                                if (produtoNF.getNf() == null
                                                || !produtoNF.getNf().getId().equals(nf.getId())) {

                                        throw new IllegalArgumentException(
                                                        "O produto da NF com ID "
                                                                        + produtoDTO.produtoNFId()
                                                                        + " não pertence à nota fiscal informada.");
                                }
                        }

                        if (nf != null && produtoDTO.produtoNFId() == null) {
                                throw new IllegalArgumentException(
                                                "Toda entrada vinculada a uma NF deve informar o produto correspondente da NF.");
                        }

                        /*
                         * =============================================
                         * CRIAR REGISTRO
                         * =============================================
                         */

                        EntradaProduto entradaProduto = new EntradaProduto();

                        /*
                         * =============================================
                         * ASSOCIAR ENTRADA
                         * =============================================
                         */

                        entradaProduto.setEntrada(
                                        entradaSalva);

                        /*
                         * =============================================
                         * ASSOCIAR PRODUTO INTERNO
                         * =============================================
                         */

                        entradaProduto.setProduto(
                                        produto);

                        /*
                         * =============================================
                         * ASSOCIAR PRODUTO DA NF
                         * =============================================
                         */

                        entradaProduto.setProdutoNF(
                                        produtoNF);

                        /*
                         * =============================================
                         * DADOS DA ENTRADA
                         * =============================================
                         */

                        entradaProduto.setDataValidade(
                                        produtoDTO.dataValidade());

                        entradaProduto.setQuantidadeItens(
                                        produtoDTO.quantidadeItens());

                        entradaProduto.setValorUnitario(
                                        produtoDTO.valorUnitario());

                        entradaProduto.setValorTotal(
                                        produtoDTO.valorTotal());

                        /*
                         * =============================================
                         * SALVAR
                         * =============================================
                         */

                        entradaProdutoRepository.save(
                                        entradaProduto);

                        estoqueService.registrarEntrada(
                                        produto.getId(),
                                        produtoDTO.quantidadeItens(),
                                        produtoDTO.valorUnitario());
                }

                /*
                 * =================================================
                 * 6 - BUSCAR PRODUTOS SALVOS
                 * =================================================
                 */

                List<EntradaProdutoGetDTO> produtos = entradaProdutoRepository
                                .findByEntradaId(
                                                entradaSalva.getId())
                                .stream()
                                .map(item -> entradaProdutoMapper.toGetDTO(item))
                                .toList();

                /*
                 * =================================================
                 * 7 - ATUALIZAR ESTADO DA NF
                 * =================================================
                 */

                if (nf != null) {
                        nf.setNf_vinculada(true);
                        notaFiscalRepository.save(nf);
                }

                /*
                 * =================================================
                 * 8 - RETORNAR ENTRADA COMPLETA
                 * =================================================
                 */

                return new EntradaFinalizacaoGetDTO(

                                entradaSalva.getId(),

                                tipoEntrada.getId(),

                                tipoEntrada.getNome(),

                                entradaSalva.getObs(),

                                entradaSalva.getDataCriacao(),

                                entradaSalva.getDataUpdate(),

                                nf != null
                                                ? nf.getId()
                                                : null,

                                nf != null
                                                ? nf.getNumero()
                                                : null,

                                produtos);
        }
}