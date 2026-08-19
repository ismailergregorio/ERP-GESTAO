package com.devteciot.API_erp.DTO.DTOXMLnota;

import java.util.List;

import com.devteciot.API_erp.Models.ModelXML.Emitente;
import com.devteciot.API_erp.Models.ModelXML.Produto;

public record DTORespostaForcedorProduto(List<Produto> produto, Emitente fornecedor) {

}
