package com.devteciot.API_erp.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelEntrada.ModelTbEntradaProduto;

public interface RepositoryEntradaProduto extends JpaRepository<ModelTbEntradaProduto, Long> {
 // List<ModelTbEntradaProduto> findByEntrada_idId(Long entradaId);
  List<ModelTbEntradaProduto> findByEntrada_Id(Long entradaId);
}
