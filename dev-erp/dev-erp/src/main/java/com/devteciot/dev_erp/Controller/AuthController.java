package com.devteciot.dev_erp.Controller;

import com.devteciot.dev_erp.DTO.DTOAcesso.*;
import com.devteciot.dev_erp.Service.UsuarioAcessoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final UsuarioAcessoService service;

    @PostMapping("/login")
    public ResponseEntity<LoginResposta> login(@Valid @RequestBody LoginRequest request) { return ResponseEntity.ok(service.login(request)); }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResposta> atual() { return ResponseEntity.ok(service.atual()); }

    @PatchMapping("/me/nome")
    public ResponseEntity<UsuarioResposta> atualizarMeuNome(@Valid @RequestBody AtualizarNomeRequest request) {
        return ResponseEntity.ok(service.atualizarMeuNome(request));
    }

    @PostMapping("/alterar-senha")
    public ResponseEntity<Void> alterarSenha(@Valid @RequestBody AlterarSenhaRequest request) {
        service.alterarSenha(request);
        return ResponseEntity.noContent().build();
    }
}
