package com.devteciot.dev_erp.Controller;

import com.devteciot.dev_erp.DTO.DTOSaida.AssinaturaSaidaPostDTO;
import com.devteciot.dev_erp.DTO.DTOSaida.SaidaEpiPostDTO;
import com.devteciot.dev_erp.DTO.DTOSaida.SaidaGetDTO;
import com.devteciot.dev_erp.DTO.DTOSaida.SaidaPostDTO;
import com.devteciot.dev_erp.Service.SaidaPdfService;
import com.devteciot.dev_erp.Service.SaidaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saidas")
@RequiredArgsConstructor
public class SaidaController {
    private final SaidaService service;
    private final SaidaPdfService pdfService;

    @PostMapping
    public ResponseEntity<SaidaGetDTO> criar(@Valid @RequestBody SaidaPostDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PostMapping("/epi")
    public ResponseEntity<SaidaGetDTO> criarSaidaEpi(@Valid @RequestBody SaidaEpiPostDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criarEpi(dto));
    }

    @PostMapping("/{id}/assinatura")
    public ResponseEntity<SaidaGetDTO> registrarAssinatura(@PathVariable Long id, @Valid @RequestBody AssinaturaSaidaPostDTO dto) {
        return ResponseEntity.ok(service.registrarAssinatura(id, dto));
    }

    @GetMapping
    public ResponseEntity<List<SaidaGetDTO>> listar() { return ResponseEntity.ok(service.listar()); }

    @GetMapping("/{id}")
    public ResponseEntity<SaidaGetDTO> buscarPorId(@PathVariable Long id) { return ResponseEntity.ok(service.buscarPorId(id)); }

    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> gerarPdf(@PathVariable Long id) {
        byte[] pdf = pdfService.gerar(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=saida-" + id + ".pdf")
                .body(pdf);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SaidaGetDTO> atualizar(@PathVariable Long id, @Valid @RequestBody SaidaPostDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        service.desativar(id);
        return ResponseEntity.noContent().build();
    }
}
