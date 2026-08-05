package com.devteciot.API_erp.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelTbCentroCusto;

public interface RepositoryCentroCusto extends JpaRepository<ModelTbCentroCusto, Long> {
 Optional<ModelTbCentroCusto> findByNome(String nome);
}