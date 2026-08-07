package com.devteciot.API_erp.Services.ServicesSaida;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.devteciot.API_erp.Models.ModelSaida.ModelTbSaida;
import com.devteciot.API_erp.Models.ModelSaida.ModelTbSaidaProduto;
import com.devteciot.API_erp.Repository.RepositoryProduto;
import com.devteciot.API_erp.Repository.RepositorySaida;
import com.devteciot.API_erp.Repository.RepositorySaidaProduto;
import com.devteciot.API_erp.DTO.DTOSaida.DTOSaidaProduto.DTOSaidaProdutoGet;
import com.devteciot.API_erp.DTO.DTOSaida.DTOSaidaProduto.DTOSaidaProdutoPost;
import com.devteciot.API_erp.Mapper.MapperSaida.MapperProdutoSaida;
import com.devteciot.API_erp.Models.ModelTbProdutos;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceSaidaProduto {

 private final RepositorySaidaProduto repositorySaidaProduto;
 private final RepositorySaida repositorySaida;
 private final RepositoryProduto repositoryProdutos;

 @Transactional
 public DTOSaidaProdutoGet saveSaidaProduto(DTOSaidaProdutoPost dto) {

  ModelTbSaida saida = repositorySaida.findById(dto.saida_id())
    .orElseThrow(() -> new RuntimeException("Saída não encontrada."));

  ModelTbProdutos produto = repositoryProdutos.findById(dto.produto_id())
    .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

  ModelTbSaidaProduto item = new ModelTbSaidaProduto();

  item.setSaida_id(saida);
  item.setProduto_id(produto);
  item.setQuantidade(dto.quantidade());
  item.setValorUnitario(dto.valorUnitario());

  BigDecimal total = dto.valorUnitario()
    .multiply(BigDecimal.valueOf(dto.quantidade()));

  item.setValorTotal(total);

  repositorySaidaProduto.save(item);

  return MapperProdutoSaida.toDTOSaidaProduto(item);
 }

 public List<DTOSaidaProdutoGet> getListaSaidaProduto() {

  return repositorySaidaProduto.findAll()
    .stream()
    .map(MapperProdutoSaida::toDTOSaidaProduto)
    .toList();
 }

 public DTOSaidaProdutoGet getSaidaProduto(Long id) {

  ModelTbSaidaProduto item = repositorySaidaProduto.findById(id)
    .orElseThrow(() -> new RuntimeException("Item da saída não encontrado."));

  return MapperProdutoSaida.toDTOSaidaProduto(item);
 }

 @Transactional
 public DTOSaidaProdutoGet updateSaidaProduto(Long id,
   DTOSaidaProdutoPost dto) {

  ModelTbSaidaProduto item = repositorySaidaProduto.findById(id)
    .orElseThrow(() -> new RuntimeException("Item da saída não encontrado."));

  ModelTbSaida saida = repositorySaida.findById(dto.saida_id())
    .orElseThrow(() -> new RuntimeException("Saída não encontrada."));

  ModelTbProdutos produto = repositoryProdutos.findById(dto.produto_id())
    .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

  item.setSaida_id(saida);
  item.setProduto_id(produto);
  item.setQuantidade(dto.quantidade());
  item.setValorUnitario(dto.valorUnitario());

  BigDecimal total = dto.valorUnitario()
    .multiply(BigDecimal.valueOf(dto.quantidade()));

  item.setValorTotal(total);

  repositorySaidaProduto.save(item);

  return MapperProdutoSaida.toDTOSaidaProduto(item);
 }

 @Transactional
 public void deleteSaidaProduto(Long id) {

  ModelTbSaidaProduto item = repositorySaidaProduto.findById(id)
    .orElseThrow(() -> new RuntimeException("Item da saída não encontrado."));

  repositorySaidaProduto.delete(item);
 }

}
