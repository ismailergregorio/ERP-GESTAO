package com.devteciot.dev_erp.Service;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.devteciot.dev_erp.DTO.DTONf.NotaFiscalDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.NfMapper;
import com.devteciot.dev_erp.Models.ModelNF.FornecedorNF;
import com.devteciot.dev_erp.Models.ModelNF.NF;
import com.devteciot.dev_erp.Models.ModelNF.ProdutoNF;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NFService {

  private final NfMapper mapper;
  private final FornecedorService fornecedorService;

  public Map<String, Object> importarXML(InputStream inputStream) {

    try {

      DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

      factory.setNamespaceAware(true);

      Document document = factory.newDocumentBuilder().parse(inputStream);

      document.getDocumentElement().normalize();

      NF nota = new NF();

      // Extrai os dados da nota
      extrairDadosNota(document, nota);

      // Extrai o fornecedor
      extrairFornecedor(document, nota);

      // Extrai os produtos
      extrairProdutos(document, nota);

      // Converte para o DTO
      NotaFiscalDTO dto = mapper.toDTO(nota);

      try {

        // Verifica se o fornecedor existe
        verificarFornecedor(nota);

      } catch (ResourceNotFoundException e) {

        Map<String, Object> resposta = new LinkedHashMap<>();

        resposta.put("erro", e.getMessage());
        resposta.put("dados", dto);

        return resposta;
      }

      Map<String, Object> resposta = new LinkedHashMap<>();

      resposta.put("dados", dto);

      return resposta;

    } catch (Exception e) {

      throw new RuntimeException(
          "Erro ao processar XML da NF-e",
          e);
    }
  }

  private void verificarFornecedor(NF nota) {

    if (nota.getFornecedor() == null) {

      throw new ResourceNotFoundException(
          "Fornecedor não encontrado no XML da NF-e.");
    }

    String cnpj = nota.getFornecedor().getCnpj();

    if (cnpj == null || cnpj.isBlank()) {

      throw new ResourceNotFoundException(
          "CNPJ do fornecedor não encontrado no XML da NF-e.");
    }

    // Remove pontos, barras e traços
    String cnpjLimpo = cnpj.replaceAll("\\D", "");

    fornecedorService.buscarPorCnpj(cnpjLimpo);
  }

  private void extrairDadosNota(
      Document document,
      NF nota) {

    Element infNFe = getElement(document, "infNFe");

    if (infNFe != null) {

      String id = infNFe.getAttribute("Id");

      if (id.startsWith("NFe")) {

        nota.setChaveAcesso(
            id.substring(3));
      }
    }

    Element ide = getElement(document, "ide");

    if (ide == null) {
      return;
    }

    nota.setNumero(
        getValue(ide, "nNF"));

    nota.setSerie(
        getValue(ide, "serie"));

    String data = getValue(ide, "dhEmi");

    if (data != null) {

      nota.setDataEmissao(
          OffsetDateTime
              .parse(data)
              .toLocalDateTime());
    }

    Element total = getElement(document, "ICMSTot");

    if (total != null) {

      nota.setValorTotal(
          decimal(
              getValue(total, "vNF")));
    }
  }

  private void extrairFornecedor(
      Document document,
      NF nota) {

    Element emit = getElement(document, "emit");

    if (emit == null) {
      return;
    }

    FornecedorNF fornecedor = new FornecedorNF();

    fornecedor.setCnpj(
        getValue(emit, "CNPJ"));

    fornecedor.setRazaoSocial(
        getValue(emit, "xNome"));

    fornecedor.setNomeFantasia(
        getValue(emit, "xFant"));

    fornecedor.setInscricaoEstadual(
        getValue(emit, "IE"));

    Element endereco = getChildElement(
        emit,
        "enderEmit");

    if (endereco != null) {

      fornecedor.setLogradouro(
          getValue(endereco, "xLgr"));

      fornecedor.setNumero(
          getValue(endereco, "nro"));

      fornecedor.setBairro(
          getValue(endereco, "xBairro"));

      fornecedor.setMunicipio(
          getValue(endereco, "xMun"));

      fornecedor.setUf(
          getValue(endereco, "UF"));

      fornecedor.setCep(
          getValue(endereco, "CEP"));
    }

    nota.setFornecedor(fornecedor);
  }

  private void extrairProdutos(
      Document document,
      NF nota) {

    List<ProdutoNF> produtos = new ArrayList<>();

    NodeList detalhes = document.getElementsByTagNameNS(
        "*",
        "det");

    for (int i = 0; i < detalhes.getLength(); i++) {

      Element det = (Element) detalhes.item(i);

      Element prod = getChildElement(
          det,
          "prod");

      if (prod == null) {
        continue;
      }

      ProdutoNF produto = new ProdutoNF();

      produto.setCodigo(
          getValue(prod, "cProd"));

      produto.setDescricao(
          getValue(prod, "xProd"));

      produto.setNcm(
          getValue(prod, "NCM"));

      produto.setCfop(
          getValue(prod, "CFOP"));

      produto.setUnidade(
          getValue(prod, "uCom"));

      produto.setQuantidade(
          decimal(
              getValue(prod, "qCom")));

      produto.setValorUnitario(
          decimal(
              getValue(prod, "vUnCom")));

      produto.setValorTotal(
          decimal(
              getValue(prod, "vProd")));

      produtos.add(produto);
    }

    nota.setProdutos(produtos);
  }

  private Element getElement(
      Document document,
      String tag) {

    NodeList nodes = document.getElementsByTagNameNS(
        "*",
        tag);

    if (nodes.getLength() == 0) {
      return null;
    }

    return (Element) nodes.item(0);
  }

  private Element getChildElement(
      Element parent,
      String tag) {

    NodeList nodes = parent.getElementsByTagNameNS(
        "*",
        tag);

    if (nodes.getLength() == 0) {
      return null;
    }

    return (Element) nodes.item(0);
  }

  private String getValue(
      Element parent,
      String tag) {

    Element element = getChildElement(
        parent,
        tag);

    return element != null
        ? element.getTextContent()
        : null;
  }

  private BigDecimal decimal(String value) {

    if (value == null || value.isBlank()) {
      return null;
    }

    return new BigDecimal(value);
  }
}