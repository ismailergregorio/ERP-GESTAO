package com.devteciot.API_erp.Services.ServicesXML;

import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.Unmarshaller;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import com.devteciot.API_erp.DTO.DTOXMLnota.DTORespostaForcedorProduto;
import com.devteciot.API_erp.Exception.ResourceNotFoundException;
import com.devteciot.API_erp.Models.ModelTbFornecedores;
import com.devteciot.API_erp.Models.ModelXML.Det;
import com.devteciot.API_erp.Models.ModelXML.Emitente;
import com.devteciot.API_erp.Models.ModelXML.NfeProc;
import com.devteciot.API_erp.Models.ModelXML.Produto;
import com.devteciot.API_erp.Repository.RepositoryFornecedor;
import com.devteciot.API_erp.Repository.RepositoryProdutosNf;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Service
public class NfeXmlService {

        private final RepositoryFornecedor repositoryFornecedor;
        private final RepositoryProdutosNf repositoryProdutosNf;

        public NfeProc lerXml(String xml) {

                try {

                        JAXBContext context = JAXBContext.newInstance(NfeProc.class);

                        Unmarshaller unmarshaller = context.createUnmarshaller();

                        return (NfeProc) unmarshaller.unmarshal(
                                        new StringReader(xml));

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Erro ao ler XML da NF-e",
                                        e);
                }
        }

        public DTORespostaForcedorProduto obterProdutosComFornecedor(String xml) {

                NfeProc nfe = lerXml(xml);

                if (nfe == null ||
                                nfe.getNfe() == null ||
                                nfe.getNfe().getInfNFe() == null) {

                        return null;
                }

                // =========================
                // FORNECEDOR
                // =========================

                Emitente emitente = nfe.getNfe()
                                .getInfNFe()
                                .getEmitente();

                if (emitente == null) {
                        throw new RuntimeException("Fornecedor não encontrado no XML da NF-e.");
                }

                ModelTbFornecedores fornecedor = repositoryFornecedor
                                .findByCnpj(emitente.getCnpj())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Fornecedor não cadastrado. CNPJ: " + emitente.getCnpj()));

                // =========================
                // PRODUTOS
                // =========================

                List<Det> itens = nfe.getNfe()
                                .getInfNFe()
                                .getItens();

                if (itens == null) {
                        itens = new ArrayList<>();
                }

                // Converte Det -> Produto
                List<Produto> produtos = itens.stream()
                                .map(item -> item.getProduto())
                                .filter(Objects::nonNull)
                                .toList();

                // =========================
                // RETORNO
                // =========================

                return new DTORespostaForcedorProduto(
                                produtos,
                                emitente);
        }

        public DTORespostaForcedorProduto salvarProdutoFornecedorPorNf(String xml) {

                NfeProc nfe = lerXml(xml);

                if (nfe == null ||
                                nfe.getNfe() == null ||
                                nfe.getNfe().getInfNFe() == null) {

                        return null;
                }

                // =========================
                // FORNECEDOR
                // =========================

                Emitente fornecedor = nfe.getNfe()
                                .getInfNFe()
                                .getEmitente();

                // =========================
                // PRODUTOS
                // =========================

                List<Det> itens = nfe.getNfe()
                                .getInfNFe()
                                .getItens();

                if (itens == null) {
                        itens = new ArrayList<>();
                }

                // Converte Det -> Produto
                List<Produto> produtos = itens.stream()
                                .map(item -> item.getProduto())
                                .filter(Objects::nonNull)
                                .toList();

                // =========================
                // RETORNO
                // =========================

                return new DTORespostaForcedorProduto(
                                produtos,
                                fornecedor);
        }

}