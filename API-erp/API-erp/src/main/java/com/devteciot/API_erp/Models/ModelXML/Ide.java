package com.devteciot.API_erp.Models.ModelXML;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
public class Ide {

 @XmlElement(name = "nNF", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String numero;

 @XmlElement(name = "serie", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String serie;

 @XmlElement(name = "dhEmi", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String dataEmissao;

 @XmlElement(name = "natOp", namespace = "http://www.portalfiscal.inf.br/nfe")
 private String naturezaOperacao;
}
