package com.devteciot.dev_erp.Controller;

import com.devteciot.dev_erp.DTO.DTOMovimentacao.MovimentacaoGetDTO;
import com.devteciot.dev_erp.Service.MovimentacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/movimentacoes")
@RequiredArgsConstructor
public class MovimentacaoController {
    private final MovimentacaoService service;

    @GetMapping
    public ResponseEntity<List<MovimentacaoGetDTO>> listar() { return ResponseEntity.ok(service.listar()); }

    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<List<MovimentacaoGetDTO>> listarPorProduto(@PathVariable Long produtoId) { return ResponseEntity.ok(service.listarPorProduto(produtoId)); }
}
