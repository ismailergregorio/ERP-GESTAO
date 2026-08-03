package com.devteciot.API_erp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelTbProdutos;

public interface RepositoryProduto extends JpaRepository<ModelTbProdutos, Long> {
 
}
