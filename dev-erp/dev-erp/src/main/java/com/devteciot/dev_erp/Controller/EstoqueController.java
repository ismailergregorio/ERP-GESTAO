package com.devteciot.dev_erp.Controller;

import com.devteciot.dev_erp.DTO.DTOEstoque.EstoqueProdutoGetDTO;
import com.devteciot.dev_erp.Service.EstoqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/estoque")
@RequiredArgsConstructor
public class EstoqueController {
    private final EstoqueService service;

    @GetMapping
    public ResponseEntity<List<EstoqueProdutoGetDTO>> listar() { return ResponseEntity.ok(service.listar()); }

    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<EstoqueProdutoGetDTO> buscar(@PathVariable Long produtoId) { return ResponseEntity.ok(service.buscar(produtoId)); }
}
