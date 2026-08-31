package com.devteciot.API_erp.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelNf.ModelNF;

public interface RepositoryNF extends JpaRepository<ModelNF, Long> {

 Optional<ModelNF> findByNNF(Integer nNF);

 boolean existsByNNF(Integer nNF);
}