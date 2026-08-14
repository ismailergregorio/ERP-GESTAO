package com.devteciot.API_erp.Models.ModelXML;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
public class Det {

 @XmlElement(name = "nItem", namespace = "http://www.portalfiscal.inf.br/nfe")
 private Integer numeroItem;

 @XmlElement(name = "prod", namespace = "http://www.portalfiscal.inf.br/nfe")
 private Produto produto;
}
