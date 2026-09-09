package com.devteciot.dev_erp.Repository;

import com.devteciot.dev_erp.Models.Produto;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoRepository
  extends JpaRepository<Produto, Long> {

 List<Produto> findByAtivoTrue();

 boolean existsByNomeIgnoreCase(String nome);

 boolean existsByCategoriaId(Long categoriaId);

 boolean existsByUnidadeMedidaId(Long unidadeMedidaId);
}