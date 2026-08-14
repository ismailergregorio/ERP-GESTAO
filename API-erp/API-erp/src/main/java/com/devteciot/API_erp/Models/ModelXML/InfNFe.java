package com.devteciot.API_erp.Models.ModelXML;

import java.util.ArrayList;
import java.util.List;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlAttribute;
import jakarta.xml.bind.annotation.XmlElement;
import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
public class InfNFe {

 @XmlAttribute(name = "Id")
 private String id;

 @XmlElement(name = "ide", namespace = "http://www.portalfiscal.inf.br/nfe")
 private Ide ide;

 @XmlElement(name = "emit", namespace = "http://www.portalfiscal.inf.br/nfe")
 private Emitente emitente;

 @XmlElement(name = "det", namespace = "http://www.portalfiscal.inf.br/nfe")
 private List<Det> itens = new ArrayList<>();
}
