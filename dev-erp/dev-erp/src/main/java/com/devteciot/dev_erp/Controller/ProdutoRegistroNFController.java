package com.devteciot.dev_erp.Controller;

import com.devteciot.dev_erp.DTO.ProdutoRegistroNF.ProdutoRegistroNFGetDTO;
import com.devteciot.dev_erp.DTO.ProdutoRegistroNF.ProdutoRegistroNFPostDTO;
import com.devteciot.dev_erp.Service.ProdutoRegistroNFService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos-registro-nf")
@RequiredArgsConstructor
public class ProdutoRegistroNFController {

    private final ProdutoRegistroNFService service;


    /*
     * =====================================================
     * POST
     * =====================================================
     */

    @PostMapping
    public ResponseEntity<ProdutoRegistroNFGetDTO> criar(
            @Valid @RequestBody ProdutoRegistroNFPostDTO dto
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        service.criar(dto)
                );
    }


    /*
     * =====================================================
     * GET
     * =====================================================
     */

    @GetMapping
    public ResponseEntity<List<ProdutoRegistroNFGetDTO>> listar() {

        return ResponseEntity.ok(
                service.listar()
        );
    }


    /*
     * =====================================================
     * GET ATIVOS
     * =====================================================
     */

    @GetMapping("/ativos")
    public ResponseEntity<List<ProdutoRegistroNFGetDTO>> listarAtivos() {

        return ResponseEntity.ok(
                service.listarAtivos()
        );
    }


    /*
     * =====================================================
     * GET POR ID
     * =====================================================
     */

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoRegistroNFGetDTO> buscarPorId(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                service.buscarPorId(id)
        );
    }


    /*
     * =====================================================
     * GET POR NF
     * =====================================================
     */

    @GetMapping("/nf/{nfId}")
    public ResponseEntity<List<ProdutoRegistroNFGetDTO>> listarPorNF(
            @PathVariable Long nfId
    ) {

        return ResponseEntity.ok(
                service.listarPorNF(nfId)
        );
    }


    /*
     * =====================================================
     * PUT
     * =====================================================
     */

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoRegistroNFGetDTO> atualizar(
            @PathVariable Long id,

            @Valid @RequestBody ProdutoRegistroNFPostDTO dto
    ) {

        return ResponseEntity.ok(
                service.atualizar(
                        id,
                        dto
                )
        );
    }


    /*
     * =====================================================
     * DELETE LÓGICO
     * =====================================================
     */

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id
    ) {

        service.excluir(id);

        return ResponseEntity.noContent().build();
    }
}