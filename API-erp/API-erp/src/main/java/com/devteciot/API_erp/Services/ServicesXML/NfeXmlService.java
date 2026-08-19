package com.devteciot.API_erp.Services.ServicesXML;

import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.Unmarshaller;

import org.springframework.stereotype.Service;

import com.devteciot.API_erp.DTO.DTOXMLnota.DTORespostaForcedorProduto;
import com.devteciot.API_erp.Models.ModelXML.Det;
import com.devteciot.API_erp.Models.ModelXML.Emitente;
import com.devteciot.API_erp.Models.ModelXML.NfeProc;
import com.devteciot.API_erp.Models.ModelXML.Produto;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class NfeXmlService {

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
                                .map(Det::getProduto)
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