package com.devteciot.API_erp.Models.ModelXML;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import lombok.Data;

@Data
@MappedSuperclass
@XmlAccessorType(XmlAccessType.FIELD)
public class Produto {

 @XmlElement(name = "cProd", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String codigo;

 @XmlElement(name = "xProd", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String descricao;

 @Column(name="codigo_ean")
 @XmlElement(name = "cEAN", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String codigoEAN;

 @XmlElement(name = "NCM", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String ncm;

 @XmlElement(name = "CEST", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String cest;

 @XmlElement(name = "CFOP", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String cfop;

 @XmlElement(name = "uCom", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String unidadeComercial;

 @XmlElement(name = "uTrib", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String unidadeTributaria;

 @XmlElement(name = "qCom", namespace = "http://www.portalfiscal.inf.br/nfe")
 private BigDecimal quantidade;

 @XmlElement(name = "qTrib", namespace = "http://www.portalfiscal.inf.br/nfe")
 private BigDecimal quantidadeTributaria;

 @XmlElement(name = "vUnCom", namespace = "http://www.portalfiscal.inf.br/nfe")
 private BigDecimal valorUnitario;

 @XmlElement(name = "vUnTrib", namespace = "http://www.portalfiscal.inf.br/nfe")
 private BigDecimal valorUnitarioTributario;

 @XmlElement(name = "vProd", namespace = "http://www.portalfiscal.inf.br/nfe")
 private BigDecimal valorTotal;
}
