package com.devteciot.API_erp.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelTbProdutos;

public interface RepositoryProduto extends JpaRepository<ModelTbProdutos, Long> {
 Optional<ModelTbProdutos> findByNome(String nome);
}
