package com.devteciot.API_erp.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelTbCategoria;

public interface RepositoryCategoria extends JpaRepository<ModelTbCategoria, Long> {
 Optional<ModelTbCategoria> findByNome(String nome);
}
