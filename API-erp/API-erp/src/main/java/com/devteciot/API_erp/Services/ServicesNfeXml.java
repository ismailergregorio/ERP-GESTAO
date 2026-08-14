package com.devteciot.API_erp.Services;

import java.io.StringReader;

import com.devteciot.API_erp.Models.ModelXML.NfeProc;

import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.Unmarshaller;

public class ServicesNfeXml {
 public NfeProc lerXml(String xml) {

  try {

   JAXBContext context = JAXBContext.newInstance(NfeProc.class);

   Unmarshaller unmarshaller = context.createUnmarshaller();

   return (NfeProc) unmarshaller.unmarshal(
     new StringReader(xml));

  } catch (Exception e) {

   throw new RuntimeException(
     "Erro ao processar XML da NF-e",
     e);
  }
 }
}
