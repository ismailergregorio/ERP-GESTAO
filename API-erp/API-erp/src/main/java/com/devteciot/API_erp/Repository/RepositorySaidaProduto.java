package com.devteciot.API_erp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelSaida.ModelTbSaidaProduto;

public interface RepositorySaidaProduto extends JpaRepository<ModelTbSaidaProduto, Long> {

}