package com.devteciot.dev_erp.Mapper;

import org.springframework.stereotype.Component;

import com.devteciot.dev_erp.DTO.DTONf.FornecedorDTO;
import com.devteciot.dev_erp.DTO.DTONf.NotaFiscalDTO;
import com.devteciot.dev_erp.DTO.DTONf.ProdutoDTO;
import com.devteciot.dev_erp.Models.ModelNF.FornecedorNF;
import com.devteciot.dev_erp.Models.ModelNF.NF;
import com.devteciot.dev_erp.Models.ModelNF.ProdutoNF;

@Component
public class NfMapper {

        public NotaFiscalDTO toDTO(NF nota) {

                NotaFiscalDTO dto = new NotaFiscalDTO();

                dto.setChaveAcesso(nota.getChaveAcesso());
                dto.setNumero(nota.getNumero());
                dto.setSerie(nota.getSerie());
                dto.setDataEmissao(nota.getDataEmissao());
                dto.setValorTotal(nota.getValorTotal());

                dto.setFornecedor(
                                toFornecedorDTO(nota.getFornecedor()));

                dto.setProdutos(
                                nota.getProdutos()
                                                .stream()
                                                .map(this::toProdutoDTO)
                                                .toList());

                return dto;
        }

        private FornecedorDTO toFornecedorDTO(
                        FornecedorNF fornecedor) {

                FornecedorDTO dto = new FornecedorDTO();

                dto.setCnpj(fornecedor.getCnpj());
                dto.setRazaoSocial(fornecedor.getRazaoSocial());
                dto.setNomeFantasia(fornecedor.getNomeFantasia());
                dto.setInscricaoEstadual(
                                fornecedor.getInscricaoEstadual());

                dto.setLogradouro(fornecedor.getLogradouro());
                dto.setNumero(fornecedor.getNumero());
                dto.setBairro(fornecedor.getBairro());
                dto.setMunicipio(fornecedor.getMunicipio());
                dto.setUf(fornecedor.getUf());
                dto.setCep(fornecedor.getCep());

                return dto;
        }

        private ProdutoDTO toProdutoDTO(
                        ProdutoNF produto) {

                ProdutoDTO dto = new ProdutoDTO();

                dto.setCodigo(produto.getCodigo());
                dto.setDescricao(produto.getDescricao());
                dto.setNcm(produto.getNcm());
                dto.setCfop(produto.getCfop());
                dto.setUnidade(produto.getUnidade());

                dto.setQuantidade(produto.getQuantidade());
                dto.setValorUnitario(produto.getValorUnitario());
                dto.setValorTotal(produto.getValorTotal());

                return dto;
        }
}
