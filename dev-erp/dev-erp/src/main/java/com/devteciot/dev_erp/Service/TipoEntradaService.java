package com.devteciot.dev_erp.Service;


import com.devteciot.dev_erp.DTO.DTOTipoEntrada.TipoEntradaGetDTO;
import com.devteciot.dev_erp.DTO.DTOTipoEntrada.TipoEntradaPostDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.TipoEntradaMapper;
import com.devteciot.dev_erp.Models.TipoEntrada;
import com.devteciot.dev_erp.Repository.TipoEntradaRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoEntradaService {

    private final TipoEntradaRepository repository;
    private final TipoEntradaMapper mapper;

    // ============================================================
    // CRIAR
    // ============================================================

    public TipoEntradaGetDTO criar(TipoEntradaPostDTO dto) {

        if (repository.existsByNomeIgnoreCase(dto.nome())) {
            throw new IllegalArgumentException(
                    "Já existe um tipo de entrada com o nome: " + dto.nome()
            );
        }

        TipoEntrada tipoEntrada = mapper.toEntity(dto);

        TipoEntrada salvo = repository.save(tipoEntrada);

        return mapper.toGetDTO(salvo);
    }

    // ============================================================
    // LISTAR TODOS
    // ============================================================

    public List<TipoEntradaGetDTO> listar() {

        return repository.findAll()
                .stream()
                .map(mapper::toGetDTO)
                .toList();
    }

    // ============================================================
    // BUSCAR POR ID
    // ============================================================

    public TipoEntradaGetDTO buscarPorId(Long id) {

        TipoEntrada tipoEntrada = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tipo de entrada não encontrado com o ID: " + id
                        )
                );

        return mapper.toGetDTO(tipoEntrada);
    }

    // ============================================================
    // ATUALIZAR
    // ============================================================

    public TipoEntradaGetDTO atualizar(
            Long id,
            TipoEntradaPostDTO dto
    ) {

        TipoEntrada tipoEntrada = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tipo de entrada não encontrado com o ID: " + id
                        )
                );

        /*
         * Verifica se o novo nome já pertence
         * a outro tipo de entrada.
         */
        if (!tipoEntrada.getNome().equalsIgnoreCase(dto.nome())
                && repository.existsByNomeIgnoreCase(dto.nome())) {

            throw new IllegalArgumentException(
                    "Já existe um tipo de entrada com o nome: " + dto.nome()
            );
        }

        mapper.updateEntity(tipoEntrada, dto);

        TipoEntrada atualizado = repository.save(tipoEntrada);

        return mapper.toGetDTO(atualizado);
    }

    // ============================================================
    // EXCLUIR
    // ============================================================

    public void excluir(Long id) {

        TipoEntrada tipoEntrada = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tipo de entrada não encontrado com o ID: " + id
                        )
                );

        repository.delete(tipoEntrada);
    }
}
