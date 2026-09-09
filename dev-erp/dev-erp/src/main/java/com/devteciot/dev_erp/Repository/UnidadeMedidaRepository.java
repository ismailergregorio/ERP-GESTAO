package com.devteciot.dev_erp.Repository;

import com.devteciot.dev_erp.Models.UnidadeMedida;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UnidadeMedidaRepository
  extends JpaRepository<UnidadeMedida, Long> {

 List<UnidadeMedida> findByAtivoTrue();

 boolean existsByNomeIgnoreCase(String nome);

 boolean existsBySiglaIgnoreCase(String sigla);
}
