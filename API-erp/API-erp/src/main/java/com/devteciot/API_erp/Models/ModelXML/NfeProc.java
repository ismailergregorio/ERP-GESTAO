package com.devteciot.API_erp.Models.ModelXML;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Data;

@Data
@XmlRootElement(name = "nfeProc", namespace = "http://www.portalfiscal.inf.br/nfe")
@XmlAccessorType(XmlAccessType.FIELD)
public class NfeProc {

 @XmlElement(name = "NFe", namespace = "http://www.portalfiscal.inf.br/nfe")
 private NFe nfe;
}
