package com.devteciot.dev_erp.Controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.devteciot.dev_erp.Service.NFService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notas-fiscais")
@RequiredArgsConstructor
public class NfController {

    private final NFService service;

    @PostMapping(
        value = "/importar",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Map<String, Object>> importar(
            @RequestParam("arquivo") MultipartFile arquivo)
            throws IOException {

        if (arquivo == null || arquivo.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }

        Map<String, Object> resposta =
                service.importarXML(
                        arquivo.getInputStream()
                );

        return ResponseEntity.ok(resposta);
    }
}