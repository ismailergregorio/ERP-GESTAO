package com.devteciot.API_erp.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelSaida.ModelTbTipoSaida;

public interface RepositoryTipoSaida extends JpaRepository<ModelTbTipoSaida, Long> {
 Optional<ModelTbTipoSaida> findByNome(String nome);
}