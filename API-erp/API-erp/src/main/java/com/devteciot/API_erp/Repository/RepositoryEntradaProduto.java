package com.devteciot.API_erp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelEntrada.ModelTbEntradaProduto;

public interface RepositoryEntradaProduto extends JpaRepository<ModelTbEntradaProduto, Long> {
 
}
