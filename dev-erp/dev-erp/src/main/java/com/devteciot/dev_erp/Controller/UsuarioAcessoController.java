package com.devteciot.dev_erp.Controller;

import com.devteciot.dev_erp.DTO.DTOAcesso.UsuarioCriacaoRequest;
import com.devteciot.dev_erp.DTO.DTOAcesso.ResetarSenhaRequest;
import com.devteciot.dev_erp.DTO.DTOAcesso.UsuarioResposta;
import com.devteciot.dev_erp.Service.UsuarioAcessoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/usuarios") @RequiredArgsConstructor
public class UsuarioAcessoController {
    private final UsuarioAcessoService service;

    @PostMapping
    public ResponseEntity<UsuarioResposta> criar(@Valid @RequestBody UsuarioCriacaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(request));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResposta>> listar() { return ResponseEntity.ok(service.listar()); }

    @PostMapping("/{id}/resetar-senha")
    public ResponseEntity<Void> resetarSenha(@PathVariable Long id,
            @Valid @RequestBody ResetarSenhaRequest request) {
        service.resetarSenha(id, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UsuarioResposta> alterarStatus(@PathVariable Long id, @RequestParam boolean ativo) {
        return ResponseEntity.ok(service.alterarStatus(id, ativo));
    }
}
