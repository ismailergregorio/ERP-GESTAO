package com.devteciot.API_erp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devteciot.API_erp.Models.ModelTbFornecedores;


public interface RepositoryFornecedor extends JpaRepository<ModelTbFornecedores, Long> {
 
}
