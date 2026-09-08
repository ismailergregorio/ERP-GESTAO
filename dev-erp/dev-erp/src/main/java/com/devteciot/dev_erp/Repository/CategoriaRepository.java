package com.devteciot.dev_erp.Repository;

import com.devteciot.dev_erp.Models.Categoria;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaRepository
  extends JpaRepository<Categoria, Long> {

 List<Categoria> findByAtivoTrue();

 boolean existsByNomeIgnoreCase(String nome);
}