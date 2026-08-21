package com.devteciot.API_erp.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.devteciot.API_erp.DTO.DTOFornecedores.DTOFornecedoresGet;
import com.devteciot.API_erp.DTO.DTOFornecedores.DTOFornecedoresPost;
import com.devteciot.API_erp.Exception.ResourceAlreadyExistsException;
import com.devteciot.API_erp.Exception.ResourceNotFoundException;
import com.devteciot.API_erp.Mapper.MapperFornecedores;
import com.devteciot.API_erp.Models.ModelTbFornecedores;
import com.devteciot.API_erp.Repository.RepositoryFornecedor;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceFornecedor {
  private final RepositoryFornecedor repositoryFornecedor;

  @Transactional
  public DTOFornecedoresGet saveFornecedor(DTOFornecedoresPost dto) {

    Optional<ModelTbFornecedores> fornecedor = repositoryFornecedor.findByCnpj(dto.cnpj());

    if (fornecedor.isPresent()) {
      throw new ResourceAlreadyExistsException("Fornecedor já cadastrado.");
    }

    ModelTbFornecedores novoFornecedor = new ModelTbFornecedores();

    novoFornecedor.setRazaoSocial(dto.razaoSocial());
    novoFornecedor.setInscricaoEstadual(dto.inscricaoEstadual());
    novoFornecedor.setNomeFantasia(dto.nomeFantasia());
    novoFornecedor.setCnpj(dto.cnpj());
    novoFornecedor.setTelefone(dto.telefone());
    novoFornecedor.setEmail(dto.email());

    repositoryFornecedor.save(novoFornecedor);

    return MapperFornecedores.toDTOFornecedores(novoFornecedor);
  }

  public List<DTOFornecedoresGet> getListaFornecedor() {

    return repositoryFornecedor.findAll()
        .stream()
        .map(MapperFornecedores::toDTOFornecedores)
        .toList();
  }

  public DTOFornecedoresGet getFornecedor(Long id) {

    ModelTbFornecedores fornecedor = repositoryFornecedor.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado."));

    return MapperFornecedores.toDTOFornecedores(fornecedor);
  }

  public DTOFornecedoresGet getFornecedor(String cnpj) {

    ModelTbFornecedores fornecedor = repositoryFornecedor.findByCnpj(cnpj)
        .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado."));

    return MapperFornecedores.toDTOFornecedores(fornecedor);
  }

  public DTOFornecedoresGet getFornecedorNome(String rasaoSocial) {

    ModelTbFornecedores fornecedor = repositoryFornecedor.findByRazaoSocial(rasaoSocial)
        .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado."));

    return MapperFornecedores.toDTOFornecedores(fornecedor);
  }

  @Transactional
  public DTOFornecedoresGet updateFornecedor(Long id, DTOFornecedoresPost dto) {

    ModelTbFornecedores fornecedor = repositoryFornecedor.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado."));

    Optional<ModelTbFornecedores> fornecedorExistente = repositoryFornecedor.findByCnpj(dto.cnpj());

    if (fornecedorExistente.isPresent()
        && !fornecedorExistente.get().getId().equals(id)) {

      throw new ResourceAlreadyExistsException("Já existe um fornecedor com este CNPJ.");
    }

    fornecedor.setRazaoSocial(dto.razaoSocial());
    fornecedor.setInscricaoEstadual(dto.inscricaoEstadual());
    fornecedor.setNomeFantasia(dto.nomeFantasia());
    fornecedor.setCnpj(dto.cnpj());
    fornecedor.setTelefone(dto.telefone());
    fornecedor.setEmail(dto.email());

    repositoryFornecedor.save(fornecedor);

    return MapperFornecedores.toDTOFornecedores(fornecedor);
  }

  @Transactional
  public void deleteFornecedor(Long id) {

    ModelTbFornecedores fornecedor = repositoryFornecedor.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado."));

    repositoryFornecedor.delete(fornecedor);
  }
}
