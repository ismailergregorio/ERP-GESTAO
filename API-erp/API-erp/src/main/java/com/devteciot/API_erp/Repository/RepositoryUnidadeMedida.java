package com.devteciot.API_erp.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelTbUnidadeMedida;

public interface RepositoryUnidadeMedida extends JpaRepository<ModelTbUnidadeMedida, Long> {
 Optional<ModelTbUnidadeMedida> findByNome(String nome);
}
