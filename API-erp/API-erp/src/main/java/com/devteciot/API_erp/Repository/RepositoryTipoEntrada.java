package com.devteciot.API_erp.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelEntrada.ModelTbTipoEntrada;

public interface RepositoryTipoEntrada extends JpaRepository<ModelTbTipoEntrada, Long> {
 Optional<ModelTbTipoEntrada> findByNome(String nome);
}
