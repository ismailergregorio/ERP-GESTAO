package com.devteciot.API_erp.Models.ModelXML;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
public class NFe {

 @XmlElement(name = "infNFe", namespace = "http://www.portalfiscal.inf.br/nfe")
 private InfNFe infNFe;

}
