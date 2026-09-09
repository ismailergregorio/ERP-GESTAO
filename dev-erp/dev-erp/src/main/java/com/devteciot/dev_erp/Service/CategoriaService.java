package com.devteciot.dev_erp.Service;

import com.devteciot.dev_erp.DTO.DTOCategoria.CategoriaGetDTO;
import com.devteciot.dev_erp.DTO.DTOCategoria.CategoriaPostDTO;
import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Mapper.CategoriaMapper;
import com.devteciot.dev_erp.Models.Categoria;
import com.devteciot.dev_erp.Repository.CategoriaRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

  private final CategoriaRepository repository;

  private final CategoriaMapper mapper;

  public CategoriaGetDTO criar(CategoriaPostDTO dto) {

    if (repository.existsByNomeIgnoreCase(dto.nome())) {

      throw new IllegalArgumentException(
          "Já existe uma categoria com o nome: "
              + dto.nome());
    }

    Categoria categoria = mapper.toEntity(dto);

    Categoria salva = repository.save(categoria);

    return mapper.toGetDTO(salva);
  }

  public List<CategoriaGetDTO> listar() {

    return repository.findAll()
        .stream()
        .map(mapper::toGetDTO)
        .toList();
  }

  public CategoriaGetDTO buscarPorId(Long id) {

    Categoria categoria = repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(
            "Categoria não encontrada com o ID: " + id));

    return mapper.toGetDTO(categoria);
  }

  public List<CategoriaGetDTO> listarAtivas() {

    return repository.findByAtivoTrue()
        .stream()
        .map(mapper::toGetDTO)
        .toList();
  }

  public CategoriaGetDTO atualizar(
      Long id,
      CategoriaPostDTO dto) {

    Categoria categoria = repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(
            "Categoria não encontrada com o ID: " + id));

    mapper.updateEntity(categoria, dto);

    Categoria atualizada = repository.save(categoria);

    return mapper.toGetDTO(atualizada);
  }

  public void excluir(Long id) {

    Categoria categoria = repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(
            "Categoria não encontrada com o ID: " + id));

    categoria.setAtivo(false);

    repository.save(categoria);
  }
}