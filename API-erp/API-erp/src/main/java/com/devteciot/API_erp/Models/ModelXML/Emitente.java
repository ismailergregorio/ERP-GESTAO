package com.devteciot.API_erp.Models.ModelXML;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
public class Emitente {

 @XmlElement(name = "xNome", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String razaoSocial;

 @XmlElement(name = "xFant", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String nomeFantasia;

 @XmlElement(name = "CNPJ", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String cnpj;

 @XmlElement(name = "IE", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String inscricaoEstadual;

 @XmlElement(name = "CRT", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String crt;
}