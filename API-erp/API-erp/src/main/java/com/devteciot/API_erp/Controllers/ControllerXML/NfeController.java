package com.devteciot.API_erp.Controllers.ControllerXML;

import java.nio.charset.StandardCharsets;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.devteciot.API_erp.DTO.DTOXMLnota.DTORespostaForcedorProduto;
import com.devteciot.API_erp.Services.ServicesXML.NfeXmlService;

@RestController
@RequestMapping("/api/nfe")
public class NfeController {

        private final NfeXmlService nfeXmlService;

        public NfeController(NfeXmlService nfeXmlService) {
                this.nfeXmlService = nfeXmlService;
        }

        @PostMapping(value = "/importar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> importarNfe(
                        @RequestParam("arquivo") MultipartFile arquivo) {

                try {

                        if (arquivo == null || arquivo.isEmpty()) {

                                return ResponseEntity
                                                .badRequest()
                                                .body("Arquivo não informado.");
                        }

                        String nomeArquivo = arquivo.getOriginalFilename();

                        if (nomeArquivo == null ||
                                        !nomeArquivo.toLowerCase().endsWith(".xml")) {

                                return ResponseEntity
                                                .badRequest()
                                                .body("Envie um arquivo XML.");
                        }

                        String xml = new String(
                                        arquivo.getBytes(),
                                        StandardCharsets.UTF_8);

                        DTORespostaForcedorProduto resposta = nfeXmlService.obterProdutosComFornecedor(xml);

                        return ResponseEntity.ok(resposta);

                } catch (Exception e) {

                        return ResponseEntity
                                        .internalServerError()
                                        .body(
                                                        "Erro ao processar NF-e: "
                                                                        + e.getMessage());
                }
        }
}
